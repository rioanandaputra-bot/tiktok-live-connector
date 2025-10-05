import { Router, Request, Response } from 'express';
import { TikTokLiveConnector } from '../connector/TikTokConnector';
import { WebhookManager } from '../webhook/WebhookManager';
import { logger } from '../utils/logger';
import { validateApiKey } from '../middleware/auth';

const router = Router();

// Global instances (in production, use dependency injection)
let tikTokConnector: TikTokLiveConnector;
let webhookManager: WebhookManager;

export function initializeApiRoutes(connector: TikTokLiveConnector, webhook: WebhookManager) {
  tikTokConnector = connector;
  webhookManager = webhook;
}

// Get connection status
router.get('/status', validateApiKey, (req: Request, res: Response) => {
  try {
    const status = tikTokConnector?.getConnectionStatus() || { connected: false, username: '' };
    res.json({
      success: true,
      status,
      server: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error getting status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get webhook endpoints
router.get('/webhooks', validateApiKey, (req: Request, res: Response) => {
  try {
    const endpoints = webhookManager?.getEndpoints() || [];
    res.json({
      success: true,
      endpoints,
      count: endpoints.length
    });
  } catch (error) {
    logger.error('Error getting webhooks:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Add webhook endpoint
router.post('/webhooks', validateApiKey, async (req: Request, res: Response): Promise<void> => {
  try {
    const { url, secret, headers } = req.body;

    if (!url) {
      res.status(400).json({
        success: false,
        error: 'URL is required'
      });
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      });
      return;
    }

    // Test endpoint before adding
    const isWorking = await webhookManager?.testEndpoint(url);
    if (!isWorking) {
      res.status(400).json({
        success: false,
        error: 'Webhook endpoint is not responding'
      });
      return;
    }

    webhookManager?.addEndpoint({ url, secret, headers });

    res.json({
      success: true,
      message: 'Webhook endpoint added successfully'
    });
  } catch (error) {
    logger.error('Error adding webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Remove webhook endpoint
router.delete('/webhooks', validateApiKey, (req: Request, res: Response): void => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({
        success: false,
        error: 'URL is required'
      });
      return;
    }

    webhookManager?.removeEndpoint(url);

    res.json({
      success: true,
      message: 'Webhook endpoint removed successfully'
    });
  } catch (error) {
    logger.error('Error removing webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Test webhook endpoint
router.post('/webhooks/test', validateApiKey, async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({
        success: false,
        error: 'URL is required'
      });
      return;
    }

    const isWorking = await webhookManager?.testEndpoint(url);

    res.json({
      success: true,
      working: isWorking,
      message: isWorking ? 'Webhook is responding' : 'Webhook is not responding'
    });
  } catch (error) {
    logger.error('Error testing webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get recent events (for debugging)
const recentEvents: any[] = [];
const MAX_EVENTS = 100;

router.get('/events', validateApiKey, (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const events = recentEvents.slice(-limit);
    
    res.json({
      success: true,
      events,
      count: events.length,
      total: recentEvents.length
    });
  } catch (error) {
    logger.error('Error getting events:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Store events for debugging
export function storeEvent(event: any) {
  recentEvents.push(event);
  if (recentEvents.length > MAX_EVENTS) {
    recentEvents.shift();
  }
}

export { router as apiRoutes };