package com.lohari.service;

import com.lohari.dto.RagDTO.IngestionResponse;
import com.lohari.model.Order;
import com.lohari.model.Product;
import com.lohari.repository.OrderRepository;
import com.lohari.repository.ProductRepository;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DataIngestionService {

    @Autowired
    private VectorStore vectorStore;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ============================================
    // INGEST ALL (Orders + Products)
    // ============================================
    public IngestionResponse ingestAllOrders() {
        // Orders
        List<Order> orders = orderRepository.findAll();
        List<Document> orderDocs = new ArrayList<>();
        DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("dd MMM yyyy");

        for (Order order : orders) {
            try {
                String content = buildOrderText(order, dateFmt);
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("type", "ORDER");
                metadata.put("orderId", order.getId());
                metadata.put("orderNumber", safe(order.getOrderNumber()));
                metadata.put("status", order.getStatus() != null ? order.getStatus().toString() : "UNKNOWN");
                metadata.put("customerEmail", safe(order.getCustomerEmail()));
                metadata.put("customerName", safe(order.getCustomerName()));
                metadata.put("productName", safe(order.getProductName()));
                orderDocs.add(new Document(content, metadata));
            } catch (Exception e) {
                System.err.println("Failed order " + order.getId() + ": " + e.getMessage());
            }
        }

        if (!orderDocs.isEmpty()) vectorStore.add(orderDocs);

        // Products
        List<Product> products = productRepository.findAll();
        List<Document> productDocs = new ArrayList<>();

        for (Product product : products) {
            try {
                String content = buildProductText(product);
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("type", "PRODUCT");
                metadata.put("productId", product.getId());
                metadata.put("productName", safe(product.getName()));
                metadata.put("slug", safe(product.getSlug()));
                if (product.getCategory() != null) {
                    metadata.put("category", safe(product.getCategory().getName()));
                }
                productDocs.add(new Document(content, metadata));
            } catch (Exception e) {
                System.err.println("Failed product " + product.getId() + ": " + e.getMessage());
            }
        }

        if (!productDocs.isEmpty()) vectorStore.add(productDocs);

        int total = orderDocs.size() + productDocs.size();
        return new IngestionResponse(
            orderDocs.size(),
            productDocs.size(),
            total,
            "Ingested " + orderDocs.size() + " orders, " + productDocs.size() + " products"
        );
    }

    // ============================================
    // INGEST SINGLE ORDER
    // ============================================
    public void ingestOrder(Order order) {
        if (order == null || order.getId() == null) return;
        try {
            deleteOrderFromVectorStore(order.getId());
            DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("dd MMM yyyy");
            String content = buildOrderText(order, dateFmt);

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("type", "ORDER");
            metadata.put("orderId", order.getId());
            metadata.put("orderNumber", safe(order.getOrderNumber()));
            metadata.put("status", order.getStatus() != null ? order.getStatus().toString() : "UNKNOWN");
            metadata.put("customerEmail", safe(order.getCustomerEmail()));
            metadata.put("customerName", safe(order.getCustomerName()));
            metadata.put("productName", safe(order.getProductName()));

            vectorStore.add(List.of(new Document(content, metadata)));
            System.out.println("✅ Order " + order.getOrderNumber() + " synced");
        } catch (Exception e) {
            System.err.println("❌ Order sync failed " + order.getId() + ": " + e.getMessage());
        }
    }

    // ============================================
    // INGEST SINGLE PRODUCT
    // ============================================
    public void ingestProduct(Product product) {
        if (product == null || product.getId() == null) return;
        try {
            deleteProductFromVectorStore(product.getId());
            String content = buildProductText(product);

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("type", "PRODUCT");
            metadata.put("productId", product.getId());
            metadata.put("productName", safe(product.getName()));
            metadata.put("slug", safe(product.getSlug()));
            if (product.getCategory() != null) {
                metadata.put("category", safe(product.getCategory().getName()));
            }

            vectorStore.add(List.of(new Document(content, metadata)));
            System.out.println("✅ Product " + product.getName() + " synced");
        } catch (Exception e) {
            System.err.println("❌ Product sync failed " + product.getId() + ": " + e.getMessage());
        }
    }

    // ============================================
    // DELETE
    // ============================================
    public void deleteOrderFromVectorStore(Long orderId) {
        if (orderId == null) return;
        try {
            jdbcTemplate.update(
                "DELETE FROM vector_store WHERE metadata->>'orderId' = ?",
                String.valueOf(orderId)
            );
        } catch (Exception e) { /* ignore */ }
    }

    public void deleteProductFromVectorStore(Long productId) {
        if (productId == null) return;
        try {
            jdbcTemplate.update(
                "DELETE FROM vector_store WHERE metadata->>'productId' = ?",
                String.valueOf(productId)
            );
        } catch (Exception e) { /* ignore */ }
    }

    // ============================================
    // BUILD ORDER TEXT
    // ============================================
    private String buildOrderText(Order order, DateTimeFormatter dateFmt) {
        StringBuilder sb = new StringBuilder();
        sb.append("ORDER #").append(safe(order.getOrderNumber())).append("\n");
        if (order.getOrderDate() != null) {
            sb.append("Date: ").append(order.getOrderDate().format(dateFmt)).append("\n");
        }
        sb.append("Status: ").append(order.getStatus() != null ? order.getStatus().toString() : "UNKNOWN").append("\n");
        sb.append("Customer: ").append(safe(order.getCustomerName())).append("\n");
        sb.append("Email: ").append(safe(order.getCustomerEmail())).append("\n");
        sb.append("Phone: ").append(safe(order.getCustomerPhone())).append("\n");
        sb.append("Product: ").append(safe(order.getProductName())).append("\n");
        sb.append("Material: ").append(safe(order.getMaterial())).append("\n");
        sb.append("Finish: ").append(safe(order.getFinish())).append("\n");
        sb.append("Quantity: ").append(order.getQuantity() != null ? order.getQuantity() : 1).append("\n");
        if (order.getWidth() != null && order.getHeight() != null) {
            sb.append("Size: ").append(order.getWidth()).append(" x ")
              .append(order.getHeight()).append(" ").append(safe(order.getUnit())).append("\n");
        }
        if (order.getLeadTimeDays() != null) {
            sb.append("Lead Time: ").append(order.getLeadTimeDays()).append(" days\n");
        }
        sb.append("Total Amount: Rs ").append(order.getTotalAmount()).append("\n");
        if (order.getAdvanceAmount() != null) {
            sb.append("Advance Paid: Rs ").append(order.getAdvanceAmount()).append("\n");
        }
        if (order.getBalanceAmount() != null) {
            sb.append("Balance Due: Rs ").append(order.getBalanceAmount()).append("\n");
        }
        if (order.getDeliveryAddress() != null) {
            var addr = order.getDeliveryAddress();
            sb.append("Delivery Address: ");
            if (addr.getAddressLine1() != null) sb.append(addr.getAddressLine1()).append(", ");
            if (addr.getCity() != null) sb.append(addr.getCity()).append(", ");
            if (addr.getState() != null) sb.append(addr.getState()).append(" - ");
            if (addr.getPincode() != null) sb.append(addr.getPincode());
            sb.append("\n");
        }
        return sb.toString();
    }

    // ============================================
    // BUILD PRODUCT TEXT
    // ============================================
    private String buildProductText(Product product) {
        StringBuilder sb = new StringBuilder();
        sb.append("PRODUCT: ").append(safe(product.getName())).append("\n");
        sb.append("Slug: ").append(safe(product.getSlug())).append("\n");

        if (product.getCategory() != null) {
            sb.append("Category: ").append(safe(product.getCategory().getName())).append("\n");
        }
        if (product.getShortDescription() != null) {
            sb.append("Short Description: ").append(product.getShortDescription()).append("\n");
        }
        if (product.getLongDescription() != null) {
            sb.append("Description: ").append(product.getLongDescription()).append("\n");
        }
        sb.append("Base Price: Rs ").append(product.getBasePrice()).append("\n");

        if (product.getDefaultMaterial() != null) {
            sb.append("Material: ").append(safe(product.getDefaultMaterial().getName())).append("\n");
        }
        if (product.getDefaultFinish() != null) {
            sb.append("Finish: ").append(safe(product.getDefaultFinish().getName())).append("\n");
        }
        if (product.getMinWidth() != null && product.getMaxWidth() != null) {
            sb.append("Width Range: ").append(product.getMinWidth()).append(" - ")
              .append(product.getMaxWidth()).append(" ").append(safe(product.getUnit())).append("\n");
        }
        if (product.getMinHeight() != null && product.getMaxHeight() != null) {
            sb.append("Height Range: ").append(product.getMinHeight()).append(" - ")
              .append(product.getMaxHeight()).append(" ").append(safe(product.getUnit())).append("\n");
        }
        if (product.getLeadTimeDays() != null) {
            sb.append("Lead Time: ").append(product.getLeadTimeDays()).append(" days\n");
        }
        if (product.getIsCustomizable() != null) {
            sb.append("Customizable: ").append(product.getIsCustomizable() ? "Yes" : "No").append("\n");
        }
        if (product.getStockQuantity() != null) {
            sb.append("Stock: ").append(product.getStockQuantity()).append("\n");
        }
        return sb.toString();
    }

    // ============================================
    // Helper
    // ============================================
    private String safe(Object value) {
        return value != null ? value.toString() : "N/A";
    }
}