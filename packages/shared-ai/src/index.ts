import OpenAI from 'openai';

// Exclusive chat model usage (gpt-5.1).
export type ChatModel = 'gpt-5.1';
export type EmbeddingModel = 'text-embedding-3-small';
export type ImageModel = 'gpt-image-1-mini';

const endpoint =
  process.env.AZURE_OPENAI_ENDPOINT ??
  'https://shared-openai-eastus2.openai.azure.com/openai/v1/';

const apiKey = process.env.AZURE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('AZURE_OPENAI_API_KEY is not set');
}

export const openai = new OpenAI({
  baseURL: endpoint,
  apiKey,
});

/**
 * Simple chat completion (non-streaming).
 */
export async function chatComplete(opts: {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  model?: ChatModel;
  temperature?: number;
  maxTokens?: number;
}) {
  const model: ChatModel = 'gpt-5.1';

  const completion = await openai.chat.completions.create({
    model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.4,
    max_completion_tokens: opts.maxTokens,
  });

  return completion;
}

/**
 * Streaming chat completion – returns the raw async iterator.
 * You can consume this in Next.js / Fastify / Express handlers.
 */
export async function chatStream(opts: {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  model?: ChatModel;
  temperature?: number;
}) {
  const model: ChatModel = 'gpt-5.1';

  const stream = await openai.chat.completions.create({
    model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.4,
    stream: true,
  });

  return stream;
}

/**
 * Embeddings using shared text-embedding-3-small deployment.
 */
export async function embedText(
  input: string | string[],
  modelOverride?: EmbeddingModel
): Promise<number[][]> {
  const model: EmbeddingModel =
    modelOverride ||
    (process.env.AZURE_OPENAI_EMBEDDING_MODEL as EmbeddingModel) ||
    'text-embedding-3-small';

  const res = await openai.embeddings.create({
    model,
    input,
  });

  return res.data.map((item) => item.embedding);
}

/**
 * Image generation via gpt-image-1-mini.
 */
export async function generateImage(opts: {
  prompt: string;
  size?: '512x512' | '1024x1024';
  model?: ImageModel;
}) {
  const model: ImageModel =
    opts.model ||
    (process.env.AZURE_OPENAI_IMAGE_MODEL as ImageModel) ||
    'gpt-image-1-mini';

  const result = await openai.images.generate({
    model,
    prompt: opts.prompt,
    n: 1,
    size: opts.size ?? '1024x1024',
  });

  return result.data[0]; // contains b64_json or URL depending on config
}
