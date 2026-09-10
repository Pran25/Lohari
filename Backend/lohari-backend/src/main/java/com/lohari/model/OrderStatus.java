package com.lohari.model;

public enum OrderStatus {

    PENDING("PENDING", "Order received, waiting for confirmation"),
    QUOTE_SENT("QUOTE_SENT", "Quote sent to customer"),
    QUOTE_ACCEPTED("QUOTE_ACCEPTED", "Customer accepted the quote"),
    SITE_VISIT_SCHEDULED("SITE_VISIT_SCHEDULED", "Site visit scheduled for measurements"),
    SITE_VISIT_COMPLETED("SITE_VISIT_COMPLETED", "Site measurements taken"),
    ADVANCE_PAID("ADVANCE_PAID", "Advance payment received"),
    FABRICATION_STARTED("FABRICATION_STARTED", "Fabrication work started"),
    FABRICATION_IN_PROGRESS("FABRICATION_IN_PROGRESS", "Fabrication in progress"),
    FABRICATION_COMPLETE("FABRICATION_COMPLETE", "Fabrication complete, ready for delivery"),
    DELIVERY_SCHEDULED("DELIVERY_SCHEDULED", "Delivery scheduled"),
    DELIVERED("DELIVERED", "Order delivered to customer"),
    COMPLETED("COMPLETED", "Order completed successfully"),
    CANCELLED("CANCELLED", "Order cancelled");

    private final String code;
    private final String description;

    OrderStatus(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public boolean isEditable() {
        return this == PENDING || this == QUOTE_SENT || this == QUOTE_ACCEPTED;
    }

    public boolean isCancellable() {
        return this != DELIVERED && this != COMPLETED && this != CANCELLED;
    }

    public boolean isPaymentRequired() {
        return this == QUOTE_ACCEPTED || this == SITE_VISIT_COMPLETED;
    }

    public boolean isFabricationInProgress() {
        return this == FABRICATION_STARTED || this == FABRICATION_IN_PROGRESS;
    }
}