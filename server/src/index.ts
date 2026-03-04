import dotenv from 'dotenv';
import { initTelemetry } from './telemetry';

dotenv.config();
initTelemetry();

import app from './app';

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`meetingmind-server listening on ${port}`);
});
