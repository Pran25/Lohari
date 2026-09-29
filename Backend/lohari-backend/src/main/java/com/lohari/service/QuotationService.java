package com.lohari.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.lohari.dto.QuotationDTO.QuotationRequest;
import com.lohari.dto.QuotationDTO.QuotationResponse;
import com.lohari.model.Order;
import com.lohari.model.OrderStatus;  // ✅ ADDED
import com.lohari.repository.OrderRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
public class QuotationService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.company.name:Lohari Fabrication}")
    private String companyName;

    // Colors
    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(15, 23, 42);
    private static final DeviceRgb SECONDARY_COLOR = new DeviceRgb(34, 211, 238);
    private static final DeviceRgb ACCENT_COLOR = new DeviceRgb(99, 102, 241);
    private static final DeviceRgb LIGHT_GRAY = new DeviceRgb(241, 245, 249);
    private static final DeviceRgb WARNING_COLOR = new DeviceRgb(245, 158, 11);

    private static final String FRONTEND_URL = "http://localhost:5173";

    // ============================================
    // MAIN: Calculate + Generate PDF + Email
    // ============================================
    public QuotationResponse generateQuotation(QuotationRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
            .orElseThrow(() -> new EntityNotFoundException("Order not found: " + request.getOrderId()));

        // Calculate breakdown
        QuotationResponse response = calculateQuotation(order, request);

        // Generate PDF
        byte[] pdfBytes = buildQuotationPdf(order, response);

        // Send email to customer
        sendQuotationEmail(order, response, pdfBytes);

        // ✅ AUTO-UPDATE ORDER STATUS → QUOTE_SENT
        try {
            OrderStatus currentStatus = order.getStatus();

            // Only update if current status is PENDING
            if (currentStatus == OrderStatus.PENDING) {
                order.setStatus(OrderStatus.QUOTE_SENT);
                order.addTracking(
                    OrderStatus.QUOTE_SENT,
                    "Admin Panel",
                    "Quotation " + response.getQuoteNumber() + " sent to customer",
                    "ADMIN"
                );
                orderRepository.save(order);
                System.out.println("✅ Order " + order.getOrderNumber() +
                    " status updated to QUOTE_SENT");
            } else {
                System.out.println("ℹ️ Order " + order.getOrderNumber() +
                    " status not changed (current: " + currentStatus + ")");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Failed to update order status: " + e.getMessage());
            // Don't fail the quotation if status update fails
        }

        return response;
    }

    // ============================================
    // CALCULATION ENGINE
    // ============================================
    private QuotationResponse calculateQuotation(Order order, QuotationRequest req) {
        QuotationResponse res = new QuotationResponse();

        // ---- Quote number ----
        String quoteNum = "QT-" + LocalDate.now().getYear() + "-" +
            String.format("%04d", order.getId());
        res.setQuoteNumber(quoteNum);
        res.setOrderId(order.getId());
        res.setOrderNumber(order.getOrderNumber());

        // ---- Product details ----
        res.setProductName(safe(order.getProductName()));
        res.setMaterial(safe(order.getMaterial()));
        res.setFinish(safe(order.getFinish()));
        int qty = order.getQuantity() != null ? order.getQuantity() : 1;
        res.setQuantity(qty);

        // Size
        if (order.getWidth() != null && order.getHeight() != null) {
            res.setSize(order.getWidth() + " x " + order.getHeight() + " " + safe(order.getUnit()));
        } else {
            res.setSize("N/A");
        }

        // ---- Weight ----
        BigDecimal weightPerItem = req.getWeightPerItemKg() != null
            ? req.getWeightPerItemKg()
            : BigDecimal.valueOf(25);
        BigDecimal totalWeight = weightPerItem.multiply(BigDecimal.valueOf(qty));
        res.setWeightPerItemKg(weightPerItem);
        res.setTotalWeightKg(totalWeight);

        // ---- Rate ----
        BigDecimal ratePerKg = req.getRatePerKg() != null
            ? req.getRatePerKg()
            : BigDecimal.valueOf(100);
        res.setRatePerKg(ratePerKg);

        // ---- Metal cost ----
        BigDecimal metalCost = totalWeight.multiply(ratePerKg)
            .setScale(2, RoundingMode.HALF_UP);
        res.setMetalCost(metalCost);

        // ---- Extra charges ----
        BigDecimal labour = req.getLabourCharges() != null ? req.getLabourCharges() : BigDecimal.valueOf(2000);
        BigDecimal design = req.getDesignCharges() != null ? req.getDesignCharges() : BigDecimal.valueOf(500);
        BigDecimal transport = req.getTransportCharges() != null ? req.getTransportCharges() : BigDecimal.ZERO;

        res.setLabourCharges(labour);
        res.setDesignCharges(design);
        res.setTransportCharges(transport);

        // ---- Subtotal ----
        BigDecimal subtotal = metalCost.add(labour).add(design).add(transport);
        res.setSubtotal(subtotal);

        // ---- Profit ----
        BigDecimal profitPct = req.getProfitPercent() != null ? req.getProfitPercent() : BigDecimal.valueOf(15);
        BigDecimal profitAmount = subtotal.multiply(profitPct)
            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        res.setProfitPercent(profitPct);
        res.setProfitAmount(profitAmount);

        // ---- Before GST ----
        BigDecimal beforeGst = subtotal.add(profitAmount);
        res.setBeforeGst(beforeGst);

        // ---- GST ----
        BigDecimal gstPct = req.getGstPercent() != null ? req.getGstPercent() : BigDecimal.valueOf(18);
        BigDecimal gstAmount = beforeGst.multiply(gstPct)
            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        res.setGstPercent(gstPct);
        res.setGstAmount(gstAmount);

        // ---- Grand Total ----
        BigDecimal grandTotal = beforeGst.add(gstAmount);
        res.setGrandTotal(grandTotal);

        // ---- Advance ----
        BigDecimal advPct = req.getAdvancePercent() != null ? req.getAdvancePercent() : BigDecimal.valueOf(30);
        BigDecimal advanceAmt = grandTotal.multiply(advPct)
            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal balanceAmt = grandTotal.subtract(advanceAmt);

        res.setAdvancePercent(advPct);
        res.setAdvanceAmount(advanceAmt);
        res.setBalanceAmount(balanceAmt);

        // ---- Meta ----
        res.setValidityDays(req.getValidityDays() != null ? req.getValidityDays() : 15);
        res.setNotes(req.getNotes() != null ? req.getNotes() : "");

        return res;
    }

    // ============================================
    // PDF BUILDER
    // ============================================
    private byte[] buildQuotationPdf(Order order, QuotationResponse q) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(30, 40, 30, 40);

            // HEADER
            addHeader(document, order, q);

            document.add(new Paragraph()
                .setBorderBottom(new SolidBorder(SECONDARY_COLOR, 2))
                .setMarginTop(8)
                .setMarginBottom(12));

            // CUSTOMER
            addCustomerDetails(document, order);

            // PRODUCT DETAILS
            addProductDetails(document, order, q);

            // PRICING BREAKDOWN
            addPricingBreakdown(document, q);

            // TERMS + QR
            addTermsAndQr(document, order, q);

            // SIGNATURE + FOOTER
            addSignatureAndFooter(document);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate quotation: " + e.getMessage(), e);
        }
    }

    private void addHeader(Document document, Order order, QuotationResponse q) throws Exception {
        Table header = new Table(UnitValue.createPercentArray(new float[]{55, 45}))
            .useAllAvailableWidth();

        // Left — company
        Cell companyCell = new Cell().setBorder(Border.NO_BORDER).setPadding(5)
            .setVerticalAlignment(VerticalAlignment.MIDDLE);

        Image logo = loadLogo();
        if (logo != null) {
            logo.setWidth(70).setHeight(70).setMarginBottom(8);
            companyCell.add(logo);
        }

        companyCell.add(new Paragraph("LOHARI FABRICATION")
            .setBold().setFontSize(18).setFontColor(PRIMARY_COLOR).setMarginBottom(2));
        companyCell.add(new Paragraph("Custom Metal Fabrication & Design")
            .setFontSize(9).setFontColor(ColorConstants.GRAY).setItalic().setMarginBottom(6));
        companyCell.add(new Paragraph("123 Industrial Area, City").setFontSize(8.5f));
        companyCell.add(new Paragraph("State - 123456, India").setFontSize(8.5f));
        companyCell.add(new Paragraph("Phone: +91 98765 43210").setFontSize(8.5f));
        companyCell.add(new Paragraph("Email: lohari.orders@gmail.com").setFontSize(8.5f));

        header.addCell(companyCell);

        // Right — quotation details
        Cell quoteCell = new Cell().setBorder(Border.NO_BORDER).setPadding(5)
            .setTextAlignment(TextAlignment.RIGHT);

        quoteCell.add(new Paragraph("QUOTATION")
            .setBold().setFontSize(28).setFontColor(SECONDARY_COLOR).setMarginBottom(4));

        quoteCell.add(new Paragraph("Price Estimate")
            .setFontSize(8).setFontColor(ColorConstants.GRAY).setItalic());

        quoteCell.add(new Paragraph("\n"));

        Table detailsTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
            .useAllAvailableWidth();

        detailsTable.addCell(createDetailRow("Quote #", q.getQuoteNumber()));
        detailsTable.addCell(createDetailRow("Date",
            LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))));
        detailsTable.addCell(createDetailRow("Order Ref", "#" + safe(q.getOrderNumber())));
        detailsTable.addCell(createDetailRow("Valid Until",
            LocalDate.now().plusDays(q.getValidityDays())
                .format(DateTimeFormatter.ofPattern("dd MMM yyyy"))));

        quoteCell.add(detailsTable);
        header.addCell(quoteCell);

        document.add(header);
    }

    private Cell createDetailRow(String label, String value) {
        Cell cell = new Cell().setBorder(Border.NO_BORDER)
            .setPaddingBottom(2).setTextAlignment(TextAlignment.RIGHT);

        cell.add(new Paragraph()
            .add(new Text(label + ": ").setFontSize(8).setFontColor(ColorConstants.GRAY))
            .add(new Text(value).setFontSize(8.5f).setBold().setFontColor(PRIMARY_COLOR)));
        return cell;
    }

    private void addCustomerDetails(Document document, Order order) {
        Table t = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
            .useAllAvailableWidth().setMarginBottom(12);

        Cell toCell = new Cell().setBorder(Border.NO_BORDER).setPadding(8).setBackgroundColor(LIGHT_GRAY);
        toCell.add(new Paragraph("TO").setBold().setFontSize(9).setFontColor(SECONDARY_COLOR).setMarginBottom(4));
        toCell.add(new Paragraph(safe(order.getCustomerName())).setFontSize(10).setBold().setFontColor(PRIMARY_COLOR));
        toCell.add(new Paragraph(safe(order.getCustomerEmail())).setFontSize(8.5f).setFontColor(ColorConstants.DARK_GRAY));
        toCell.add(new Paragraph(safe(order.getCustomerPhone())).setFontSize(8.5f).setFontColor(ColorConstants.DARK_GRAY));
        t.addCell(toCell);

        Cell addrCell = new Cell().setBorder(Border.NO_BORDER).setPadding(8).setBackgroundColor(LIGHT_GRAY);
        addrCell.add(new Paragraph("DELIVERY ADDRESS").setBold().setFontSize(9).setFontColor(SECONDARY_COLOR).setMarginBottom(4));
        if (order.getDeliveryAddress() != null) {
            var a = order.getDeliveryAddress();
            if (a.getAddressLine1() != null) addrCell.add(new Paragraph(a.getAddressLine1()).setFontSize(8.5f));
            if (a.getAddressLine2() != null && !a.getAddressLine2().isEmpty())
                addrCell.add(new Paragraph(a.getAddressLine2()).setFontSize(8.5f));
            addrCell.add(new Paragraph(safe(a.getCity()) + ", " + safe(a.getState()) + " - " + safe(a.getPincode())).setFontSize(8.5f));
            addrCell.add(new Paragraph(safe(a.getCountry())).setFontSize(8.5f));
        }
        t.addCell(addrCell);
        document.add(t);
    }

    private void addProductDetails(Document document, Order order, QuotationResponse q) {
        document.add(new Paragraph("PRODUCT DETAILS")
            .setBold().setFontSize(10).setFontColor(SECONDARY_COLOR).setMarginBottom(6));

        Table t = new Table(UnitValue.createPercentArray(new float[]{25, 25, 25, 25}))
            .useAllAvailableWidth().setMarginBottom(12);

        t.addCell(createInfoCell("Product", q.getProductName()));
        t.addCell(createInfoCell("Size", q.getSize()));
        t.addCell(createInfoCell("Material", q.getMaterial()));
        t.addCell(createInfoCell("Finish", q.getFinish()));
        t.addCell(createInfoCell("Quantity", q.getQuantity() + " items"));
        t.addCell(createInfoCell("Category", safe(order.getProductSlug())));

        document.add(t);
    }

    private Cell createInfoCell(String label, String value) {
        Cell cell = new Cell().setBorder(Border.NO_BORDER).setPadding(6).setBackgroundColor(LIGHT_GRAY);
        cell.add(new Paragraph(label).setFontSize(7.5f).setFontColor(ColorConstants.GRAY).setMarginBottom(2));
        cell.add(new Paragraph(safe(value)).setFontSize(9).setBold().setFontColor(PRIMARY_COLOR));
        return cell;
    }

    private void addPricingBreakdown(Document document, QuotationResponse q) {
        document.add(new Paragraph("METAL BREAKDOWN (Transparent Pricing)")
            .setBold().setFontSize(10).setFontColor(SECONDARY_COLOR).setMarginBottom(6));

        Table t = new Table(UnitValue.createPercentArray(new float[]{60, 40}))
            .useAllAvailableWidth().setMarginBottom(12);

        Cell leftCell = new Cell().setBorder(Border.NO_BORDER).setPadding(8).setBackgroundColor(LIGHT_GRAY);

        leftCell.add(createLine("Metal Type", q.getMaterial()));
        leftCell.add(createLine("Weight per Item", q.getWeightPerItemKg() + " kg"));
        leftCell.add(createLine("Quantity", q.getQuantity() + " items"));
        leftCell.add(createLine("Total Weight", q.getTotalWeightKg() + " kg"));
        leftCell.add(createLine("Rate per kg", "Rs " + q.getRatePerKg()));

        t.addCell(leftCell);

        Cell rightCell = new Cell().setBorder(Border.NO_BORDER).setPadding(8).setBackgroundColor(LIGHT_GRAY);

        rightCell.add(createPriceLine("Metal Cost", "Rs " + q.getMetalCost(), false));
        rightCell.add(createPriceLine("Labour Charges", "Rs " + q.getLabourCharges(), false));
        rightCell.add(createPriceLine("Design Charges", "Rs " + q.getDesignCharges(), false));
        if (q.getTransportCharges().compareTo(BigDecimal.ZERO) > 0) {
            rightCell.add(createPriceLine("Transport", "Rs " + q.getTransportCharges(), false));
        }

        rightCell.add(new Paragraph()
            .setBorderTop(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f))
            .setMarginTop(4).setMarginBottom(4));

        rightCell.add(createPriceLine("Subtotal", "Rs " + q.getSubtotal(), false));
        rightCell.add(createPriceLine("Profit (" + q.getProfitPercent() + "%)",
            "Rs " + q.getProfitAmount(), false));
        rightCell.add(createPriceLine("Before GST", "Rs " + q.getBeforeGst(), false));

        rightCell.add(new Paragraph()
            .setBorderTop(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f))
            .setMarginTop(4).setMarginBottom(4));

        rightCell.add(createPriceLine("GST (" + q.getGstPercent() + "%)",
            "Rs " + q.getGstAmount(), false));

        t.addCell(rightCell);
        document.add(t);

        Table totalTable = new Table(UnitValue.createPercentArray(new float[]{60, 40}))
            .useAllAvailableWidth().setMarginBottom(10);

        totalTable.addCell(new Cell().setBorder(Border.NO_BORDER));

        Cell totalCell = new Cell()
            .setBorder(Border.NO_BORDER)
            .setPadding(10)
            .setBackgroundColor(ACCENT_COLOR)
            .setTextAlignment(TextAlignment.RIGHT);

        totalCell.add(new Paragraph("GRAND TOTAL")
            .setBold().setFontSize(10).setFontColor(ColorConstants.WHITE));
        totalCell.add(new Paragraph("Rs " + q.getGrandTotal())
            .setBold().setFontSize(16).setFontColor(ColorConstants.WHITE));

        totalTable.addCell(totalCell);
        document.add(totalTable);

        Table advTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
            .useAllAvailableWidth().setMarginBottom(12);

        Cell advCell = new Cell().setBorder(Border.NO_BORDER).setPadding(8).setBackgroundColor(LIGHT_GRAY);
        advCell.add(new Paragraph("Advance Required (" + q.getAdvancePercent() + "%)")
            .setFontSize(9).setFontColor(ColorConstants.GRAY).setMarginBottom(2));
        advCell.add(new Paragraph("Rs " + q.getAdvanceAmount())
            .setBold().setFontSize(14).setFontColor(SECONDARY_COLOR));
        advTable.addCell(advCell);

        Cell balCell = new Cell().setBorder(Border.NO_BORDER).setPadding(8).setBackgroundColor(LIGHT_GRAY);
        balCell.add(new Paragraph("Balance Due")
            .setFontSize(9).setFontColor(ColorConstants.GRAY).setMarginBottom(2));
        balCell.add(new Paragraph("Rs " + q.getBalanceAmount())
            .setBold().setFontSize(14).setFontColor(PRIMARY_COLOR));
        advTable.addCell(balCell);

        document.add(advTable);
    }

    private Paragraph createLine(String label, String value) {
        return new Paragraph()
            .add(new Text(label + ": ").setFontSize(8.5f).setFontColor(ColorConstants.GRAY))
            .add(new Text(value).setFontSize(9).setBold().setFontColor(PRIMARY_COLOR))
            .setMarginBottom(2);
    }

    private Paragraph createPriceLine(String label, String value, boolean bold) {
        Paragraph p = new Paragraph();
        p.add(new Text(label + "  ").setFontSize(9).setFontColor(ColorConstants.DARK_GRAY));
        p.add(new Text(value).setFontSize(9.5f).setBold().setFontColor(bold ? ACCENT_COLOR : PRIMARY_COLOR));
        p.setTextAlignment(TextAlignment.RIGHT);
        p.setMarginBottom(2);
        return p;
    }

    private void addTermsAndQr(Document document, Order order, QuotationResponse q) {
        Table t = new Table(UnitValue.createPercentArray(new float[]{65, 35}))
            .useAllAvailableWidth().setMarginBottom(10);

        Cell termsCell = new Cell().setBorder(Border.NO_BORDER).setPadding(8);

        termsCell.add(new Paragraph("TERMS & CONDITIONS")
            .setBold().setFontSize(9).setFontColor(SECONDARY_COLOR).setMarginBottom(4));

        Paragraph terms = new Paragraph().setFontSize(7.5f).setFontColor(ColorConstants.DARK_GRAY);
        terms.add("1. This quotation is valid for " + q.getValidityDays() + " days.\n");
        terms.add("2. Advance of " + q.getAdvancePercent() + "% required to confirm order.\n");
        terms.add("3. Final price may vary based on site conditions.\n");
        terms.add("4. Lead time starts after advance payment.\n");
        terms.add("5. Warranty: 1 year on fabrication work.\n");
        terms.add("6. Goods once sold will not be taken back.");

        termsCell.add(terms);

        if (q.getNotes() != null && !q.getNotes().isEmpty()) {
            termsCell.add(new Paragraph("\nNOTE: " + q.getNotes())
                .setFontSize(8).setItalic().setFontColor(WARNING_COLOR));
        }

        t.addCell(termsCell);

        Cell qrCell = new Cell().setBorder(Border.NO_BORDER).setPadding(8).setTextAlignment(TextAlignment.CENTER);
        qrCell.add(new Paragraph("SCAN TO VIEW")
            .setBold().setFontSize(8).setFontColor(SECONDARY_COLOR).setMarginBottom(6));

        String url = FRONTEND_URL + "/orders/" + order.getId();
        try {
            Image qr = generateQrCode(url, 110);
            if (qr != null) {
                qr.setHorizontalAlignment(HorizontalAlignment.CENTER);
                qrCell.add(qr);
            }
        } catch (Exception e) {
            qrCell.add(new Paragraph("QR unavailable").setFontSize(7).setFontColor(ColorConstants.GRAY));
        }

        qrCell.add(new Paragraph("Order #" + safe(order.getOrderNumber()))
            .setFontSize(7).setFontColor(ColorConstants.GRAY).setMarginTop(4));

        t.addCell(qrCell);
        document.add(t);

        Paragraph warn = new Paragraph()
            .setFontSize(8)
            .setItalic()
            .setFontColor(WARNING_COLOR)
            .setTextAlignment(TextAlignment.CENTER)
            .setBackgroundColor(new DeviceRgb(255, 251, 235))
            .setPadding(6);
        warn.add("This is an estimate valid for " + q.getValidityDays() +
            " days. Final price may vary based on site conditions.");
        document.add(warn);
    }

    private void addSignatureAndFooter(Document document) {
        Table sigTable = new Table(UnitValue.createPercentArray(new float[]{60, 40}))
            .useAllAvailableWidth().setMarginTop(20);

        sigTable.addCell(new Cell().setBorder(Border.NO_BORDER));

        Cell sigCell = new Cell().setBorder(Border.NO_BORDER)
            .setTextAlignment(TextAlignment.CENTER).setPadding(10);

        sigCell.add(new Paragraph("\n\n"));
        sigCell.add(new Paragraph("___________________________")
            .setFontSize(9).setFontColor(ColorConstants.DARK_GRAY));
        sigCell.add(new Paragraph("For Lohari Fabrication")
            .setBold().setFontSize(9).setFontColor(PRIMARY_COLOR).setMarginTop(3));
        sigCell.add(new Paragraph("Authorized Signatory")
            .setFontSize(8).setFontColor(ColorConstants.GRAY));

        sigTable.addCell(sigCell);
        document.add(sigTable);

        document.add(new Paragraph("\n"));

        Paragraph footer = new Paragraph()
            .setTextAlignment(TextAlignment.CENTER)
            .setFontSize(8)
            .setFontColor(ColorConstants.GRAY);
        footer.add("Thank you for your interest in Lohari Fabrication!\n");
        footer.add("For queries: lohari.orders@gmail.com | +91 98765 43210");

        document.add(footer);
    }

    private void sendQuotationEmail(Order order, QuotationResponse q, byte[] pdfBytes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(order.getCustomerEmail());
            helper.setCc(adminEmail);
            helper.setSubject("Quotation " + q.getQuoteNumber() +
                " for Order #" + order.getOrderNumber() + " - " + companyName);

            helper.setText(buildQuotationEmailBody(order, q), true);
            helper.addAttachment("Quotation-" + q.getQuoteNumber() + ".pdf",
                new ByteArrayResource(pdfBytes));

            mailSender.send(message);
            System.out.println("✅ Quotation email sent to: " + order.getCustomerEmail());

        } catch (MessagingException e) {
            System.err.println("❌ Quotation email failed: " + e.getMessage());
            throw new RuntimeException("Failed to send quotation email: " + e.getMessage(), e);
        }
    }

    private String buildQuotationEmailBody(Order order, QuotationResponse q) {
        return """
            <!DOCTYPE html><html><head><style>
              body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f8;margin:0;padding:20px}
              .container{max-width:620px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08)}
              .header{background:linear-gradient(135deg,#0f172a,#1e293b);padding:30px;text-align:center;color:#fff}
              .header h1{margin:0;font-size:22px;letter-spacing:1px}
              .header p{margin:6px 0 0;opacity:.8;font-size:12px}
              .body{padding:30px;color:#333}
              .body h2{color:#0f172a;font-size:18px;margin-top:0}
              .body p{line-height:1.6;font-size:14px}
              .quote-box{background:#f1f5f9;border-radius:8px;padding:20px;margin:20px 0;border-left:4px solid #22d3ee}
              .quote-box table{width:100%%;border-collapse:collapse}
              .quote-box td{padding:6px 0;font-size:14px}
              .quote-box td.label{color:#64748b}
              .quote-box td.value{text-align:right;font-weight:600;color:#0f172a}
              .total-row td{font-size:18px;font-weight:800;color:#6366f1 !important;padding-top:12px;border-top:1px solid #e2e8f0}
              .breakdown{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:16px 0;font-size:13px}
              .breakdown table{width:100%%}
              .breakdown td{padding:4px 0;color:#475569}
              .breakdown td:last-child{text-align:right;font-weight:600;color:#0f172a}
              .footer{background:#0f172a;color:#94a3b8;padding:20px;text-align:center;font-size:12px}
              .note{background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:6px;margin:16px 0;font-size:13px;color:#78350f}
            </style></head><body>
              <div class="container">
                <div class="header">
                  <h1>LOHARI FABRICATION</h1>
                  <p>Custom Metal Fabrication &amp; Design</p>
                </div>
                <div class="body">
                  <h2>Dear %s,</h2>
                  <p>Thank you for your interest! Please find attached your <strong>Quotation %s</strong> for Order <strong>#%s</strong>.</p>

                  <div class="quote-box">
                    <table>
                      <tr><td class="label">Product</td><td class="value">%s</td></tr>
                      <tr><td class="label">Material</td><td class="value">%s</td></tr>
                      <tr><td class="label">Finish</td><td class="value">%s</td></tr>
                      <tr><td class="label">Size</td><td class="value">%s</td></tr>
                      <tr><td class="label">Quantity</td><td class="value">%d items</td></tr>
                      <tr><td class="label">Total Weight</td><td class="value">%s kg</td></tr>
                    </table>
                  </div>

                  <h3 style="color:#0f172a;font-size:15px;margin-top:24px;">Pricing Breakdown</h3>
                  <div class="breakdown">
                    <table>
                      <tr><td>Metal Cost (%s kg × Rs %s/kg)</td><td>Rs %s</td></tr>
                      <tr><td>Labour Charges</td><td>Rs %s</td></tr>
                      <tr><td>Design Charges</td><td>Rs %s</td></tr>
                      <tr><td>Subtotal</td><td>Rs %s</td></tr>
                      <tr><td>Profit (%s%%)</td><td>Rs %s</td></tr>
                      <tr><td>GST (%s%%)</td><td>Rs %s</td></tr>
                    </table>
                  </div>

                  <div class="quote-box">
                    <table>
                      <tr class="total-row"><td class="label">GRAND TOTAL</td><td class="value">Rs %s</td></tr>
                      <tr><td class="label">Advance Required (%s%%)</td><td class="value">Rs %s</td></tr>
                      <tr><td class="label">Balance Due</td><td class="value">Rs %s</td></tr>
                    </table>
                  </div>

                  <div class="note">
                    <strong>Note:</strong> This quotation is valid for %d days.
                    Final price may vary based on site conditions.
                  </div>

                  <p>If you have any questions, feel free to reply to this email or call us at <strong>+91 98765 43210</strong>.</p>

                  <p>Thank you,<br/><strong>Lohari Fabrication Team</strong></p>
                </div>
                <div class="footer">
                  &copy; %d Lohari Fabrication. All rights reserved.<br/>
                  123 Industrial Area, City, State - 123456
                </div>
              </div>
            </body></html>
            """.formatted(
                order.getCustomerName(),
                q.getQuoteNumber(),
                order.getOrderNumber(),
                q.getProductName(),
                q.getMaterial(),
                q.getFinish(),
                q.getSize(),
                q.getQuantity(),
                q.getTotalWeightKg(),
                q.getTotalWeightKg(),
                q.getRatePerKg(),
                q.getMetalCost(),
                q.getLabourCharges(),
                q.getDesignCharges(),
                q.getSubtotal(),
                q.getProfitPercent(),
                q.getProfitAmount(),
                q.getGstPercent(),
                q.getGstAmount(),
                q.getGrandTotal(),
                q.getAdvancePercent(),
                q.getAdvanceAmount(),
                q.getBalanceAmount(),
                q.getValidityDays(),
                java.time.Year.now().getValue()
            );
    }

    private Image loadLogo() {
        try {
            Path base64Path = Paths.get("src/main/resources/static/logo-base64.txt");
            if (Files.exists(base64Path)) {
                String base64 = Files.readString(base64Path).trim();
                if (!base64.isEmpty()) {
                    byte[] bytes = Base64.getDecoder().decode(base64);
                    return new Image(ImageDataFactory.create(bytes));
                }
            }

            Path logoPath = Paths.get("src/main/resources/static/logo.png");
            if (Files.exists(logoPath)) {
                return new Image(ImageDataFactory.create(logoPath.toString()));
            }
        } catch (Exception e) {
            System.err.println("⚠️ Logo load failed: " + e.getMessage());
        }
        return null;
    }

    private Image generateQrCode(String content, int size) throws Exception {
        QRCodeWriter qrWriter = new QRCodeWriter();
        BitMatrix matrix = qrWriter.encode(content, BarcodeFormat.QR_CODE, size, size);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix);
        ImageIO.write(image, "png", baos);

        return new Image(ImageDataFactory.create(baos.toByteArray())).setWidth(size).setHeight(size);
    }

    private String safe(Object v) {
        return v != null ? v.toString() : "N/A";
    }
}