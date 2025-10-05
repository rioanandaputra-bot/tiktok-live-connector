# TikTok Live Connector - Implemented Events

Dokumentasi lengkap semua event yang telah diimplementasikan dalam TikTok Live Connector API.

## Control Events

Event-event yang mengontrol koneksi dan status stream:

### 1. `connected`
Dipanggil ketika berhasil terhubung ke TikTok Live stream.
```json
{
  "type": "connected",
  "data": {
    "username": "username_streamer",
    "roomId": "room_id"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 2. `disconnected`
Dipanggil ketika terputus dari TikTok Live stream.
```json
{
  "type": "disconnected",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 3. `error`
Dipanggil ketika terjadi error pada koneksi.
```json
{
  "type": "error",
  "data": {
    "error": "Error message"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 4. `streamEnd`
Dipanggil ketika stream berakhir.
```json
{
  "type": "streamEnd",
  "data": {
    "action": "stream_end_action"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 5. `rawData`
Event debugging untuk data mentah (opsional).
```json
{
  "type": "rawData",
  "data": {
    "messageTypeName": "message_type",
    "binary": "binary_data"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 6. `decodedData`
Event debugging untuk data yang sudah di-decode (opsional).
```json
{
  "type": "decodedData",
  "data": {
    "event": "event_name",
    "decodedData": {},
    "binary": "binary_data"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

## Message Events

Event-event yang berkaitan dengan interaksi pengguna:

### 7. `chat`
Dipanggil ketika ada pesan chat baru.
```json
{
  "type": "chat",
  "data": {
    "username": "user123",
    "message": "Hello world!",
    "userId": "123456789",
    "profilePictureUrl": "https://...",
    "nickname": "User Display Name"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 8. `gift`
Dipanggil ketika ada gift yang dikirim.
```json
{
  "type": "gift",
  "data": {
    "username": "user123",
    "giftName": "Rose",
    "giftId": 5655,
    "repeatCount": 1,
    "repeatEnd": true,
    "giftType": 1,
    "cost": 1,
    "userId": "123456789",
    "nickname": "User Display Name"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 9. `like`
Dipanggil ketika ada like yang dikirim.
```json
{
  "type": "like",
  "data": {
    "username": "user123",
    "likeCount": 5,
    "totalLikeCount": 12345,
    "userId": "123456789",
    "nickname": "User Display Name"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 10. `member`
Dipanggil ketika ada member baru yang bergabung.
```json
{
  "type": "member",
  "data": {
    "username": "user123",
    "userId": "123456789",
    "nickname": "User Display Name",
    "profilePictureUrl": "https://..."
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 11. `roomUpdate`
Dipanggil ketika ada update room (jumlah viewer).
```json
{
  "type": "roomUpdate",
  "data": {
    "viewerCount": 1234,
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 12. `social`
Dipanggil untuk berbagai aksi sosial (follow, share, dll).
```json
{
  "type": "social",
  "data": {
    "username": "user123",
    "userId": "123456789",
    "displayType": "pm_main_follow_message_viewer_2",
    "action": "follow"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 13. `follow`
Dipanggil ketika ada follower baru.
```json
{
  "type": "follow",
  "data": {
    "username": "user123",
    "userId": "123456789",
    "nickname": "User Display Name"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 14. `share`
Dipanggil ketika stream di-share.
```json
{
  "type": "share",
  "data": {
    "username": "user123",
    "userId": "123456789",
    "nickname": "User Display Name"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 15. `emote`
Dipanggil ketika ada emote yang dikirim.
```json
{
  "type": "emote",
  "data": {
    "username": "user123",
    "userId": "123456789",
    "emoteId": "emote_id",
    "emoteName": "emote_name"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 16. `envelope`
Dipanggil ketika ada treasure chest/envelope.
```json
{
  "type": "envelope",
  "data": {
    "username": "user123",
    "userId": "123456789",
    "coins": 100
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 17. `questionNew`
Dipanggil ketika ada pertanyaan baru.
```json
{
  "type": "questionNew",
  "data": {
    "username": "user123",
    "userId": "123456789",
    "questionText": "What's your favorite color?"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

## Battle Events

Event-event yang berkaitan dengan battle/pertarungan:

### 18. `linkMicBattle`
Dipanggil ketika ada battle antara dua user.
```json
{
  "type": "linkMicBattle",
  "data": {
    "battleUsers": [
      {"uniqueId": "user1", "userId": "123"},
      {"uniqueId": "user2", "userId": "456"}
    ],
    "status": "battle_status"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 19. `linkMicArmies`
Dipanggil untuk event link mic armies.
```json
{
  "type": "linkMicArmies",
  "data": {
    "battleInfo": {},
    "army": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 20. `linkMicBattlePunishFinish`
Dipanggil ketika battle punishment selesai.
```json
{
  "type": "linkMicBattlePunishFinish",
  "data": {
    "battleData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 21. `linkMicBattleTask`
Dipanggil untuk battle task events.
```json
{
  "type": "linkMicBattleTask",
  "data": {
    "taskData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 22. `linkMicFanTicketMethod`
Dipanggil untuk fan ticket method events.
```json
{
  "type": "linkMicFanTicketMethod",
  "data": {
    "ticketData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 23. `linkMicMethod`
Dipanggil untuk link mic method events.
```json
{
  "type": "linkMicMethod",
  "data": {
    "methodData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

## Special Events

### 24. `liveIntro`
Dipanggil untuk live intro message.
```json
{
  "type": "liveIntro",
  "data": {
    "id": "intro_id",
    "description": "intro_description"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 25. `controlMessage`
Dipanggil untuk control message events.
```json
{
  "type": "controlMessage",
  "data": {
    "action": "control_action"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 26. `barrage`
Dipanggil untuk barrage message events.
```json
{
  "type": "barrage",
  "data": {
    "message": "barrage_message",
    "user": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 27. `hourlyRank`
Dipanggil untuk hourly rank updates.
```json
{
  "type": "hourlyRank",
  "data": {
    "rankData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 28. `goalUpdate`
Dipanggil ketika ada update goal.
```json
{
  "type": "goalUpdate",
  "data": {
    "goalId": "goal_id",
    "progress": 50,
    "target": 100
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 29. `roomMessage`
Dipanggil untuk room message events.
```json
{
  "type": "roomMessage",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 30. `captionMessage`
Dipanggil untuk caption message events.
```json
{
  "type": "captionMessage",
  "data": {
    "text": "caption_text",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 31. `imDelete`
Dipanggil ketika pesan dihapus.
```json
{
  "type": "imDelete",
  "data": {
    "messageId": "message_id"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 32. `inRoomBanner`
Dipanggil untuk in room banner events.
```json
{
  "type": "inRoomBanner",
  "data": {
    "data": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 33. `rankUpdate`
Dipanggil untuk rank update events.
```json
{
  "type": "rankUpdate",
  "data": {
    "rankData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 34. `pollMessage`
Dipanggil untuk poll message events.
```json
{
  "type": "pollMessage",
  "data": {
    "pollData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 35. `rankText`
Dipanggil untuk rank text events.
```json
{
  "type": "rankText",
  "data": {
    "text": "rank_text"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 36. `unauthorizedMember`
Dipanggil untuk unauthorized member events.
```json
{
  "type": "unauthorizedMember",
  "data": {
    "memberData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 37. `oecLiveShopping`
Dipanggil untuk live shopping events.
```json
{
  "type": "oecLiveShopping",
  "data": {
    "shoppingData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 38. `msgDetect`
Dipanggil untuk message detection events.
```json
{
  "type": "msgDetect",
  "data": {
    "detectionData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 39. `linkMessage`
Dipanggil untuk link message events.
```json
{
  "type": "linkMessage",
  "data": {
    "linkData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 40. `roomVerify`
Dipanggil untuk room verify events.
```json
{
  "type": "roomVerify",
  "data": {
    "verifyData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 41. `linkLayer`
Dipanggil untuk link layer events.
```json
{
  "type": "linkLayer",
  "data": {
    "layerData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 42. `roomPin`
Dipanggil untuk room pin events.
```json
{
  "type": "roomPin",
  "data": {
    "pinData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

### 43. `superFan`
Dipanggil untuk super fan events.
```json
{
  "type": "superFan",
  "data": {
    "fanData": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "id": "uuid"
}
```

## Event Forwarding

Semua event di atas akan diteruskan ke webhook endpoint yang dikonfigurasi dengan format:

```json
{
  "event": {
    "type": "event_type",
    "data": {},
    "timestamp": "2024-01-01T00:00:00.000Z",
    "id": "uuid"
  },
  "webhook": {
    "id": "webhook_id",
    "url": "https://example.com/webhook",
    "name": "webhook_name"
  }
}
```

## API Endpoints

- `GET /api/events` - Mendapatkan daftar event yang tersimpan
- `GET /api/status` - Status koneksi TikTok Live
- `GET /api/webhooks` - Daftar webhook yang terdaftar
- `POST /api/webhooks` - Mendaftarkan webhook baru
- `DELETE /api/webhooks/:id` - Menghapus webhook

## Konfigurasi

Gunakan file `.env` untuk mengatur:
- `TIKTOK_USERNAME` - Username streamer yang akan dimonitor
- `API_KEY` - API key untuk autentikasi
- `WEBHOOK_URL` - URL webhook default
- `WEBHOOK_SECRET` - Secret untuk signature verification