const BASE_LINES = [
  'Team aligned on Q3 growth targets and campaign launch sequence.',
  'Customer success requested faster feedback loops from product.',
  'Engineering highlighted API latency concerns for peak traffic.',
  'Marketing proposed a two-week pilot for onboarding improvements.',
  'Sales asked for refreshed battle cards before enterprise demos.',
  'Design shared revised mobile upload and summary screen mocks.',
  'AI summary quality improved after adding context windows.',
  'Security reminded teams to rotate service keys monthly.',
  'Finance requested clearer cost attribution for inference calls.',
  'PM agreed to publish weekly rollout and incident updates.'
];

export const randomDelay = (minMs: number, maxMs: number): number => {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
};

export const wait = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

export const buildTranscript = (largePayload = false): string => {
  const lineCount = largePayload ? 120 : 45;
  return Array.from({ length: lineCount }, (_, index) => {
    const line = BASE_LINES[index % BASE_LINES.length];
    return `${index + 1}. ${line}`;
  }).join('\n');
};

export const buildSummary = () => ({
  bullets: [
    'Q3 execution will focus on onboarding speed and enterprise readiness.',
    'Team agreed to mitigate transcription latency before customer pilot.',
    'Cross-functional updates will be tracked through weekly status notes.'
  ],
  actionItems: [
    'Engineering: Ship retry-safe upload endpoint by Friday.',
    'Product: Validate summary quality on ten customer recordings.',
    'Sales Enablement: Distribute updated battle cards this week.'
  ]
});
