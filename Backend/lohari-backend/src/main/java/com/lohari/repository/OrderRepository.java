package com.lohari.repository;

import com.lohari.model.Order;
import com.lohari.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ========== BASIC ==========
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByCustomerEmail(String customerEmail);
    List<Order> findByStatus(OrderStatus status);

    // ========== DATE RANGE - FIXED (Using >= and <=) ==========
    @Query("SELECT o FROM Order o WHERE o.orderDate >= :start AND o.orderDate <= :end")
    List<Order> findByOrderDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query(value = "SELECT * FROM orders WHERE DATE(order_date) = CURRENT_DATE", nativeQuery = true)
    List<Order> findTodaysOrders();

    @Query(value = "SELECT * FROM orders WHERE EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE)", nativeQuery = true)
    List<Order> findThisMonthsOrders();

    // ========== PAGINATED ==========
    @Query("SELECT o FROM Order o WHERE o.customerEmail = :email")
    Page<Order> findByCustomerEmail(@Param("email") String customerEmail, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.status = :status")
    Page<Order> findByStatus(@Param("status") OrderStatus status, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.orderDate >= :start AND o.orderDate <= :end")
    Page<Order> findByOrderDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, Pageable pageable);

    // ========== STATISTICS ==========
    @Query("SELECT COUNT(o) FROM Order o")
    long countAllOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status != 'CANCELLED'")
    long countActiveOrders();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    Double sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != 'CANCELLED'")
    Double sumActiveRevenue();

    @Query(value = "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(order_date) = CURRENT_DATE", nativeQuery = true)
    Double sumTodayRevenue();

    @Query(value = "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE)", nativeQuery = true)
    Double sumThisMonthRevenue();

    @Query(value = "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE EXTRACT(YEAR FROM order_date) = EXTRACT(YEAR FROM CURRENT_DATE)", nativeQuery = true)
    Double sumThisYearRevenue();

    @Query("SELECT COALESCE(AVG(o.totalAmount), 0) FROM Order o")
    Double averageOrderValue();

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countOrdersByStatus();

    @Query(value = "SELECT * FROM orders ORDER BY order_date DESC LIMIT :limit", nativeQuery = true)
    List<Order> findTopRecentOrders(@Param("limit") int limit);

    // ========== TRENDING ==========
    @Query("SELECT o.productName, SUM(o.quantity) FROM Order o GROUP BY o.productName ORDER BY SUM(o.quantity) DESC")
    List<Object[]> findTopSellingProducts();

    // ========== CUSTOMER ==========
    @Query("SELECT DISTINCT o.customerEmail FROM Order o")
    List<String> findDistinctCustomerEmails();

    @Query("SELECT COUNT(DISTINCT o.customerEmail) FROM Order o")
    long countDistinctCustomers();
}