import { ChatResponseError } from '../../utils/index.js';

export interface ExtendedChatHttpOptions extends ChatHttpOptions {
  chatId?: string | number | null;
  personalityId?: string | number | null;
}

export async function callHttpApi(
  { question, type, approach, overrides, messages }: ChatRequestOptions,
  {
    method,
    url,
    stream,
    signal,
    chatId,
    personalityId,
  }: ExtendedChatHttpOptions
) {
  // Use new API format for chat when chatId or personalityId is provided
  if (
    type === 'chat' &&
    (chatId !== undefined || personalityId !== undefined)
  ) {
    // Parse chatId and personalityId to numbers if provided
    const parsedChatId = chatId
      ? typeof chatId === 'string'
        ? Number.parseInt(chatId, 10)
        : chatId
      : null;
    const parsedPersonalityId = personalityId
      ? typeof personalityId === 'string'
        ? Number.parseInt(personalityId, 10)
        : personalityId
      : null;

    // Convert messages array to single input string (use last user message or question)
    const input = question || messages?.[messages.length - 1]?.content || '';

    // Construct API URL - append /api/chat if not already present
    const baseUrl = url.replace(/\/$/, ''); // Remove trailing slash
    const apiUrl = baseUrl.endsWith('/api/chat')
      ? baseUrl
      : `${baseUrl}/api/chat`;

    return await fetch(apiUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      signal,
      body: JSON.stringify({
        input,
        chatId: parsedChatId,
        personalityId: parsedPersonalityId,
        context: {
          ...overrides,
          approach,
        },
        stream: stream,
      }),
    });
  }

  // Fallback to original format for other endpoints or when chatId/personalityId not provided
  return await fetch(`${url}/${type}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    signal,
    body: JSON.stringify({
      messages: [
        ...(messages ?? []),
        {
          content: question,
          role: 'user',
        },
      ],
      context: {
        ...overrides,
        approach,
      },
      stream: type === 'chat' ? stream : false,
    }),
  });
}

export async function getAPIResponse(
  requestOptions: ChatRequestOptions,
  httpOptions: ExtendedChatHttpOptions
): Promise<BotResponse | Response> {
  const response = await callHttpApi(requestOptions, httpOptions);

  // TODO: we should just use the value from httpOptions.stream
  const streamResponse =
    requestOptions.type === 'ask' ? false : httpOptions.stream;
  if (streamResponse) {
    return response;
  }
  const parsedResponse: BotResponse = await response.json();
  if (response.status > 299 || !response.ok) {
    throw (
      new ChatResponseError(response.statusText, response.status) ||
      'API Response Error'
    );
  }
  return parsedResponse;
}
