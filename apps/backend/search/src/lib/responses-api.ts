/**
 * Azure OpenAI Responses API (v1 GA) Client
 * 
 * Uses stateful Responses API with input field and previous_response_id
 * for conversation continuity.
 */

interface ResponsesApiOutputItem {
  type?: string;
  content?: string | Array<{ type?: string; text?: string }>;
  text?: string;
}

interface ResponsesApiResponse {
  id: string;
  output?: ResponsesApiOutputItem[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export interface ResponsesApiOptions {
  previousResponseId?: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseFormat?: 'text' | 'json_object';
  instructions?: string;
}

export interface ResponsesApiResult {
  content: string;
  responseId: string;
  usage?: ResponsesApiResponse['usage'];
}

/**
 * Call Azure OpenAI Responses API
 */
export async function callResponsesApi(
  input: string | Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: ResponsesApiOptions,
  apiKey: string,
  responsesUrl: string,
  model: string
): Promise<ResponsesApiResult> {
  // Convert input to Responses API format
  let inputPayload: any;
  let instructions = options.instructions;

  if (typeof input === 'string') {
    // Simple string input
    inputPayload = input;
  } else {
    // Array of messages - convert to input format
    // Extract system message to instructions if present
    const systemMessages = input.filter((m) => m.role === 'system');
    const nonSystemMessages = input.filter((m) => m.role !== 'system');
    
    if (systemMessages.length > 0 && !instructions) {
      instructions = systemMessages[0].content;
    }

    // Convert messages to input array format
    inputPayload = nonSystemMessages.map((msg) => ({
      role: msg.role,
      content: [{ type: 'input_text', text: msg.content }],
    }));
  }

  const payload: any = {
    model,
    input: inputPayload,
  };

  if (instructions) {
    payload.instructions = instructions;
  }

  if (options.previousResponseId) {
    payload.previous_response_id = options.previousResponseId;
  }

  if (options.temperature !== undefined) {
    payload.temperature = options.temperature;
  }

  if (options.maxOutputTokens !== undefined) {
    payload.max_output_tokens = options.maxOutputTokens;
  }

  if (options.responseFormat) {
    payload.response_format = { type: options.responseFormat };
  }

  const response = await fetch(responsesUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Responses API failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: ResponsesApiResponse = await response.json();

  // Parse Responses API response format
  const outputItems = data.output || [];
  
  // Extract text content from output items
  let content = '';
  for (const item of outputItems) {
    if (item.type === 'message' || item.type === 'output_text' || !item.type) {
      if (Array.isArray(item.content)) {
        content = item.content
          .map((c) => (typeof c === 'object' && c.text ? c.text : String(c)))
          .join('\n');
      } else if (typeof item.content === 'string') {
        content = item.content;
      } else if (item.text) {
        content = item.text;
      }
      
      if (content) {
        break;
      }
    }
  }

  if (!content) {
    throw new Error('No content found in Responses API response');
  }

  return {
    content,
    responseId: data.id || '',
    usage: data.usage,
  };
}

