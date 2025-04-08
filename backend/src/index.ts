import express, { Router } from 'express';
import cors from 'cors';
import stickyNoteRouter from './routers/stickyNotes';
import { errorHandler } from './handlers/errorHandler';
import { loggerHandler } from './handlers/requestHandler';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(loggerHandler);
const apiV1Router = Router();
apiV1Router.use('/sticky-notes', stickyNoteRouter);
app.use('/api/v1', apiV1Router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
