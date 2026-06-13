import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import vtuRoutes from './routes/vtu';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vtu', vtuRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`OBEY Backend listening on port ${port}`);
});
