package com.lohari.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
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
import com.lohari.model.Order;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
public class InvoiceService {

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

    // ============================================
    // COLORS (Cyan/Indigo theme)
    // ============================================
    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(15, 23, 42);       // slate-900
    private static final DeviceRgb SECONDARY_COLOR = new DeviceRgb(34, 211, 238);   // cyan-400
    private static final DeviceRgb ACCENT_COLOR = new DeviceRgb(99, 102, 241);      // indigo-500
    private static final DeviceRgb LIGHT_GRAY = new DeviceRgb(241, 245, 249);       // slate-100

    // ============================================
    // FRONTEND URL (QR tracking)
    // ============================================
    private static final String FRONTEND_URL = "http://localhost:5173";

    // ============================================
    // PDF GENERATION
    // ============================================
    public byte[] generateInvoice(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc, PageSize.A4);
            document.setMargins(30, 40, 30, 40);

            // HEADER — Logo + Company + Invoice Details
            addHeader(document, order);

            document.add(new Paragraph()
                .setBorderBottom(new SolidBorder(SECONDARY_COLOR, 2))
                .setMarginTop(8)
                .setMarginBottom(15));

            // CUSTOMER DETAILS
            addCustomerDetails(document, order);

            // PRODUCT TABLE
            addProductTable(document, order);

            // PRICING SUMMARY
            addPricingSummary(document, order);

            // QR CODE + TERMS
            addQrAndTerms(document, order);

