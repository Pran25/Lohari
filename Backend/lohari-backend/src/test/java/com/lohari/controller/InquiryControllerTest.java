package com.lohari.controller;

import com.lohari.model.Inquiry;
import com.lohari.repository.InquiryRepository;
import com.lohari.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InquiryControllerTest {

    @Mock
    private InquiryRepository inquiryRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private InquiryController inquiryController;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(inquiryController, "adminEmail", "admin@example.com");
    }

    @Test
    void siteVisitSubmissionEmailsBookingDetailsToCustomerAndAdmin() {
        Inquiry inquiry = new Inquiry();
        inquiry.setName("Test Customer");
        inquiry.setEmail("customer@example.com");
        inquiry.setPhone("+91 98765 43210");
        inquiry.setInquiryType("fitting");
        inquiry.setPreferredDate("2026-10-20");
        inquiry.setPreferredTime("14:30");
        inquiry.setAddress("MIDC Road, Chalisgaon");
        inquiry.setMessage("Please visit for measurements.");

        when(inquiryRepository.save(any(Inquiry.class))).thenAnswer(invocation -> {
            Inquiry saved = invocation.getArgument(0);
            saved.setId(42L);
            return saved;
        });
        when(emailService.sendEmail(anyString(), anyString(), anyString())).thenReturn(true);

        var response = inquiryController.createInquiry(inquiry);

        ArgumentCaptor<String> customerBody = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> adminBody = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendEmail(eq("customer@example.com"), contains("Site Visit"), customerBody.capture());
        verify(emailService).sendEmail(eq("admin@example.com"), contains("Site Visit"), adminBody.capture());

        assertEquals(Boolean.TRUE, response.getBody().get("customerEmailSent"));
        assertEquals(Boolean.TRUE, response.getBody().get("adminEmailSent"));
        assertTrue(customerBody.getValue().contains(LocalDate.now().format(
                java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"))));
        assertTrue(customerBody.getValue().contains("2026-10-20"));
        assertTrue(customerBody.getValue().contains("+91 98765 43210"));
        assertTrue(customerBody.getValue().contains("MIDC Road, Chalisgaon"));
        assertTrue(adminBody.getValue().contains("+91 98765 43210"));
        assertTrue(adminBody.getValue().contains("MIDC Road, Chalisgaon"));
    }
}
