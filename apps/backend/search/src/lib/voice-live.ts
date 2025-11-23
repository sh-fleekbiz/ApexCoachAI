// Voice Live service scaffold for Azure real-time voice
// Built with minimal logic; integrate WebSocket pipeline later.
// Environment variables expected:
//  AZURE_VOICE_LIVE_ENDPOINT  (e.g. wss://<resource>.cognitiveservices.azure.com)
//  AZURE_VOICE_LIVE_PROJECT   (logical project or agent grouping)
//  AZURE_VOICE_LIVE_API_KEY   (Azure key with voice-live access)
//  AZURE_VOICE_LIVE_MODEL     (defaults to gpt-5.1 if unset)

export interface VoiceLiveConfig {
  endpoint: string;
  project: string;
  apiKey: string;
  model: string;
}

export class VoiceLiveService {
  private readonly config: VoiceLiveConfig | null;
  private initialized = false;

  constructor() {
    const endpoint = process.env.AZURE_VOICE_LIVE_ENDPOINT;
    const project = process.env.AZURE_VOICE_LIVE_PROJECT;
    const apiKey = process.env.AZURE_VOICE_LIVE_API_KEY;
    const model = process.env.AZURE_VOICE_LIVE_MODEL || 'gpt-5.1';

    if (endpoint && project && apiKey) {
      this.config = { endpoint, project, apiKey, model };
      this.initialized = true;
      // eslint-disable-next-line no-console
      console.log(`[VoiceLive] initialized model=${model}`);
    } else {
      this.config = null;
      // eslint-disable-next-line no-console
      console.warn('[VoiceLive] not configured (missing env vars)');
    }
  }

  isReady(): boolean {
    return this.initialized;
  }

  async startSession(
    participantId: string
  ): Promise<{ sessionId: string } | null> {
    if (!this.config) return null;
    const sessionId = `${Date.now()}-${participantId}`;
    return { sessionId };
  }

  async sendAudio(
    _sessionId: string,
    chunk: Buffer | Uint8Array
  ): Promise<boolean> {
    if (!this.config) return false;
    // Future: stream chunk over WebSocket
    if (chunk.length === 0) return false;
    return true;
  }

  async requestInference(_sessionId: string): Promise<string | null> {
    if (!this.config) return null;
    // Placeholder: integrate model response retrieval
    return 'voice-live inference placeholder';
  }

  async endSession(_sessionId: string): Promise<void> {
    if (!this.config) return;
  }
}

export const voiceLiveService = new VoiceLiveService();
