export interface DemoFlags {
  slow?: boolean;
  badNetwork?: boolean;
  forceError?: boolean;
}

export interface RequestOptions {
  largePayload?: boolean;
}

export interface TranscribeRequest {
  meetingId: string;
  audioRef: string;
  options?: RequestOptions;
  demo?: Pick<DemoFlags, 'slow' | 'badNetwork'>;
}

export interface TranscribeResponse {
  transcript: string;
  durationMs: number;
}

export interface SummarizeRequest {
  meetingId: string;
  transcript: string;
  options?: RequestOptions;
  demo?: Pick<DemoFlags, 'forceError' | 'slow'>;
}

export interface SummarizeResponse {
  summary: {
    bullets: string[];
    actionItems: string[];
  };
  durationMs: number;
}
