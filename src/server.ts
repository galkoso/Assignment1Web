import 'dotenv/config';
import express, { Request, Response } from 'express';
import { connectDB } from './config/database.js';
import postRouter from './router/posts/post.router.js';

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/posts', postRouter);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome',
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Node.js version: ${process.version}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
