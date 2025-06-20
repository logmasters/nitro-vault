
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
  private stats = {
    totalRewards: 15000,  // Start with higher baseline
    activeUsers: 1200,    // Start with higher baseline
    rewardsToday: 350,    // Start with higher baseline
    totalVisits: 0
  };

  constructor() {
    this.loadFromStorage();
    this.startStatsUpdater();
    this.cleanupExpiredBlocks();
  }

  private getClientIP(): string {
    // Simple client fingerprinting for rate limiting
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

    // Check if within 1 minute window
    if (now - rateLimit.lastVisit < 60000) {
      rateLimit.visits++;
      if (rateLimit.visits > 10) { // More than 10 visits per minute
        rateLimit.blocked = true;
        rateLimit.blockExpiry = now + 300000; // Block for 5 minutes
        console.warn('Rate limit exceeded. Access blocked for 5 minutes.');
        this.saveRateLimits();
        return true;
      }
    } else {
      // Reset counter after 1 minute
      rateLimit.visits = 1;
    }

    rateLimit.lastVisit = now;
    this.saveRateLimits();
    return false;
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

  logVisit(userId?: string, username?: string, referralCode?: string) {
    // Check rate limiting first
    if (this.isRateLimited()) {
      return; // Don't log if rate limited
    }

    const logEntry: LogEntry = {
      id: `visit-${Date.now()}`,
      timestamp: new Date(),
      type: 'visit',
      userId,
      username,
      data: { referralCode }
    };

    this.logs.push(logEntry);
    this.stats.totalVisits++;

    if (userId && username) {
      const user = this.users.get(userId) || {
        id: userId,
        username,
        visitCount: 0,
        referrals: 0,
        rewardsClaimed: 0,
        lastVisit: new Date(),
        referralCode: this.generateReferralCode()
      };

      user.visitCount++;
      user.lastVisit = new Date();
      this.users.set(userId, user);

      // Handle referral with rewards
      if (referralCode && referralCode !== user.referralCode) {
        this.handleReferral(referralCode, userId, username);
      }
    }

    this.saveToStorage();
    console.log('Visit logged:', logEntry);
  }

  private generateReferralCode(): string {
    return 'NV' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  private handleReferral(referralCode: string, newUserId: string, newUsername: string) {
    // Find the referrer
    for (const [userId, user] of this.users.entries()) {
      if (user.referralCode === referralCode) {
        user.referrals++;
        this.users.set(userId, user);
        
        // Update referral data in localStorage
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
        console.log('Referral logged:', referralLogEntry);
        break;
      }
    }
  }

  private updateReferralRewards(userId: string, referralCount: number) {
    const referralData = JSON.parse(localStorage.getItem('nitrovault_referral_data') || '{}');
    
    // Calculate rewards based on referral count
    const rewardTiers = [1, 3, 5, 10, 25];
    const rewardValues = [10, 30, 50, 100, 250]; // Dollar values
    
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

  getStats() {
    return { ...this.stats };
  }

  getUserData(userId: string): UserData | undefined {
    return this.users.get(userId);
  }

  getReferralLink(userId: string): string {
    const user = this.users.get(userId);
    return user ? `${window.location.origin}?ref=${user.referralCode}` : '';
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