            // SIGNATURE + FOOTER
            addSignatureAndFooter(document);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate invoice: " + e.getMessage(), e);
        }
    }

    // ============================================
    // HEADER — Logo + Company + Invoice
    // ============================================
    private void addHeader(Document document, Order order) throws Exception {
        Table header = new Table(UnitValue.createPercentArray(new float[]{55, 45}))
            .useAllAvailableWidth();

        // ---- LEFT: Logo + Company ----
        Cell companyCell = new Cell()
            .setBorder(Border.NO_BORDER)
            .setPadding(5)
            .setVerticalAlignment(VerticalAlignment.MIDDLE);

        Image logo = loadLogo();
        if (logo != null) {
            logo.setWidth(70);
            logo.setHeight(70);
            logo.setMarginBottom(8);
            companyCell.add(logo);
        }

        companyCell.add(new Paragraph("LOHARI FABRICATION")
            .setBold()
            .setFontSize(18)
            .setFontColor(PRIMARY_COLOR)
            .setMarginBottom(2));

        companyCell.add(new Paragraph("Custom Metal Fabrication & Design")
            .setFontSize(9)
            .setFontColor(ColorConstants.GRAY)
            .setItalic()
            .setMarginBottom(6));

        companyCell.add(new Paragraph("123 Industrial Area, City").setFontSize(8.5f));
        companyCell.add(new Paragraph("State - 123456, India").setFontSize(8.5f));
        companyCell.add(new Paragraph("Phone: +91 98765 43210").setFontSize(8.5f));
        companyCell.add(new Paragraph("Email: lohari.orders@gmail.com").setFontSize(8.5f));

        header.addCell(companyCell);

        // ---- RIGHT: Invoice Title + Details ----
        Cell invoiceCell = new Cell()
            .setBorder(Border.NO_BORDER)
            .setPadding(5)
            .setTextAlignment(TextAlignment.RIGHT);

        invoiceCell.add(new Paragraph("INVOICE")
            .setBold()
            .setFontSize(28)
            .setFontColor(SECONDARY_COLOR)
            .setMarginBottom(4));

        invoiceCell.add(new Paragraph("Tax Invoice / Bill of Supply")
            .setFontSize(8)
            .setFontColor(ColorConstants.GRAY)
            .setItalic());

        invoiceCell.add(new Paragraph("\n"));

        Table detailsTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
            .useAllAvailableWidth();

        detailsTable.addCell(createDetailRow("Invoice #", safe(order.getOrderNumber())));
        detailsTable.addCell(createDetailRow("Date",
            order.getOrderDate() != null
                ? order.getOrderDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
                : "N/A"));
        detailsTable.addCell(createDetailRow("Status",
            order.getStatus() != null ? order.getStatus().toString() : "UNKNOWN"));
        detailsTable.addCell(createDetailRow("Payment", "30% Advance"));

        invoiceCell.add(detailsTable);
        header.addCell(invoiceCell);

        document.add(header);
    }

    private Cell createDetailRow(String label, String value) {
        Cell cell = new Cell()
            .setBorder(Border.NO_BORDER)
            .setPaddingBottom(2)
            .setTextAlignment(TextAlignment.RIGHT);

        cell.add(new Paragraph()
            .add(new Text(label + ": ").setFontSize(8).setFontColor(ColorConstants.GRAY))
            .add(new Text(value).setFontSize(8.5f).setBold().setFontColor(PRIMARY_COLOR)));

        return cell;
    }

    // ============================================
    // CUSTOMER DETAILS
    // ============================================
    private void addCustomerDetails(Document document, Order order) {
        Table customerTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}))
            .useAllAvailableWidth()
            .setMarginBottom(15);

        // Bill To
        Cell billToCell = new Cell()
            .setBorder(Border.NO_BORDER)
            .setPadding(8)
            .setBackgroundColor(LIGHT_GRAY);

        billToCell.add(new Paragraph("BILL TO")
            .setBold().setFontSize(9).setFontColor(SECONDARY_COLOR).setMarginBottom(4));
        billToCell.add(new Paragraph(safe(order.getCustomerName()))
            .setFontSize(10).setBold().setFontColor(PRIMARY_COLOR).setMarginBottom(2));
        billToCell.add(new Paragraph(safe(order.getCustomerEmail()))
            .setFontSize(8.5f).setFontColor(ColorConstants.DARK_GRAY));
        billToCell.add(new Paragraph(safe(order.getCustomerPhone()))
            .setFontSize(8.5f).setFontColor(ColorConstants.DARK_GRAY));

        customerTable.addCell(billToCell);

        // Delivery Address
        Cell addressCell = new Cell()
            .setBorder(Border.NO_BORDER)
            .setPadding(8)
            .setBackgroundColor(LIGHT_GRAY);

        addressCell.add(new Paragraph("DELIVERY ADDRESS")
            .setBold().setFontSize(9).setFontColor(SECONDARY_COLOR).setMarginBottom(4));

        if (order.getDeliveryAddress() != null) {
            var addr = order.getDeliveryAddress();
            addressCell.add(new Paragraph(safe(addr.getAddressLine1())).setFontSize(8.5f));
            if (addr.getAddressLine2() != null && !addr.getAddressLine2().isEmpty()) {
                addressCell.add(new Paragraph(addr.getAddressLine2()).setFontSize(8.5f));
            }
            addressCell.add(new Paragraph(
                safe(addr.getCity()) + ", " + safe(addr.getState()) + " - " + safe(addr.getPincode()))
                .setFontSize(8.5f));
            addressCell.add(new Paragraph(safe(addr.getCountry())).setFontSize(8.5f));
        }

        customerTable.addCell(addressCell);
        document.add(customerTable);
    }

    // ============================================
    // PRODUCT TABLE
    // ============================================
    private void addProductTable(Document document, Order order) {
        Table productTable = new Table(UnitValue.createPercentArray(new float[]{5, 35, 25, 10, 25}))
            .useAllAvailableWidth()
            .setMarginBottom(15);

        String[] headers = {"#", "Product Description", "Specifications", "Qty", "Amount"};
        for (String h : headers) {
            productTable.addHeaderCell(new Cell()
                .add(new Paragraph(h).setBold().setFontSize(9).setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(PRIMARY_COLOR)
                .setPadding(7)
                .setTextAlignment(TextAlignment.CENTER));
        }

        productTable.addCell(new Cell().add(new Paragraph("1").setFontSize(9)).setPadding(7));

        Cell productCell = new Cell().setPadding(7);
        productCell.add(new Paragraph(safe(order.getProductName())).setFontSize(9.5f).setBold()
            .setFontColor(PRIMARY_COLOR));
        if (order.getMaterial() != null && !order.getMaterial().equalsIgnoreCase("Standard")) {
            productCell.add(new Paragraph("Material: " + order.getMaterial()).setFontSize(8)
                .setFontColor(ColorConstants.DARK_GRAY));
        }
        if (order.getFinish() != null && !order.getFinish().equalsIgnoreCase("Standard")) {
            productCell.add(new Paragraph("Finish: " + order.getFinish()).setFontSize(8)
                .setFontColor(ColorConstants.DARK_GRAY));
        }
        productTable.addCell(productCell);

        Cell specCell = new Cell().setPadding(7);
        if (order.getWidth() != null && order.getHeight() != null) {
            specCell.add(new Paragraph("Size: " + order.getWidth() + " x " +
                order.getHeight() + " " + safe(order.getUnit())).setFontSize(8.5f));
        }
        if (order.getLeadTimeDays() != null) {
            specCell.add(new Paragraph("Lead: " + order.getLeadTimeDays() + " days").setFontSize(8.5f));
        }
        productTable.addCell(specCell);

        productTable.addCell(new Cell()
            .add(new Paragraph(String.valueOf(order.getQuantity())).setFontSize(9))
            .setPadding(7)
            .setTextAlignment(TextAlignment.CENTER));

        productTable.addCell(new Cell()
            .add(new Paragraph("Rs " + formatAmount(order.getTotalAmount())).setFontSize(9.5f).setBold()
                .setFontColor(PRIMARY_COLOR))
            .setPadding(7)
            .setTextAlignment(TextAlignment.RIGHT));

        document.add(productTable);
    }

    // ============================================
    // PRICING SUMMARY
    // ============================================
    private void addPricingSummary(Document document, Order order) {
        Table summaryTable = new Table(UnitValue.createPercentArray(new float[]{60, 40}))
            .useAllAvailableWidth()
            .setMarginBottom(15);

        summaryTable.addCell(new Cell().setBorder(Border.NO_BORDER));

        Cell priceCell = new Cell()
            .setBorder(Border.NO_BORDER)
            .setPadding(8)
            .setBackgroundColor(LIGHT_GRAY);

        priceCell.add(createPriceRow("Subtotal", "Rs " + formatAmount(order.getTotalAmount()), false));
        priceCell.add(createPriceRow("Advance Paid (30%)",
            "Rs " + formatAmount(order.getAdvanceAmount()), false));
        priceCell.add(createPriceRow("Balance Due",
            "Rs " + formatAmount(order.getBalanceAmount()), true));

        priceCell.add(new Paragraph("Inclusive of all taxes")
            .setFontSize(7.5f)
            .setItalic()
            .setFontColor(ColorConstants.GRAY)
            .setTextAlignment(TextAlignment.RIGHT)
            .setMarginTop(4));

        summaryTable.addCell(priceCell);
        document.add(summaryTable);
    }

    private Paragraph createPriceRow(String label, String value, boolean isTotal) {
        Paragraph p = new Paragraph();
        p.add(new Text(label + "  ").setFontSize(isTotal ? 10 : 9)
            .setFontColor(isTotal ? PRIMARY_COLOR : ColorConstants.DARK_GRAY));
        p.add(new Text(value).setFontSize(isTotal ? 12 : 9.5f).setBold()
            .setFontColor(isTotal ? ACCENT_COLOR : PRIMARY_COLOR));
        if (isTotal) p.setMarginTop(5);
        p.setTextAlignment(TextAlignment.RIGHT);
        return p;
    }

    // ============================================
    // QR CODE + TERMS
    // ============================================
    private void addQrAndTerms(Document document, Order order) {
        Table bottomTable = new Table(UnitValue.createPercentArray(new float[]{65, 35}))
            .useAllAvailableWidth()
            .setMarginBottom(10);

        // ---- LEFT: Terms ----
        Cell termsCell = new Cell().setBorder(Border.NO_BORDER).setPadding(8);

        termsCell.add(new Paragraph("TERMS & CONDITIONS")
            .setBold().setFontSize(9).setFontColor(SECONDARY_COLOR).setMarginBottom(4));

        Paragraph terms = new Paragraph()
            .setFontSize(7.5f)
            .setFontColor(ColorConstants.DARK_GRAY);

        terms.add("1. Advance payment of 30% is required to confirm the order.\n");
        terms.add("2. Fabrication will start after advance payment.\n");
        terms.add("3. Balance amount to be paid before delivery.\n");
        terms.add("4. Lead time is approximate and may vary based on complexity.\n");
        terms.add("5. Warranty: 1 year on fabrication work.\n");
        terms.add("6. Goods once sold will not be taken back.");

        termsCell.add(terms);
        bottomTable.addCell(termsCell);

        // ---- RIGHT: QR Code ----
        Cell qrCell = new Cell()
            .setBorder(Border.NO_BORDER)
            .setPadding(8)
            .setTextAlignment(TextAlignment.CENTER);

        qrCell.add(new Paragraph("SCAN TO TRACK")
            .setBold().setFontSize(8).setFontColor(SECONDARY_COLOR).setMarginBottom(6));

        String trackingUrl = FRONTEND_URL + "/orders/" + order.getId();
        try {
            Image qrImage = generateQrCode(trackingUrl, 110);
            if (qrImage != null) {
                qrImage.setHorizontalAlignment(HorizontalAlignment.CENTER);
                qrCell.add(qrImage);
            }
        } catch (Exception e) {
            qrCell.add(new Paragraph("QR unavailable")
                .setFontSize(7).setFontColor(ColorConstants.GRAY));
        }

        qrCell.add(new Paragraph("Order #" + safe(order.getOrderNumber()))
            .setFontSize(7).setFontColor(ColorConstants.GRAY).setMarginTop(4));

        bottomTable.addCell(qrCell);
        document.add(bottomTable);
    }

    // ============================================
    // SIGNATURE + FOOTER
    // ============================================
    private void addSignatureAndFooter(Document document) {
        Table sigTable = new Table(UnitValue.createPercentArray(new float[]{60, 40}))
            .useAllAvailableWidth()
            .setMarginTop(20);

        sigTable.addCell(new Cell().setBorder(Border.NO_BORDER));

        Cell sigCell = new Cell()
            .setBorder(Border.NO_BORDER)
            .setTextAlignment(TextAlignment.CENTER)
            .setPadding(10);

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

        footer.add("Thank you for choosing Lohari Fabrication!\n");
        footer.add("This is a computer-generated invoice.\n");
        footer.add("For queries: lohari.orders@gmail.com | +91 98765 43210");

        document.add(footer);
    }

    // ============================================
    // LOGO LOADER (base64 → PNG fallback)
    // ============================================
    private Image loadLogo() {
        try {
            // 1. Base64 file
            Path base64Path = Paths.get("src/main/resources/static/logo-base64.txt");
            if (Files.exists(base64Path)) {
                String base64 = Files.readString(base64Path).trim();
                if (!base64.isEmpty()) {
                    byte[] imageBytes = Base64.getDecoder().decode(base64);
                    ImageData imageData = ImageDataFactory.create(imageBytes);
                    System.out.println("✅ Logo loaded from base64 (" + imageBytes.length + " bytes)");
                    return new Image(imageData);
                }
            }

            // 2. PNG file
            Path logoPath = Paths.get("src/main/resources/static/logo.png");
            if (Files.exists(logoPath)) {
                ImageData imageData = ImageDataFactory.create(logoPath.toString());
                System.out.println("✅ Logo loaded from PNG file");
                return new Image(imageData);
            }

            System.out.println("⚠️ No logo found — using text only");
        } catch (Exception e) {
            System.err.println("⚠️ Logo load failed: " + e.getMessage());
        }
        return null;
    }

    // ============================================
    // QR CODE GENERATOR
    // ============================================
    private Image generateQrCode(String content, int size) throws WriterException, Exception {
        QRCodeWriter qrWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrWriter.encode(content, BarcodeFormat.QR_CODE, size, size);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
        ImageIO.write(image, "png", baos);

        ImageData imageData = ImageDataFactory.create(baos.toByteArray());
        return new Image(imageData).setWidth(size).setHeight(size);
    }

    // ============================================
    // HELPERS
    // ============================================
    private String formatAmount(java.math.BigDecimal amount) {
        if (amount == null) return "0";
        return String.format("%,.2f", amount);
    }

    private String safe(Object value) {
        return value != null ? value.toString() : "N/A";
    }

    // ============================================
    // EMAIL INVOICE TO CUSTOMER + ADMIN
    // ============================================
    public void sendInvoiceToCustomerAndAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

        byte[] pdfBytes = generateInvoice(orderId);
        String pdfFileName = "Invoice-" + order.getOrderNumber() + ".pdf";

        sendInvoiceEmail(order.getCustomerEmail(), order.getCustomerName(),
                         order, pdfBytes, pdfFileName, false);

        sendInvoiceEmail(adminEmail, "Admin",
                         order, pdfBytes, pdfFileName, true);
    }

    private void sendInvoiceEmail(String toEmail, String recipientName, Order order,
                                   byte[] pdfBytes, String pdfFileName, boolean isAdmin) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject((isAdmin ? "[ADMIN COPY] " : "") +
                "Invoice for Order #" + order.getOrderNumber() + " - " + companyName);

            helper.setText(buildEmailBody(order, recipientName, isAdmin), true);
            helper.addAttachment(pdfFileName, new ByteArrayResource(pdfBytes));

            mailSender.send(message);
            System.out.println("✅ Invoice email sent to: " + toEmail);
        } catch (MessagingException e) {
            System.err.println("❌ Email failed to " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send invoice email: " + e.getMessage(), e);
        }
    }

    private String buildEmailBody(Order order, String recipientName, boolean isAdmin) {
        String orderDate = order.getOrderDate() != null
            ? order.getOrderDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
            : "N/A";

        String greeting = isAdmin ? "Hello Admin," : "Dear " + recipientName + ",";
        String intro = isAdmin
            ? "A new invoice has been generated. Details below:"
            : "Thank you for your order! Your invoice is attached.";

        return """
            <!DOCTYPE html><html><head><style>
              body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f8;margin:0;padding:20px}
              .container{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08)}
              .header{background:linear-gradient(135deg,#0f172a,#1e293b);padding:30px;text-align:center;color:#fff}
              .header h1{margin:0;font-size:22px;letter-spacing:1px}
              .header p{margin:6px 0 0;opacity:.8;font-size:12px}
              .body{padding:30px;color:#333}
              .body h2{color:#0f172a;font-size:18px;margin-top:0}
              .body p{line-height:1.6;font-size:14px}
              .details{background:#f1f5f9;border-radius:8px;padding:20px;margin:20px 0}
              .details table{width:100%%;border-collapse:collapse}
              .details td{padding:8px 0;font-size:14px}
              .details td.label{color:#64748b}
              .details td.value{text-align:right;font-weight:600;color:#0f172a}
              .total{font-size:17px;color:#22d3ee !important}
              .footer{background:#0f172a;color:#94a3b8;padding:20px;text-align:center;font-size:12px}
            </style></head><body>
              <div class="container">
                <div class="header">
                  <h1>LOHARI FABRICATION</h1>
                  <p>Custom Metal Fabrication &amp; Design</p>
                </div>
                <div class="body">
                  <h2>%s</h2>
                  <p>%s</p>
                  <div class="details">
                    <table>
                      <tr><td class="label">Order Number</td><td class="value">#%s</td></tr>
                      <tr><td class="label">Order Date</td><td class="value">%s</td></tr>
                      <tr><td class="label">Product</td><td class="value">%s</td></tr>
                      <tr><td class="label">Quantity</td><td class="value">%d</td></tr>
                      <tr><td class="label">Status</td><td class="value">%s</td></tr>
                      <tr><td class="label">Total Amount</td><td class="value total">Rs %s</td></tr>
                      <tr><td class="label">Advance Paid</td><td class="value">Rs %s</td></tr>
                      <tr><td class="label">Balance Due</td><td class="value">Rs %s</td></tr>
                    </table>
                  </div>
                  <p><strong>Invoice PDF is attached</strong> — please download for your records.</p>
                  <p>Questions? Reply to this email or call <strong>+91 98765 43210</strong>.</p>
                  <p>Thank you for choosing <strong>Lohari Fabrication</strong>!</p>
                </div>
                <div class="footer">
                  &copy; %d Lohari Fabrication. All rights reserved.<br/>
                  123 Industrial Area, City, State - 123456
                </div>
              </div>
            </body></html>
            """.formatted(
                greeting, intro,
                order.getOrderNumber(), orderDate, order.getProductName(),
                order.getQuantity(), order.getStatus(),
                order.getTotalAmount(), order.getAdvanceAmount(),
                order.getBalanceAmount(),
                java.time.Year.now().getValue()
            );
    }
}