package com.lohari.service;

import com.lohari.dto.RagDTO.AskResponse;
import com.lohari.dto.RagDTO.SourceChunk;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RagService {

    @Autowired
    private VectorStore vectorStore;

    @Autowired
    private ChatClient.Builder chatClientBuilder;

    @Value("${app.rag.top-k:5}")
    private int defaultTopK;

    @Value("${app.rag.similarity-threshold:0.7}")
    private double similarityThreshold;

    // ============================================
    // MAIN: Ask question with RAG
    // ============================================
    public AskResponse ask(String question, Integer topK) {
        long startTime = System.currentTimeMillis();

        int k = (topK != null && topK > 0) ? topK : defaultTopK;

        // 1. Vector search — retrieve relevant chunks
        List<Document> relevantDocs = vectorStore.similaritySearch(
            SearchRequest.builder()
                .query(question)
                .topK(k)
                .similarityThreshold(similarityThreshold)
                .build()
        );

        // 2. Build context from retrieved docs
        String context = buildContext(relevantDocs);

        // 3. Build prompt
        String prompt = buildPrompt(question, context);

        // 4. Call LLM (Ollama)
        String answer = chatClientBuilder.build()
            .prompt()
            .user(prompt)
            .call()
            .content();

        // 5. Build sources
        List<SourceChunk> sources = relevantDocs.stream()
            .map(doc -> new SourceChunk(
                doc.getText(),
                doc.getMetadata().get("score") != null
                    ? ((Number) doc.getMetadata().get("score")).doubleValue()
                    : 0.0,
                (String) doc.getMetadata().getOrDefault("type", "UNKNOWN"),
                String.valueOf(doc.getMetadata().getOrDefault("orderId", ""))
            ))
            .collect(Collectors.toList());

        long responseTime = System.currentTimeMillis() - startTime;

        return new AskResponse(answer, sources, responseTime);
    }

    // ============================================
    // BUILD CONTEXT
    // ============================================
    private String buildContext(List<Document> docs) {
        if (docs.isEmpty()) {
            return "No relevant data found in the database.";
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < docs.size(); i++) {
            sb.append("--- Document ").append(i + 1).append(" ---\n");
            sb.append(docs.get(i).getText()).append("\n\n");
        }
        return sb.toString();
    }

    // ============================================
    // BUILD PROMPT
    // ============================================
    private String buildPrompt(String question, String context) {
        return """
            You are a helpful assistant for Lohari Fabrication, a metal fabrication business.
            Answer the user's question based ONLY on the context provided below.
            If the context doesn't contain the answer, say "I don't have enough information to answer that."
            Be concise and factual. Use INR (Rs) for currency.

            CONTEXT:
            %s

            QUESTION: %s

            ANSWER:
            """.formatted(context, question);
    }
}