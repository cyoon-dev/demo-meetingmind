import { SummarizeResponse, TranscribeResponse } from '../types/api';
import { telemetryClient } from '../telemetry/TelemetryClient';

const API_BASE_URL = process.env.MOBILE_API_BASE_URL ?? 'http://localhost:4000';

const withTimeout = async (url: string, options: RequestInit, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
};

const requestWithRetry = async <T>(
  path: string,
  body: unknown,
  attrs: Record<string, string | number | boolean>,
  badNetwork: boolean
): Promise<T> => {
  const maxTry = badNetwork ? 2 : 1;

  for (let retry = 0; retry < maxTry; retry += 1) {
    const span = telemetryClient.startSpan(`http.client: ${path}`, { ...attrs, retry_count: retry });
    const started = Date.now();

    try {
      if (badNetwork && retry === 0) {
        throw new Error('Simulated mobile network drop');
      }
      const response = await withTimeout(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }, badNetwork ? 5000 : 15000);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as T;
      span.end({
        http_method: 'POST',
        http_status_code: response.status,
        duration_ms: Date.now() - started,
      });
      return data;
    } catch (error) {
      telemetryClient.captureError(error, { path, retry_count: retry });
      span.end({ error: true, duration_ms: Date.now() - started });
      if (retry === maxTry - 1) {
        throw error;
      }
    }
  }

  throw new Error('Unreachable');
};

export const transcribeMeeting = (
  payload: Record<string, unknown>,
  badNetwork: boolean,
  attrs: Record<string, string | number | boolean>
): Promise<TranscribeResponse> => requestWithRetry('/transcribe', payload, attrs, badNetwork);

export const summarizeMeeting = (
  payload: Record<string, unknown>,
  badNetwork: boolean,
  attrs: Record<string, string | number | boolean>
): Promise<SummarizeResponse> => requestWithRetry('/summarize', payload, attrs, badNetwork);
