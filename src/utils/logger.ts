interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'visit' | 'reward_claim' | 'referral' | 'verification';
  userId?: string;
  username?: string;
  data: any;
}

interface UserData {
  id: string;
  username: string;
  visitCount: number;
  referrals: number;
  rewardsClaimed: number;
  lastVisit: Date;
  referralCode: string;
  lastWebhookSent?: Date;
}

interface RateLimitData {
  ip: string;
  visits: number;
  lastVisit: number;
  blocked: boolean;
  blockExpiry?: number;
}

class Logger {
  private logs: LogEntry[] = [];
  private users: Map<string, UserData> = new Map();
  private rateLimits: Map<string, RateLimitData> = new Map();
  private currentUserId: string | null = null;
  private stats = {
    totalRewards: 15000,
    activeUsers: 1200,
    rewardsToday: 350,
    totalVisits: 0
  };

  constructor() {
    this.loadFromStorage();
    this.initializeUser();
    this.startStatsUpdater();
    this.cleanupExpiredBlocks();
  }

  private initializeUser() {
    // Get or create a persistent user ID
    let userId = localStorage.getItem('nitrovault_user_id');
    if (!userId) {
      userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('nitrovault_user_id', userId);
    }
    this.currentUserId = userId;

    // Create user data if doesn't exist
    if (!this.users.has(userId)) {
      const userData: UserData = {
        id: userId,
        username: 'User' + Math.random().toString(36).substr(2, 4).toUpperCase(),
        visitCount: 0,
        referrals: 0,
        rewardsClaimed: 0,
        lastVisit: new Date(),
        referralCode: this.generateReferralCode()
      };
      this.users.set(userId, userData);
      this.saveToStorage();
    }
  }

  private getClientIP(): string {
    const userAgent = navigator.userAgent;
    const screen = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return btoa(userAgent + screen + timezone).substring(0, 16);
  }

  private isRateLimited(): boolean {
    const clientIP = this.getClientIP();
    const now = Date.now();
    const rateLimit = this.rateLimits.get(clientIP);

    if (rateLimit && rateLimit.blocked && rateLimit.blockExpiry && now < rateLimit.blockExpiry) {
      console.warn('Rate limited: Too many requests. Please wait before refreshing.');
      return true;
    }

    if (!rateLimit) {
      this.rateLimits.set(clientIP, {
        ip: clientIP,
        visits: 1,
        lastVisit: now,
        blocked: false
      });
      return false;
    }

    if (now - rateLimit.lastVisit < 60000) {
      rateLimit.visits++;
      if (rateLimit.visits > 10) {
        rateLimit.blocked = true;
        rateLimit.blockExpiry = now + 300000;
        console.warn('Rate limit exceeded. Access blocked for 5 minutes.');
        this.saveRateLimits();
        return true;
      }
    } else {
      rateLimit.visits = 1;
    }

    rateLimit.lastVisit = now;
    this.saveRateLimits();
    return false;
  }

  private shouldSendWebhook(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return true;

    const now = new Date();
    if (!user.lastWebhookSent) return true;

    // Only send webhook if more than 1 hour has passed
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    return user.lastWebhookSent < hourAgo;
  }

  private sendWebhookNotification(message: string, userId: string) {
    if (!this.shouldSendWebhook(userId)) {
      console.log('Webhook rate limited - less than 1 hour since last notification');
      return;
    }

    // Update last webhook sent time
    const user = this.users.get(userId);
    if (user) {
      user.lastWebhookSent = new Date();
      this.users.set(userId, user);
      this.saveToStorage();
    }

    console.log('Webhook notification (simulated):', message);
    // In a real implementation, this would send to your webhook URL
  }

  private cleanupExpiredBlocks() {
    const now = Date.now();
    for (const [ip, rateLimit] of this.rateLimits.entries()) {
      if (rateLimit.blocked && rateLimit.blockExpiry && now >= rateLimit.blockExpiry) {
        rateLimit.blocked = false;
        rateLimit.blockExpiry = undefined;
        rateLimit.visits = 0;
      }
    }
    this.saveRateLimits();
  }

