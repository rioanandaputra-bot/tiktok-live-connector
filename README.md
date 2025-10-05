# TikTok Live Connector API

A comprehensive Node.js TypeScript API server that connects to TikTok Live streams and forwards **ALL 43+ available events** to external webhooks.

## ✨ Comprehensive Event Coverage

This project implements **ALL 43+ events** available from the TikTok Live Connector library, including:

### Control Events (6)
- `connected` - Stream connection established
- `disconnected` - Stream connection lost  
- `error` - Connection or stream errors
- `streamEnd` - Stream ended by broadcaster
- `rawData` - Raw binary data (debugging)
- `decodedData` - Decoded message data (debugging)

### User Interaction Events (15)
- `chat` - New chat messages
- `gift` - Virtual gifts sent to broadcaster
- `like` - Likes/hearts sent to stream
- `member` - New viewers joining stream
- `follow` - New followers
- `share` - Stream shares
- `social` - Various social interactions
- `emote` - Emote reactions
- `envelope` - Treasure chest/envelope gifts
- `questionNew` - Q&A questions submitted
- `roomUpdate` - Viewer count updates
- `roomMessage` - Room-level messages
- `captionMessage` - Caption/subtitle messages
- `imDelete` - Message deletions

### Battle & Competition Events (7)
- `linkMicBattle` - Live battles between users
- `linkMicArmies` - Battle armies/teams
- `linkMicBattlePunishFinish` - Battle punishment end
- `linkMicBattleTask` - Battle tasks/challenges
- `linkMicFanTicketMethod` - Fan ticket mechanisms
- `linkMicMethod` - Link mic connection methods
- `superFan` - Super fan activities

### Advanced Features (15+)
- `liveIntro` - Stream introduction messages
- `controlMessage` - System control messages
- `barrage` - Barrage/flood messages
- `hourlyRank` - Hourly ranking updates
- `goalUpdate` - Goal progress updates
- `inRoomBanner` - In-room banner displays
- `rankUpdate` - Real-time rank changes
- `pollMessage` - Poll/voting messages
- `rankText` - Rank-related text
- `unauthorizedMember` - Unauthorized access attempts
- `oecLiveShopping` - Live shopping events
- `msgDetect` - Message detection/filtering
- `linkMessage` - Link sharing messages
- `roomVerify` - Room verification events
- `linkLayer` - Link layer interactions
- `roomPin` - Pinned room messages

📚 **Detailed Documentation**: See [EVENTS.md](./docs/EVENTS.md) for complete event schemas and examples.

## 📖 API Documentation

Complete API documentation is available in multiple formats:

### 🌐 Interactive Swagger UI
Access the interactive API documentation at: **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

Features:
- **Interactive Testing**: Test all endpoints directly from the browser
- **Complete Schema Documentation**: Detailed request/response schemas
- **Authentication Testing**: Built-in API key testing
- **Event Type Reference**: Complete list of 43+ supported events
- **Example Requests**: Copy-paste ready curl commands

### 📄 Documentation Files
- **[API Reference](./docs/API.md)** - Complete API documentation with examples
- **[Event Reference](./docs/EVENTS.md)** - Detailed event schemas and payloads
- **[OpenAPI Spec](./docs/openapi.yaml)** - Machine-readable API specification

### 🚀 Quick API Examples

```bash
# Check system status
curl -H "X-API-Key: your_api_key" http://localhost:3000/api/status

# Get recent events
curl -H "X-API-Key: your_api_key" http://localhost:3000/api/events

# Register a webhook
curl -X POST -H "Content-Type: application/json" -H "X-API-Key: your_api_key" \
  -d '{"name":"My Webhook","url":"https://example.com/webhook"}' \
  http://localhost:3000/api/webhooks
```

## Features

