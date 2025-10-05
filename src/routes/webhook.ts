import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

// Webhook receiver endpoint
router.post('/receive', (req: Request, res: Response): void => {
  try {
    const event = req.body;
    
    // Log the received webhook
    logger.info('Webhook received:', {
      headers: req.headers,
      body: event,
      timestamp: new Date().toISOString()
    });

    // Validate webhook signature if provided
    const signature = req.headers['x-webhook-signature'] as string;
    if (signature && process.env.WEBHOOK_SECRET) {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(JSON.stringify(event))
        .digest('hex');

      if (signature !== expectedSignature) {
        logger.warn('Invalid webhook signature received');
        res.status(401).json({
          success: false,
          error: 'Invalid signature'
        });
        return;
      }
    }

    // Process the webhook event here
    // You can add custom logic to handle different event types
    processWebhookEvent(event);

    res.json({
      success: true,
      message: 'Webhook received successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check for webhook endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'webhook-receiver',
    timestamp: new Date().toISOString()
  });
});

function processWebhookEvent(event: any) {
  // Add your custom webhook processing logic here
  logger.info('Processing webhook event:', {
    type: event.type,
    id: event.id,
    timestamp: event.timestamp
  });

  // Example: Handle different event types
  switch (event.type) {
    case 'chat':
      handleChatEvent(event);
      break;
    case 'gift':
      handleGiftEvent(event);
      break;
    case 'follow':
      handleFollowEvent(event);
      break;
    default:
      logger.debug(`Unhandled event type: ${event.type}`);
  }
}

function handleChatEvent(event: any) {
  logger.info(`Chat event: ${event.data.username}: ${event.data.message}`);
  // Add custom chat handling logic
}

function handleGiftEvent(event: any) {
  logger.info(`Gift event: ${event.data.username} sent ${event.data.giftName}`);
  // Add custom gift handling logic
}

function handleFollowEvent(event: any) {
  logger.info(`Follow event: ${event.data.username} followed`);
  // Add custom follow handling logic
}

export { router as webhookRoutes };