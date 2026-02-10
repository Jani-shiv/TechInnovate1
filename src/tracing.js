const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const logger = require('./logger');

// Configure the SDK to export traces to Jaeger via OTLP
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: 'anti-gravity-service',
});

// Initialize the SDK and register with the OpenTelemetry API
try {
  sdk.start();
  logger.info('OpenTelemetry initialized');
} catch (error) {
  logger.error('Error initializing OpenTelemetry', error);
}

// Gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => logger.info('Tracing terminated'))
    .catch((error) => logger.error('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

module.exports = sdk;
