import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function validateApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const expectedApiKey = process.env.API_KEY;

  // If no API key is configured, skip validation
  if (!expectedApiKey) {
    next();
    return;
  }

  if (!apiKey) {
    logger.warn('API request without API key', { 
      ip: req.ip, 
      url: req.url 
    });
    
    res.status(401).json({
      success: false,
      error: 'API key is required'
    });
    return;
  }

  if (apiKey !== expectedApiKey) {
    logger.warn('API request with invalid API key', { 
      ip: req.ip, 
      url: req.url,
      providedKey: apiKey
    });
    
    res.status(401).json({
      success: false,
      error: 'Invalid API key'
    });
    return;
  }

  next();
}