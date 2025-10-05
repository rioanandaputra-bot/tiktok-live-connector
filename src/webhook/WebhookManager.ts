import axios from 'axios';
import { logger } from '../utils/logger';
import { TikTokEvent } from '../connector/TikTokConnector';

export interface WebhookEndpoint {
  url: string;
  secret?: string;
  headers?: Record<string, string>;
}

export class WebhookManager {
  private endpoints: WebhookEndpoint[] = [];
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  constructor() {
    this.loadEndpoints();
  }

  private loadEndpoints(): void {
    const webhookUrls = process.env.WEBHOOK_ENDPOINTS?.split(',') || [];
    const webhookSecret = process.env.WEBHOOK_SECRET;

    this.endpoints = webhookUrls.map(url => ({
      url: url.trim(),
      ...(webhookSecret && { secret: webhookSecret }),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TikTok-Live-Connector-API/1.0.0'
      }
    }));

    logger.info(`Loaded ${this.endpoints.length} webhook endpoints`);
  }

  async forwardData(event: TikTokEvent): Promise<void> {
    if (this.endpoints.length === 0) {
      logger.warn('No webhook endpoints configured');
      return;
    }

    const payload = {
      ...event,
      source: 'tiktok-live-connector',
      version: '1.0.0'
    };

    // Add signature if secret is provided
    if (this.endpoints[0]?.secret) {
      const signature = this.generateSignature(JSON.stringify(payload), this.endpoints[0].secret);
      Object.assign(payload, { signature });
    }

    // Send to all endpoints concurrently
    const promises = this.endpoints.map(endpoint => 
      this.sendWebhook(endpoint, payload)
    );

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      logger.error('Error in webhook forwarding:', error);
    }
  }

  private async sendWebhook(
    endpoint: WebhookEndpoint, 
    payload: any, 
    attempt: number = 1
  ): Promise<void> {
    try {
      const headers = { ...endpoint.headers };
      
      if (endpoint.secret) {
        headers['X-Webhook-Signature'] = this.generateSignature(
          JSON.stringify(payload), 
          endpoint.secret
        );
      }

      const response = await axios.post(endpoint.url, payload, {
        headers,
        timeout: 5000,
        validateStatus: (status) => status < 500 // Retry on 5xx errors
      });

      if (response.status >= 200 && response.status < 300) {
        logger.debug(`Webhook sent successfully to ${endpoint.url}`);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      logger.error(`Webhook failed for ${endpoint.url} (attempt ${attempt}):`, error);

      if (attempt < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        logger.info(`Retrying webhook in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.sendWebhook(endpoint, payload, attempt + 1);
      } else {
        logger.error(`Max retries reached for webhook ${endpoint.url}`);
      }
    }
  }

  private generateSignature(payload: string, secret: string): string {
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  }

  addEndpoint(endpoint: WebhookEndpoint): void {
    this.endpoints.push(endpoint);
    logger.info(`Added webhook endpoint: ${endpoint.url}`);
  }

  removeEndpoint(url: string): void {
    const index = this.endpoints.findIndex(ep => ep.url === url);
    if (index > -1) {
      this.endpoints.splice(index, 1);
      logger.info(`Removed webhook endpoint: ${url}`);
    }
  }

  getEndpoints(): Omit<WebhookEndpoint, 'secret'>[] {
    return this.endpoints.map(ep => ({
      url: ep.url,
      ...(ep.headers && { headers: ep.headers })
      // Don't expose secrets
    }));
  }

  async testEndpoint(url: string): Promise<boolean> {
    try {
      const testPayload = {
        type: 'test',
        data: { message: 'Test webhook from TikTok Live Connector' },
        timestamp: new Date().toISOString(),
        id: `test_${Date.now()}`
      };

      const response = await axios.post(url, testPayload, {
        timeout: 5000,
        validateStatus: (status) => status < 500
      });

      return response.status >= 200 && response.status < 300;
    } catch (error) {
      logger.error(`Webhook test failed for ${url}:`, error);
      return false;
    }
  }
}