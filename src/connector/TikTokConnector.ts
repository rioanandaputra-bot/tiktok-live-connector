import { TikTokLiveConnection, WebcastEvent, ControlEvent } from 'tiktok-live-connector';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger';

export interface TikTokEvent {
  type: string;
  data: any;
  timestamp: string;
  id: string;
}

export class TikTokLiveConnector extends EventEmitter {
  private connection: TikTokLiveConnection | null = null;
  private username: string;
  private isConnected: boolean = false;

  constructor() {
    super();
    this.username = process.env.TIKTOK_USERNAME || '';
    
    if (!this.username) {
      throw new Error('TIKTOK_USERNAME environment variable is required');
    }
  }

  async connect(): Promise<void> {
    try {
      this.connection = new TikTokLiveConnection(this.username);

      // Control events
      this.connection.on(ControlEvent.CONNECTED, (state) => {
        this.isConnected = true;
        logger.info(`Connected to TikTok Live: @${this.username}`);
        this.emitEvent('connected', { username: this.username, roomId: state.roomId });
      });

      this.connection.on(ControlEvent.DISCONNECTED, () => {
        this.isConnected = false;
        logger.info('Disconnected from TikTok Live');
        this.emitEvent('disconnected', {});
      });

      this.connection.on(ControlEvent.ERROR, (error: any) => {
        logger.error('TikTok connection error:', error);
        this.emitEvent('error', { error: error.message });
      });

      this.connection.on(WebcastEvent.STREAM_END, (data: any) => {
        logger.info('Stream ended');
        this.emitEvent('streamEnd', { action: data.action });
      });

      // Chat events
      this.connection.on(WebcastEvent.CHAT, (data: any) => {
        logger.info(`Chat: ${data.user.uniqueId}: ${data.comment}`);
        this.emitEvent('chat', {
          username: data.user.uniqueId,
          message: data.comment,
          userId: data.user.userId,
          profilePictureUrl: data.user.profilePictureUrl,
          nickname: data.user.nickname
        });
      });

      // Gift events
      this.connection.on(WebcastEvent.GIFT, (data: any) => {
        if (data.giftType === 1 && !data.repeatEnd) {
          logger.info(`Gift: ${data.user.uniqueId} is sending ${data.giftName} x${data.repeatCount}`);
        } else {
          logger.info(`Gift: ${data.user.uniqueId} sent ${data.giftName} x${data.repeatCount}`);
        }
        this.emitEvent('gift', {
          username: data.user.uniqueId,
          giftName: data.giftName,
          giftId: data.giftId,
          repeatCount: data.repeatCount,
          repeatEnd: data.repeatEnd,
          giftType: data.giftType,
          cost: data.diamondCount,
          userId: data.user.userId,
          nickname: data.user.nickname
        });
      });

      // Like events
      this.connection.on(WebcastEvent.LIKE, (data: any) => {
        logger.info(`Like: ${data.user.uniqueId} sent ${data.likeCount} likes, total: ${data.totalLikeCount}`);
        this.emitEvent('like', {
          username: data.user.uniqueId,
          likeCount: data.likeCount,
          totalLikeCount: data.totalLikeCount,
          userId: data.user.userId,
          nickname: data.user.nickname
        });
      });

      // Member events
      this.connection.on(WebcastEvent.MEMBER, (data: any) => {
        logger.info(`Member joined: ${data.user.uniqueId}`);
        this.emitEvent('member', {
          username: data.user.uniqueId,
          userId: data.user.userId,
          nickname: data.user.nickname,
          profilePictureUrl: data.user.profilePictureUrl
        });
      });

      // Room user events (viewer count)
      this.connection.on(WebcastEvent.ROOM_USER, (data: any) => {
        logger.info(`Room update: ${data.viewerCount} viewers`);
        this.emitEvent('roomUpdate', {
          viewerCount: data.viewerCount,
          timestamp: new Date().toISOString()
        });
      });

      // Social events (follow/share)
      this.connection.on(WebcastEvent.SOCIAL, (data: any) => {
        logger.info('Social event:', data);
        this.emitEvent('social', {
          username: data.user?.uniqueId || 'unknown',
          userId: data.user?.userId,
          displayType: data.displayType,
          action: data.action
        });
      });

      // Follow events (custom event from social)
      this.connection.on(WebcastEvent.FOLLOW, (data: any) => {
        logger.info(`New follower: ${data.user.uniqueId}`);
        this.emitEvent('follow', {
          username: data.user.uniqueId,
          userId: data.user.userId,
          nickname: data.user.nickname
        });
      });

      // Share events (custom event from social)
      this.connection.on(WebcastEvent.SHARE, (data: any) => {
        logger.info(`Share: ${data.user.uniqueId} shared the stream`);
        this.emitEvent('share', {
          username: data.user.uniqueId,
          userId: data.user.userId,
          nickname: data.user.nickname
        });
      });

      // Emote events
      this.connection.on(WebcastEvent.EMOTE, (data: any) => {
        logger.info(`Emote: ${data.user.uniqueId} sent an emote`);
        this.emitEvent('emote', {
          username: data.user.uniqueId,
          userId: data.user.userId,
          emoteId: data.emoteId,
          emoteName: data.emoteName
        });
      });

      // Envelope events (treasure chest)
      this.connection.on(WebcastEvent.ENVELOPE, (data: any) => {
        logger.info(`Envelope: ${data.user.uniqueId} sent a treasure chest`);
        this.emitEvent('envelope', {
          username: data.user.uniqueId,
          userId: data.user.userId,
          coins: data.coins
        });
      });

      // Question events
      this.connection.on(WebcastEvent.QUESTION_NEW, (data: any) => {
        logger.info(`Question: ${data.user.uniqueId} asks ${data.text}`);
        this.emitEvent('questionNew', {
          username: data.user.uniqueId,
          userId: data.user.userId,
          questionText: data.text
        });
      });

      // Link mic battle events
      this.connection.on(WebcastEvent.LINK_MIC_BATTLE, (data: any) => {
        logger.info(`Battle: ${data.battleUsers[0]?.uniqueId} VS ${data.battleUsers[1]?.uniqueId}`);
        this.emitEvent('linkMicBattle', {
          battleUsers: data.battleUsers,
          status: data.status
        });
      });

      // Link mic armies events
      this.connection.on(WebcastEvent.LINK_MIC_ARMIES, (data: any) => {
        logger.info('Link mic armies event');
        this.emitEvent('linkMicArmies', {
          battleInfo: data.battleInfo,
          army: data.army
        });
      });

      // Live intro events
      this.connection.on(WebcastEvent.LIVE_INTRO, (data: any) => {
        logger.info('Live intro message');
        this.emitEvent('liveIntro', {
          id: data.id,
          description: data.description
        });
      });

      // Control message events
      this.connection.on(WebcastEvent.CONTROL_MESSAGE, (data: any) => {
        logger.info('Control message');
        this.emitEvent('controlMessage', {
          action: data.action
        });
      });

      // Barrage events
      this.connection.on(WebcastEvent.BARRAGE, (data: any) => {
        logger.info('Barrage message');
        this.emitEvent('barrage', {
          message: data.message,
          user: data.user
        });
      });

      // Hourly rank events
      this.connection.on(WebcastEvent.HOURLY_RANK, (data: any) => {
        logger.info('Hourly rank update');
        this.emitEvent('hourlyRank', {
          rankData: data
        });
      });

      // Goal update events
      this.connection.on(WebcastEvent.GOAL_UPDATE, (data: any) => {
        logger.info('Goal update');
        this.emitEvent('goalUpdate', {
          goalId: data.goalId,
          progress: data.progress,
          target: data.target
        });
      });

      // Room message events
      this.connection.on(WebcastEvent.ROOM_MESSAGE, (data: any) => {
        logger.info('Room message');
        this.emitEvent('roomMessage', data);
      });

      // Caption message events
      this.connection.on(WebcastEvent.CAPTION_MESSAGE, (data: any) => {
        logger.info('Caption message');
        this.emitEvent('captionMessage', {
          text: data.text,
          timestamp: data.timestamp
        });
      });

      // IM delete events
      this.connection.on(WebcastEvent.IM_DELETE, (data: any) => {
        logger.info('Message deleted');
        this.emitEvent('imDelete', {
          messageId: data.messageId
        });
      });

      // In room banner events
      this.connection.on(WebcastEvent.IN_ROOM_BANNER, (data: any) => {
        logger.info('In room banner');
        this.emitEvent('inRoomBanner', {
          data: data
        });
      });

      // Rank update events
      this.connection.on(WebcastEvent.RANK_UPDATE, (data: any) => {
        logger.info('Rank update');
        this.emitEvent('rankUpdate', {
          rankData: data
        });
      });

      // Poll message events
      this.connection.on(WebcastEvent.POLL_MESSAGE, (data: any) => {
        logger.info('Poll message');
        this.emitEvent('pollMessage', {
          pollData: data
        });
      });

      // Rank text events
      this.connection.on(WebcastEvent.RANK_TEXT, (data: any) => {
        logger.info('Rank text');
        this.emitEvent('rankText', {
          text: data.text
        });
      });

      // Link message events
      this.connection.on(WebcastEvent.LINK_MESSAGE, (data: any) => {
        logger.info('Link message');
        this.emitEvent('linkMessage', {
          linkData: data
        });
      });

      // Room verify events
      this.connection.on(WebcastEvent.ROOM_VERIFY, (data: any) => {
        logger.info('Room verify');
        this.emitEvent('roomVerify', {
          verifyData: data
        });
      });

      // Link layer events
      this.connection.on(WebcastEvent.LINK_LAYER, (data: any) => {
        logger.info('Link layer');
        this.emitEvent('linkLayer', {
          layerData: data
        });
      });

      // Room pin events
      this.connection.on(WebcastEvent.ROOM_PIN, (data: any) => {
        logger.info('Room pin');
        this.emitEvent('roomPin', {
          pinData: data
        });
      });

      // Additional battle events
      this.connection.on(WebcastEvent.LINK_MIC_BATTLE_PUNISH_FINISH, (data: any) => {
        logger.info('Link mic battle punish finish');
        this.emitEvent('linkMicBattlePunishFinish', {
          battleData: data
        });
      });

      this.connection.on(WebcastEvent.LINK_MIC_BATTLE_TASK, (data: any) => {
        logger.info('Link mic battle task');
        this.emitEvent('linkMicBattleTask', {
          taskData: data
        });
      });

      this.connection.on(WebcastEvent.LINK_MIC_FAN_TICKET_METHOD, (data: any) => {
        logger.info('Link mic fan ticket method');
        this.emitEvent('linkMicFanTicketMethod', {
          ticketData: data
        });
      });

      this.connection.on(WebcastEvent.LINK_MIC_METHOD, (data: any) => {
        logger.info('Link mic method');
        this.emitEvent('linkMicMethod', {
          methodData: data
        });
      });

      // Unauthorized member events
      this.connection.on(WebcastEvent.UNAUTHORIZED_MEMBER, (data: any) => {
        logger.info('Unauthorized member');
        this.emitEvent('unauthorizedMember', {
          memberData: data
        });
      });

      // Live shopping events
      this.connection.on(WebcastEvent.OEC_LIVE_SHOPPING, (data: any) => {
        logger.info('Live shopping event');
        this.emitEvent('oecLiveShopping', {
          shoppingData: data
        });
      });

      // Message detection events
      this.connection.on(WebcastEvent.MSG_DETECT, (data: any) => {
        logger.info('Message detection');
        this.emitEvent('msgDetect', {
          detectionData: data
        });
      });

      // Super fan events
      this.connection.on(WebcastEvent.SUPER_FAN, (data: any) => {
        logger.info('Super fan event');
        this.emitEvent('superFan', {
          fanData: data
        });
      });

      // Raw data events (for debugging)
      this.connection.on(ControlEvent.RAW_DATA, (messageTypeName: string, binary: any) => {
        logger.debug('Raw data:', messageTypeName);
        this.emitEvent('rawData', {
          messageTypeName,
          binary
        });
      });

      // Decoded data events (for debugging)
      this.connection.on(ControlEvent.DECODED_DATA, (event: string, decodedData: any, binary: any) => {
        logger.debug('Decoded data:', event);
        this.emitEvent('decodedData', {
          event,
          decodedData,
          binary
        });
      });

      await this.connection.connect();
    } catch (error) {
      logger.error('Failed to connect to TikTok Live:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.disconnect();
      this.connection = null;
      this.isConnected = false;
      logger.info('TikTok connection closed');
    }
  }

  private emitEvent(type: string, data: any): void {
    const event: TikTokEvent = {
      type,
      data,
      timestamp: new Date().toISOString(),
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    this.emit('data', event);
  }

  getConnectionStatus(): { connected: boolean; username: string } {
    return {
      connected: this.isConnected,
      username: this.username
    };
  }
}