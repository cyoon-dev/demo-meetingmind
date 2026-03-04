import cors from 'cors';
import express from 'express';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestTelemetryMiddleware } from './middleware/requestTelemetry';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(requestTelemetryMiddleware);
app.use(routes);
app.use(errorHandler);

export default app;
