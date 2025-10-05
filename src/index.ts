import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { TikTokLiveConnector } from './connector/TikTokConnector';
import { WebhookManager } from './webhook/WebhookManager';
import { logger } from './utils/logger';
import { apiRoutes, initializeApiRoutes, storeEvent } from './routes/api';
import { webhookRoutes } from './routes/webhook';
import docsRoutes from './routes/docs';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api', docsRoutes); // API documentation
app.use('/api', apiRoutes);
app.use('/webhook', webhookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route - redirect to API documentation
app.get('/', (req, res) => {
  res.redirect('/api/docs');
});

// Error handling middleware
app.use(errorHandler);

// Initialize TikTok connector and webhook manager
const tikTokConnector = new TikTokLiveConnector();
const webhookManager = new WebhookManager();

async function startServer() {
  try {
    // Start the Express server
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });

    // Initialize API routes with dependencies
    initializeApiRoutes(tikTokConnector, webhookManager);

    // Initialize TikTok connector
    await tikTokConnector.connect();
    
    // Setup webhook forwarding
    tikTokConnector.on('data', (data: any) => {
      webhookManager.forwardData(data);
      storeEvent(data); // Store for API access
    });

    logger.info('TikTok Live Connector API started successfully');
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await tikTokConnector.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await tikTokConnector.disconnect();
  process.exit(0);
});

startServer();

export default app;