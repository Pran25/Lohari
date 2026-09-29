package com.lohari.dto;

import java.util.List;

public class RagDTO {

    // ============================================
    // REQUEST
    // ============================================
    public static class AskRequest {
        private String question;
        private Integer topK = 5;

        public AskRequest() {}

        public AskRequest(String question, Integer topK) {
            this.question = question;
            this.topK = topK;
        }

        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }

        public Integer getTopK() { return topK; }
        public void setTopK(Integer topK) { this.topK = topK; }
    }

    // ============================================
    // RESPONSE
    // ============================================
    public static class AskResponse {
        private String answer;
        private List<SourceChunk> sources;
        private long responseTimeMs;

        public AskResponse() {}

        public AskResponse(String answer, List<SourceChunk> sources, long responseTimeMs) {
            this.answer = answer;
            this.sources = sources;
            this.responseTimeMs = responseTimeMs;
        }

        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }

        public List<SourceChunk> getSources() { return sources; }
        public void setSources(List<SourceChunk> sources) { this.sources = sources; }

        public long getResponseTimeMs() { return responseTimeMs; }
        public void setResponseTimeMs(long responseTimeMs) { this.responseTimeMs = responseTimeMs; }
    }

    // ============================================
    // SOURCE CHUNK
    // ============================================
    public static class SourceChunk {
        private String content;
        private Double score;
        private String type;
        private String id;

        public SourceChunk() {}

        public SourceChunk(String content, Double score, String type, String id) {
            this.content = content;
            this.score = score;
            this.type = type;
            this.id = id;
        }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public Double getScore() { return score; }
        public void setScore(Double score) { this.score = score; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
    }

    // ============================================
    // INGESTION RESPONSE
    // ============================================
    public static class IngestionResponse {
        private int ordersIngested;
        private int productsIngested;
        private int totalIngested;
        private String message;

        public IngestionResponse() {}

        public IngestionResponse(int ordersIngested, int productsIngested,
                                 int totalIngested, String message) {
            this.ordersIngested = ordersIngested;
            this.productsIngested = productsIngested;
            this.totalIngested = totalIngested;
            this.message = message;
        }

        public int getOrdersIngested() { return ordersIngested; }
        public void setOrdersIngested(int ordersIngested) { this.ordersIngested = ordersIngested; }

        public int getProductsIngested() { return productsIngested; }
        public void setProductsIngested(int productsIngested) { this.productsIngested = productsIngested; }

        public int getTotalIngested() { return totalIngested; }
        public void setTotalIngested(int totalIngested) { this.totalIngested = totalIngested; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}