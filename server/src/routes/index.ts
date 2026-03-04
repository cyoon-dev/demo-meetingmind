import { Router } from 'express';
import { buildSummary, buildTranscript, randomDelay, wait } from '../utils/demoGenerators';
import { SummarizeRequest, SummarizeResponse, TranscribeRequest, TranscribeResponse } from '../types/api';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

router.post('/transcribe', async (req, res) => {
  const start = Date.now();
  const body = req.body as TranscribeRequest;

  if (body.demo?.badNetwork && Math.random() < 0.3) {
    await wait(randomDelay(1000, 2500));
    return res.status(408).json({ message: 'Simulated network timeout' });
  }

  if (body.demo?.slow) {
    await wait(randomDelay(3000, 8000));
  }

  const transcript = buildTranscript(body.options?.largePayload);

  const response: TranscribeResponse = {
    transcript,
    durationMs: Date.now() - start,
  };

  res.json(response);
});

router.post('/summarize', async (req, res) => {
  const start = Date.now();
  const body = req.body as SummarizeRequest;

  if (body.demo?.forceError) {
    return res.status(500).json({ message: 'Simulated summary failure' });
  }

  if (body.demo?.slow) {
    await wait(randomDelay(2000, 6000));
  }

  const response: SummarizeResponse = {
    summary: buildSummary(),
    durationMs: Date.now() - start,
  };

  res.json(response);
});

export default router;
