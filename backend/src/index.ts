import express, { Router } from 'express';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";

import stickyNoteRouter from './routers/stickyNotes';
import { errorHandler } from './handlers/errorHandler';
import { loggerHandler } from './handlers/requestHandler';
import { openApiDocument } from './openapi';


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(loggerHandler);
const apiV1Router = Router();
apiV1Router.use('/sticky-notes', stickyNoteRouter);
app.use('/api/v1', apiV1Router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger-ui is running on http://localhost:${PORT}/swagger-ui`);
});
