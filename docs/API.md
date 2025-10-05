# API Documentation - TikTok Live Connector

## 📚 Documentation Access

Dokumentasi API lengkap tersedia dalam beberapa format:

### 🌐 Interactive Swagger UI
- **URL**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- **Features**: 
  - Interactive API testing
  - Complete endpoint documentation
  - Request/response examples
  - Schema definitions
  - Authentication testing

### 📄 OpenAPI Specification Files
- **YAML**: [http://localhost:3001/api/docs/openapi.yaml](http://localhost:3001/api/docs/openapi.yaml)
- **JSON**: [http://localhost:3001/api/docs/openapi.json](http://localhost:3001/api/docs/openapi.json)

## 🔐 Authentication

All API endpoints require API key authentication:

```bash
curl -H "X-API-Key: your_api_key_here" http://localhost:3001/api/status
```

Set your API key in `.env` file:
```env
API_KEY=your_secret_api_key
```

## 🚀 Quick Start Examples

### 1. Check System Status
```bash
curl -H "X-API-Key: your_api_key" \
  http://localhost:3001/api/status
```

### 2. Get Recent Events
```bash
curl -H "X-API-Key: your_api_key" \
  "http://localhost:3001/api/events?limit=10&type=chat"
```

### 3. Register a Webhook
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "name": "My Webhook",
    "url": "https://example.com/webhook",
    "events": ["chat", "gift", "follow"]
  }' \
  http://localhost:3001/api/webhooks
```

### 4. Test a Webhook
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "url": "https://example.com/webhook"
  }' \
  http://localhost:3001/api/webhooks/test
```

## 📡 Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/status` | Get system status and health |
| `GET` | `/api/events` | Retrieve recent TikTok Live events |
| `GET` | `/api/webhooks` | List all webhook endpoints |
| `POST` | `/api/webhooks` | Register a new webhook |
| `DELETE` | `/api/webhooks/{id}` | Delete a webhook |
| `POST` | `/api/webhooks/test` | Test webhook connectivity |

## 🎯 Event Types

The API captures **43+ different event types** from TikTok Live streams:

### Control Events
- `connected`, `disconnected`, `error`, `streamEnd`, `rawData`, `decodedData`

### User Interactions
- `chat`, `gift`, `like`, `member`, `follow`, `share`, `social`, `emote`, `envelope`, `questionNew`, `roomUpdate`, `roomMessage`, `captionMessage`, `imDelete`

### Battles & Competitions
- `linkMicBattle`, `linkMicArmies`, `linkMicBattlePunishFinish`, `linkMicBattleTask`, `linkMicFanTicketMethod`, `linkMicMethod`, `superFan`

### Advanced Features
- `liveIntro`, `controlMessage`, `barrage`, `hourlyRank`, `goalUpdate`, `inRoomBanner`, `rankUpdate`, `pollMessage`, `rankText`, `unauthorizedMember`, `oecLiveShopping`, `msgDetect`, `linkMessage`, `roomVerify`, `linkLayer`, `roomPin`

## 🔄 Webhook Payload Format

When events are forwarded to your webhook, they follow this format:

```json
{
  "event": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "type": "chat",
    "data": {
      "username": "user123",
      "message": "Hello world!",
      "userId": "123456789",
      "profilePictureUrl": "https://...",
      "nickname": "User Display Name"
    },
    "timestamp": "2024-01-01T12:30:00.000Z"
  },
  "webhook": {
    "id": "webhook_id",
    "url": "https://example.com/webhook",
    "name": "My Webhook"
  },
  "signature": "sha256=abc123...", // If secret is configured
  "timestamp": "2024-01-01T12:30:00.000Z"
}
```

## 🛡️ Security Features

### API Key Authentication
- All endpoints protected with API key
- Configure in `.env` file
- Pass as `X-API-Key` header

### Webhook Signature Verification
- Optional HMAC-SHA256 signatures
- Verify payload integrity
- Configure secret per webhook

### Rate Limiting
- Built-in rate limiting
- Configurable per endpoint
- Prevents API abuse

## 📊 Response Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `409` | Conflict |
| `500` | Internal Server Error |

## 🔍 Error Response Format

```json
{
  "error": "Bad Request",
  "message": "Invalid JSON payload",
  "code": "INVALID_JSON",
  "timestamp": "2024-01-01T12:30:00.000Z"
}
```

## 📝 Event Filtering

Filter events by type when retrieving or setting up webhooks:

```bash
# Get only chat events
curl -H "X-API-Key: your_api_key" \
  "http://localhost:3001/api/events?type=chat"

# Webhook for specific events only
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "name": "Chat Only Webhook",
    "url": "https://example.com/webhook",
    "events": ["chat", "gift"]
  }' \
  http://localhost:3001/api/webhooks
```

## 🔄 Retry Logic

Webhooks include automatic retry logic:
- **Default retries**: 3 attempts
- **Backoff strategy**: Exponential (1s, 2s, 4s)
- **Timeout**: 5 seconds per request
- **Configurable**: Per webhook settings

## 🚦 Health Monitoring

Use the status endpoint to monitor system health:

```bash
curl -H "X-API-Key: your_api_key" \
  http://localhost:3001/api/status
```

Returns detailed information about:
- TikTok connection status
- Server uptime and resources
- Webhook statistics
- Event processing metrics

## 📖 Complete Documentation

For complete API documentation with interactive testing, visit:
**[http://localhost:3001/api/docs](http://localhost:3001/api/docs)**

---

**Note**: Replace `localhost:3001` with your actual server URL in production.