/**
 * Embedding Service for Knowledge Base Retraining
 * 
 * Generates embeddings using Azure OpenAI and manages knowledge base sections.
 */

/** Minimal logger interface compatible with Fastify and Pino */
export interface Logger {
  info: (msg: string | object, ...args: unknown[]) => void;
  warn: (msg: string | object, ...args: unknown[]) => void;
  error: (msg: string | object, ...args: unknown[]) => void;
  debug: (msg: string | object, ...args: unknown[]) => void;
}

export interface EmbeddingConfig {
  endpoint: string;
  apiKey: string;
  model: string;
}

export interface Section {
  content: string;
  sourcepage: string;
  sourcefile: string;
  category: string;
  program_id?: number | null;
  embedding?: number[];
}

/**
 * Simple text chunker for splitting content into sections
 */
export function chunkText(
  text: string,
  maxChunkSize: number = 1000,
  overlap: number = 100
): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + ' ' + sentence).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      // Keep last part for overlap
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlap / 5));
      currentChunk = overlapWords.join(' ') + ' ' + sentence;
    } else {
      currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text];
}

export class EmbeddingService {
  private config: EmbeddingConfig;
  private logger: Logger;

  constructor(logger: Logger, config?: Partial<EmbeddingConfig>) {
    this.logger = logger;
    
    // Build config from env vars with optional overrides
    const endpoint = config?.endpoint || process.env.AZURE_OPENAI_EMBEDDING_ENDPOINT || 
      `https://${process.env.AZURE_OPENAI_SERVICE || 'shared-openai-eastus2'}.cognitiveservices.azure.com/openai/deployments/${process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || 'text-embedding-3-small'}/embeddings?api-version=2023-05-15`;
    
    this.config = {
      endpoint,
      apiKey: config?.apiKey || process.env.AZURE_OPENAI_API_KEY || '',
      model: config?.model || process.env.AZURE_OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    };
  }

  /**
   * Generate embedding for a single text
   */
  async createEmbedding(text: string): Promise<number[]> {
    const embeddings = await this.createEmbeddingsBatch([text]);
    return embeddings[0] || [];
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async createEmbeddingsBatch(texts: string[]): Promise<number[][]> {
    if (!this.config.apiKey) {
      throw new Error('AZURE_OPENAI_API_KEY not configured');
    }

    if (texts.length === 0) {
      return [];
    }

    this.logger.debug(`Generating embeddings for ${texts.length} texts`);

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          input: texts,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Embedding API error: ${response.status} - ${errorText}`);
        throw new Error(`Embedding generation failed: ${response.statusText}`);
      }

      const data = await response.json() as { data?: Array<{ embedding: number[] }> };
      return (data.data || []).map((d) => d.embedding);
    } catch (error) {
      this.logger.error({ error }, 'Failed to generate embeddings');
      throw error;
    }
  }

  /**
   * Process content into sections with embeddings
   */
  async processContentIntoSections(
    content: string,
    sourcefile: string,
    category: string,
    programId?: number | null
  ): Promise<Section[]> {
    const chunks = chunkText(content);
    this.logger.info(`Split content into ${chunks.length} chunks`);

    const sections: Section[] = chunks.map((chunk, index) => ({
      content: chunk,
      sourcepage: `${sourcefile}#page=${index + 1}`,
      sourcefile,
      category,
      program_id: programId,
    }));

    // Generate embeddings in batches
    const batchSize = 20;
    for (let i = 0; i < sections.length; i += batchSize) {
      const batch = sections.slice(i, i + batchSize);
      const texts = batch.map((s) => s.content);
      const embeddings = await this.createEmbeddingsBatch(texts);
      
      for (let j = 0; j < batch.length; j++) {
        batch[j].embedding = embeddings[j];
      }
      
      this.logger.debug(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sections.length / batchSize)}`);
    }

    return sections;
  }
}
