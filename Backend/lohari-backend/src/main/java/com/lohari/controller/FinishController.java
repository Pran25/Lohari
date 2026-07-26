package com.lohari.controller;

import com.lohari.model.Finish;
import com.lohari.repository.FinishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/finishes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class FinishController {

    @Autowired
    private FinishRepository finishRepository;

    @GetMapping
    public ResponseEntity<List<Finish>> getAllFinishes() {
        return ResponseEntity.ok(finishRepository.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Finish>> getActiveFinishes() {
        return ResponseEntity.ok(finishRepository.findByIsActiveTrue());
    }

    @PostMapping("/admin")
    public ResponseEntity<Finish> createFinish(@RequestBody Finish finish) {
        finish.setCreatedAt(LocalDateTime.now());
        finish.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(finishRepository.save(finish));
    }
}