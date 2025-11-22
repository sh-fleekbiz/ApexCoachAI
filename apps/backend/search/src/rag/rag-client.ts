/**
 * RagClient - A clean abstraction for RAG (Retrieval Augmented Generation) functionality
 *
 * This module wraps the existing Azure OpenAI and Azure Search logic into a single,
 * easy-to-use interface that can be extended in future prompts.
 */

import { type ChatApproach } from '../lib/approaches/approach.js';

export interface RagMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface RagCitation {
  id: string;
  type: 'text' | 'video'; // 'video' will be used later
  sourceId: string; // document or resource ID
  title: string;
  page?: number;
  startSeconds?: number;
  snippet?: string;
}

export interface RagResult {
  answer: string;
  citations: RagCitation[];
  thoughts?: string; // Debug information about the RAG process
}

export interface RagQueryArguments {
  messages: RagMessage[];
  context?: {
    retrieval_mode?: 'hybrid' | 'text' | 'vectors';
    semantic_ranker?: boolean;
    semantic_captions?: boolean;
    top?: number;
    temperature?: number;
    prompt_template?: string;
    suggest_followup_questions?: boolean;
  };
}

export interface RagClientConfig {
  chatApproach: ChatApproach;
}

/**
 * RagClient provides a unified interface for RAG operations
 */
export class RagClient {
  private chatApproach: ChatApproach;

  constructor(config: RagClientConfig) {
    this.chatApproach = config.chatApproach;
  }

  /**
   * Execute a RAG query and get a response with citations
   */
  async query(arguments_: RagQueryArguments): Promise<RagResult> {
    const { messages, context } = arguments_;

    // Use the existing ChatApproach implementation
    const response = await this.chatApproach.run(messages, context);

    // Extract the answer
    if (!response.choices || response.choices.length === 0) {
      console.warn('RAG query returned no choices');
    }
    const answer = response.choices[0]?.message.content ?? '';

    // Extract citations from data_points
    const citations = this.extractCitations(response.choices[0]?.message.context?.data_points?.text ?? []);

    // Extract thoughts for debugging
    const thoughts = response.choices[0]?.message.context?.thoughts;

    return {
      answer,
      citations,
      thoughts,
    };
  }

  /**
   * Execute a RAG query with streaming support
   */
  async *queryWithStreaming(arguments_: RagQueryArguments): AsyncGenerator<Partial<RagResult>, void> {
    const { messages, context } = arguments_;

    let firstChunk = true;
    let citations: RagCitation[] = [];
    let thoughts: string | undefined;

    // Use the existing ChatApproach streaming implementation
    for await (const chunk of this.chatApproach.runWithStreaming(messages, context)) {
      const delta = chunk.choices[0]?.delta;

      // Extract citations and thoughts from the first chunk
      if (firstChunk) {
        const dataPoints = delta?.context?.data_points?.text ?? [];
        citations = this.extractCitations(dataPoints);
        thoughts = delta?.context?.thoughts;
        firstChunk = false;
      }

      // Yield the partial result
      yield {
        answer: delta?.content ?? '',
        citations: citations.length > 0 ? citations : undefined,
        thoughts,
      };
    }
  }

  /**
   * Extract citations from data points returned by the RAG approach
   */
  private extractCitations(dataPoints: string[]): RagCitation[] {
    const citations: RagCitation[] = [];

    for (const [index, dataPoint] of dataPoints.entries()) {
      // Data points are in format: "sourcepage: content"
      const parts = dataPoint.split(':', 2);
      if (parts.length === 2) {
        const sourcePage = parts[0].trim();
        const snippet = parts[1].trim();

        citations.push({
          id: `citation-${index}`,
          type: 'text',
          sourceId: sourcePage,
          title: sourcePage,
          snippet: snippet.slice(0, 200), // Limit snippet length
        });
      }
    }

    return citations;
  }
}
