package com.lohari.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    // ========== ORDER COUNTS ==========
    private Long totalOrders;
    private Long activeOrders;
    private Long totalCustomers;

    // ========== REVENUE ==========
    private Double totalRevenue;
    private Double activeRevenue;
    private Double todayRevenue;
    private Double thisMonthRevenue;
    private Double thisYearRevenue;
    private Double averageOrderValue;

    // ========== BREAKDOWNS ==========
    private Map<String, Long> ordersByStatus;
    private List<OrderResponse> recentOrders;

    // ========== GETTERS AND SETTERS ==========

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public Long getActiveOrders() { return activeOrders; }
    public void setActiveOrders(Long activeOrders) { this.activeOrders = activeOrders; }

    public Long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(Long totalCustomers) { this.totalCustomers = totalCustomers; }

    public Double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }

    public Double getActiveRevenue() { return activeRevenue; }
    public void setActiveRevenue(Double activeRevenue) { this.activeRevenue = activeRevenue; }

    public Double getTodayRevenue() { return todayRevenue; }
    public void setTodayRevenue(Double todayRevenue) { this.todayRevenue = todayRevenue; }

    public Double getThisMonthRevenue() { return thisMonthRevenue; }
    public void setThisMonthRevenue(Double thisMonthRevenue) { this.thisMonthRevenue = thisMonthRevenue; }

    public Double getThisYearRevenue() { return thisYearRevenue; }
    public void setThisYearRevenue(Double thisYearRevenue) { this.thisYearRevenue = thisYearRevenue; }

    public Double getAverageOrderValue() { return averageOrderValue; }
    public void setAverageOrderValue(Double averageOrderValue) { this.averageOrderValue = averageOrderValue; }

    public Map<String, Long> getOrdersByStatus() { return ordersByStatus; }
    public void setOrdersByStatus(Map<String, Long> ordersByStatus) { this.ordersByStatus = ordersByStatus; }

    public List<OrderResponse> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderResponse> recentOrders) { this.recentOrders = recentOrders; }
}