  private loadFromStorage() {
    try {
      const savedLogs = localStorage.getItem('nitrovault_logs');
      const savedUsers = localStorage.getItem('nitrovault_users');
      const savedStats = localStorage.getItem('nitrovault_stats');
      const savedRateLimits = localStorage.getItem('nitrovault_rate_limits');

      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
      if (savedUsers) {
        const usersArray = JSON.parse(savedUsers);
        this.users = new Map(usersArray);
      }
      if (savedStats) {
        const loadedStats = JSON.parse(savedStats);
        // Ensure stats never go below baseline
        this.stats = {
          totalRewards: Math.max(15000, loadedStats.totalRewards || 15000),
          activeUsers: Math.max(1200, loadedStats.activeUsers || 1200),
          rewardsToday: Math.max(350, loadedStats.rewardsToday || 350),
          totalVisits: loadedStats.totalVisits || 0
        };
      }
      if (savedRateLimits) {
        const rateLimitsArray = JSON.parse(savedRateLimits);
        this.rateLimits = new Map(rateLimitsArray);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('nitrovault_logs', JSON.stringify(this.logs));
      localStorage.setItem('nitrovault_users', JSON.stringify(Array.from(this.users.entries())));
      localStorage.setItem('nitrovault_stats', JSON.stringify(this.stats));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private saveRateLimits() {
    try {
      localStorage.setItem('nitrovault_rate_limits', JSON.stringify(Array.from(this.rateLimits.entries())));
    } catch (error) {
      console.error('Error saving rate limits:', error);
    }
  }

  private startStatsUpdater() {
    // Update stats every 30 seconds to simulate growth, ensuring they never decrease
    setInterval(() => {
      const increment = Math.floor(Math.random() * 3) + 1; // Always add at least 1
      this.stats.totalRewards += increment;
      this.stats.activeUsers += Math.floor(Math.random() * 5) - 1; // Can fluctuate slightly
      this.stats.rewardsToday += Math.floor(Math.random() * 2) + 1; // Always add at least 1
      
      // Ensure minimums are maintained
      this.stats.activeUsers = Math.max(1200, this.stats.activeUsers);
      this.saveToStorage();
    }, 30000);
  }

  logVisit(referralCode?: string) {
    if (this.isRateLimited()) {
      return;
    }

    if (!this.currentUserId) return;

    const user = this.users.get(this.currentUserId);
    if (!user) return;

    const logEntry: LogEntry = {
      id: `visit-${Date.now()}`,
      timestamp: new Date(),
      type: 'visit',
      userId: this.currentUserId,
      username: user.username,
      data: { referralCode }
    };

    this.logs.push(logEntry);
    this.stats.totalVisits++;

    user.visitCount++;
    user.lastVisit = new Date();
    this.users.set(this.currentUserId, user);

    // Handle referral if provided and different from user's own code
    if (referralCode && referralCode !== user.referralCode) {
      this.handleReferral(referralCode, this.currentUserId, user.username);
    }

    // Send webhook notification with rate limiting
    const message = `New visit from ${user.username} (${user.visitCount} total visits)`;
    this.sendWebhookNotification(message, this.currentUserId);

    this.saveToStorage();
    console.log('Visit logged:', logEntry);
  }

  private generateReferralCode(): string {
    return 'NV' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  private handleReferral(referralCode: string, newUserId: string, newUsername: string) {
    // Find the referrer by their referral code
    for (const [userId, user] of this.users.entries()) {
      if (user.referralCode === referralCode && userId !== newUserId) {
        user.referrals++;
        this.users.set(userId, user);
        
        // Update referral data in localStorage for the referrer
        this.updateReferralRewards(userId, user.referrals);
        
        // Log successful referral
        const referralLogEntry: LogEntry = {
          id: `referral-${Date.now()}`,
          timestamp: new Date(),
          type: 'referral',
          userId: newUserId,
          username: newUsername,
          data: { 
            referrerUserId: userId,
            referrerUsername: user.username,
            referralCode 
          }
        };
        this.logs.push(referralLogEntry);

        // Send webhook for successful referral
        const message = `🎉 New referral! ${newUsername} joined using ${user.username}'s code. ${user.username} now has ${user.referrals} referrals.`;
        this.sendWebhookNotification(message, userId);

        console.log('Referral logged:', referralLogEntry);
        break;
      }
    }
  }

  private updateReferralRewards(userId: string, referralCount: number) {
    const referralData = JSON.parse(localStorage.getItem('nitrovault_referral_data') || '{}');
    
    const rewardTiers = [1, 3, 5, 10, 25];
    const rewardValues = [10, 30, 50, 100, 250];
    
    let totalRewards = 0;
    let totalValue = 0;
    
    rewardTiers.forEach((tier, index) => {
      if (referralCount >= tier) {
        totalRewards++;
        totalValue += rewardValues[index];
      }
    });
    
    const updatedData = {
      ...referralData,
      referrals: referralCount,
      rewards: totalRewards,
      totalEarned: totalValue
    };
    
    localStorage.setItem('nitrovault_referral_data', JSON.stringify(updatedData));
  }

  getCurrentUser(): UserData | null {
    return this.currentUserId ? this.users.get(this.currentUserId) || null : null;
  }

  getCurrentUserReferralCode(): string {
    const user = this.getCurrentUser();
    return user ? user.referralCode : '';
  }

  getReferralLink(): string {
    const user = this.getCurrentUser();
    return user ? `${window.location.origin}?ref=${user.referralCode}` : '';
  }

  getStats() {
    return { ...this.stats };
  }

  getUserData(userId: string): UserData | undefined {
    return this.users.get(userId);
  }

  getReferralStats(referralCode: string) {
    for (const [userId, user] of this.users.entries()) {
      if (user.referralCode === referralCode) {
        return {
          referrals: user.referrals,
          username: user.username
        };
      }
    }
    return null;
  }
}

export const logger = new Logger();
