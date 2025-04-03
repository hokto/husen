import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './sticky-notes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.method, req.url);
  next();
});
app.use('/api/v1/sticky-notes', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
