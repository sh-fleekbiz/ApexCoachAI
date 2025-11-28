-- Create pgvector extension if not present
CREATE EXTENSION IF NOT EXISTS vector;

-- Table to store RAG sections and embeddings for ApexCoachAI
CREATE TABLE IF NOT EXISTS knowledge_base_sections (
    id          BIGSERIAL PRIMARY KEY,
    index_name  TEXT NOT NULL,
    content     TEXT NOT NULL,
    category    TEXT,
    sourcepage  TEXT,
    sourcefile  TEXT,
    program_id  INTEGER REFERENCES programs(id) ON DELETE SET NULL,
    embedding   VECTOR(1536) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vector index for fast similarity search
CREATE INDEX IF NOT EXISTS idx_knowledge_base_sections_embedding
    ON knowledge_base_sections USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_sections_index_name
    ON knowledge_base_sections (index_name);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_sections_program_id
    ON knowledge_base_sections (program_id);
