-- Migration: Create knowledge_base_documents table
-- Database: apexcoachai_db on pg-shared-apps-eastus2

-- Create knowledge base documents table
CREATE TABLE IF NOT EXISTS knowledge_base_documents (
  id SERIAL PRIMARY KEY,
  program_id INTEGER REFERENCES programs(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  type VARCHAR(50) NOT NULL, -- pdf, docx, txt, url
  source TEXT NOT NULL, -- file path or URL
  status VARCHAR(50) DEFAULT 'pending', -- pending, indexed, failed
  training_status VARCHAR(50) DEFAULT 'not_trained', -- not_trained, training, trained, failed
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_kb_documents_program_id ON knowledge_base_documents(program_id);
CREATE INDEX IF NOT EXISTS idx_kb_documents_status ON knowledge_base_documents(status);
CREATE INDEX IF NOT EXISTS idx_kb_documents_training_status ON knowledge_base_documents(training_status);
CREATE INDEX IF NOT EXISTS idx_kb_documents_type ON knowledge_base_documents(type);
CREATE INDEX IF NOT EXISTS idx_kb_documents_created_at ON knowledge_base_documents(created_at DESC);

-- Add full-text search on title
CREATE INDEX IF NOT EXISTS idx_kb_documents_title_search ON knowledge_base_documents USING gin(to_tsvector('english', title));

-- Add comments for documentation
COMMENT ON TABLE knowledge_base_documents IS 'Knowledge base documents for RAG training and indexing';
COMMENT ON COLUMN knowledge_base_documents.program_id IS 'Optional program linkage for scoped knowledge';
COMMENT ON COLUMN knowledge_base_documents.title IS 'Document title (auto-extracted or user-provided)';
COMMENT ON COLUMN knowledge_base_documents.type IS 'Document type: pdf, docx, txt, url';
COMMENT ON COLUMN knowledge_base_documents.source IS 'File path in blob storage or URL';
COMMENT ON COLUMN knowledge_base_documents.status IS 'Upload/indexing status: pending, indexed, failed';
COMMENT ON COLUMN knowledge_base_documents.training_status IS 'AI training status: not_trained, training, trained, failed';
COMMENT ON COLUMN knowledge_base_documents.metadata IS 'JSON metadata: fileSize, pageCount, chunksCreated, etc.';

-- Create trigger to update updated_at on row modification
CREATE OR REPLACE FUNCTION update_knowledge_base_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_knowledge_base_documents_updated_at
BEFORE UPDATE ON knowledge_base_documents
FOR EACH ROW
EXECUTE FUNCTION update_knowledge_base_documents_updated_at();
