import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

let sdk: NodeSDK | undefined;

export const initTelemetry = (): void => {
  if (sdk) {
    return;
  }

  const serviceName = process.env.OTEL_SERVICE_NAME || 'meetingmind-server';
  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

  if (process.env.LOG_LEVEL === 'debug') {
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
  }

  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
  });

  sdk = new NodeSDK({
    resource,
    traceExporter: endpoint ? new OTLPTraceExporter({ url: endpoint }) : undefined,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  void sdk.start();
};
