package com.lohari.controller;

import com.lohari.dto.RagDTO.AskRequest;
import com.lohari.dto.RagDTO.AskResponse;
import com.lohari.dto.RagDTO.IngestionResponse;
import com.lohari.service.DataIngestionService;
import com.lohari.service.RagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rag")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3001"})
public class RagController {

    @Autowired
    private RagService ragService;

    @Autowired
    private DataIngestionService dataIngestionService;

    // ============================================
    // ASK A QUESTION
    // POST /api/rag/ask
    // ============================================
    @PostMapping("/ask")
    public ResponseEntity<AskResponse> ask(@RequestBody AskRequest request) {
        if (request.getQuestion() == null || request.getQuestion().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        AskResponse response = ragService.ask(request.getQuestion(), request.getTopK());
        return ResponseEntity.ok(response);
    }

    // ============================================
    // SYNC DATA
    // POST /api/rag/sync
    // ============================================
    @PostMapping("/sync")
    public ResponseEntity<IngestionResponse> syncData() {
        IngestionResponse response = dataIngestionService.ingestAllOrders();
        return ResponseEntity.ok(response);
    }

    // ============================================
    // HEALTH CHECK
    // GET /api/rag/health
    // ============================================
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("RAG service is running");
    }
}