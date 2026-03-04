import * as Device from 'expo-device';
import Constants from 'expo-constants';

type Attributes = Record<string, string | number | boolean | undefined>;

interface SpanHandle {
  end: (extraAttrs?: Attributes) => void;
}

class TelemetryClient {
  private readonly commonAttrs: Attributes;

  constructor() {
    this.commonAttrs = {
      'app.version': Constants.expoConfig?.version ?? '1.0.0',
      'device.os': Device.osName,
      'device.model': Device.modelName,
      'otel.service_name': process.env.OTEL_SERVICE_NAME ?? 'meetingmind-mobile',
    };
  }

  trackEvent(name: string, attrs?: Attributes): void {
    console.log('[telemetry:event]', name, { ...this.commonAttrs, ...attrs });
  }

  startSpan(name: string, attrs?: Attributes): SpanHandle {
    const start = Date.now();
    console.log('[telemetry:span:start]', name, { ...this.commonAttrs, ...attrs });

    return {
      end: (extraAttrs?: Attributes) => {
        console.log('[telemetry:span:end]', name, {
          ...this.commonAttrs,
          ...attrs,
          ...extraAttrs,
          duration_ms: Date.now() - start,
        });
      },
    };
  }

  captureError(error: unknown, attrs?: Attributes): void {
    const err = error instanceof Error ? error : new Error(String(error));
    console.log('[telemetry:error]', {
      ...this.commonAttrs,
      ...attrs,
      'error.type': err.name,
      'error.message': err.message,
      stack: err.stack,
    });
  }
}

export const telemetryClient = new TelemetryClient();