- 🎥 Connect to TikTok Live streams using [tiktok-live-connector](https://www.npmjs.com/package/tiktok-live-connector)
- 🔌 Forward live events to multiple webhook endpoints
- 🌐 RESTful API for managing webhooks and monitoring status
- 🔒 API key authentication and rate limiting
- 📝 Comprehensive logging with Winston
- ⚡ Real-time event processing and forwarding
- 🛡️ Security middleware (Helmet, CORS)
- 🔄 Automatic retry logic for failed webhooks

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
NODE_ENV=development
PORT=3000
TIKTOK_USERNAME=your_tiktok_username
WEBHOOK_ENDPOINTS=http://localhost:3000/webhook,https://example.com/webhook
WEBHOOK_SECRET=your_webhook_secret_key
API_KEY=your_api_key
```

### 3. Development

```bash
npm run dev
```

### 4. Production

```bash
npm run build
npm start
```

## API Documentation

### Authentication

Include API key in requests:
- Header: `X-API-Key: your_api_key`
- Query param: `?apiKey=your_api_key`

### Endpoints

#### GET /health
Health check endpoint

#### GET /api/status
Get TikTok connection status and server info

#### GET /api/webhooks
List configured webhook endpoints

#### POST /api/webhooks
Add a new webhook endpoint
```json
{
  "url": "https://example.com/webhook",
  "secret": "optional_secret",
  "headers": {
    "Authorization": "Bearer token"
  }
}
```

#### DELETE /api/webhooks
Remove a webhook endpoint
```json
{
  "url": "https://example.com/webhook"
}
```

#### POST /api/webhooks/test
Test a webhook endpoint
```json
{
  "url": "https://example.com/webhook"
}
```

#### GET /api/events
Get recent TikTok events (for debugging)

## Webhook Events

The API forwards TikTok Live events to configured webhooks:

### Event Structure
```json
{
  "type": "chat|gift|follow|like|member|share|roomUpdate",
  "data": { /* event-specific data */ },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "id": "unique_event_id",
  "source": "tiktok-live-connector",
  "version": "1.0.0",
  "signature": "hmac_signature" // if secret is configured
}
```

### Event Types

#### Chat Event
```json
{
  "type": "chat",
  "data": {
    "username": "user123",
    "message": "Hello!",
    "userId": "12345",
    "profilePictureUrl": "https://..."
  }
}
```

#### Gift Event
```json
{
  "type": "gift",
  "data": {
    "username": "user123",
    "giftName": "Rose",
    "giftId": 5655,
    "repeatCount": 1,
    "cost": 1,
    "userId": "12345"
  }
}
```

#### Follow Event
```json
{
  "type": "follow",
  "data": {
    "username": "user123",
    "userId": "12345"
  }
}
```

## Webhook Receiver

The API includes a webhook receiver for testing:

#### POST /webhook/receive
Receive webhook events (for testing)

#### GET /webhook/health
Webhook service health check

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `TIKTOK_USERNAME` | TikTok username to connect to | Required |
| `WEBHOOK_ENDPOINTS` | Comma-separated webhook URLs | - |
| `WEBHOOK_SECRET` | Secret for webhook signature | - |
| `API_KEY` | API authentication key | - |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `LOG_LEVEL` | Log level (error/warn/info/debug) | info |
| `LOG_FILE` | Log file path | logs/app.log |

## Development

### Scripts

```bash
npm run dev      # Development with auto-reload
npm run build    # Build TypeScript
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run ESLint
npm run clean    # Clean build files
```

### Project Structure

```
src/
├── connector/           # TikTok Live connector
│   └── TikTokConnector.ts
├── webhook/            # Webhook management
│   └── WebhookManager.ts
├── routes/             # API routes
│   ├── api.ts
│   └── webhook.ts
├── middleware/         # Express middleware
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── rateLimiter.ts
├── utils/              # Utilities
│   └── logger.ts
└── index.ts           # Main application
```

## Security

- API key authentication
- Rate limiting per IP
- Webhook signature verification
- CORS and security headers
- Input validation
- Error handling without information leakage

## Logging

Logs are written to:
- Console (with colors in development)
- `logs/app.log` (general logs)
- `logs/error.log` (error logs only)

Log rotation is configured (5MB max, 5 files).

## License

MIT License