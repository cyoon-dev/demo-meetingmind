export interface DemoFlags {
  slowTranscription: boolean;
  summaryError: boolean;
  badNetwork: boolean;
  largePayload: boolean;
}

export interface MeetingRecord {
  id: string;
  createdAt: string;
  transcript?: string;
  summary?: {
    bullets: string[];
    actionItems: string[];
  };
}

export interface TranscribeResponse {
  transcript: string;
  durationMs: number;
}

export interface SummarizeResponse {
  summary: {
    bullets: string[];
    actionItems: string[];
  };
  durationMs: number;
}
