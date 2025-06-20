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

class Logger {
  private logs: LogEntry[] = [];
  private users: Map<string, UserData> = new Map();
  private stats = {
    totalRewards: 0,
    activeUsers: 0,
    rewardsToday: 0,
    totalVisits: 0
  };

  constructor() {
    this.loadFromStorage();
    this.startStatsUpdater();
  }

  private loadFromStorage() {
    try {
      const savedLogs = localStorage.getItem('nitrovault_logs');
      const savedUsers = localStorage.getItem('nitrovault_users');
      const savedStats = localStorage.getItem('nitrovault_stats');

      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
      if (savedUsers) {
        const usersArray = JSON.parse(savedUsers);
        this.users = new Map(usersArray);
      }
      if (savedStats) {
        this.stats = JSON.parse(savedStats);
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

  private startStatsUpdater() {
    // Update stats every 30 seconds to simulate growth
    setInterval(() => {
      this.stats.totalRewards += Math.floor(Math.random() * 3);
      this.stats.activeUsers += Math.floor(Math.random() * 5) - 2;
      this.stats.rewardsToday += Math.floor(Math.random() * 2);
      this.stats.activeUsers = Math.max(1, this.stats.activeUsers);
      this.saveToStorage();
    }, 30000);
  }

  logVisit(userId?: string, username?: string, referralCode?: string) {
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
    this.sendDiscordWebhook(logEntry);
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

  private async sendDiscordWebhook(logEntry: LogEntry) {
    const webhookUrl = 'https://discord.com/api/webhooks/1380266104169169088/KTZkxMgNMGaWmLWKeYxtl1ng8hrnV7_cU4qTwiAcoKbl_UdlJdqVPc_75NvwjeOzMnSM';
    
    const user = logEntry.userId ? this.users.get(logEntry.userId) : null;
    
    const embed = {
      title: '🌐 Site Visit',
      color: 0x7c3aed,
      fields: [
        {
          name: 'User',
          value: user ? user.username : 'Anonymous',
          inline: true
        },
        {
          name: 'Visit Count',
          value: user ? user.visitCount.toString() : 'N/A',
          inline: true
        },
        {
          name: 'Referrals',
          value: user ? user.referrals.toString() : 'N/A',
          inline: true
        }
      ],
      timestamp: new Date().toISOString()
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [embed]
        })
      });
    } catch (error) {
      console.error('Discord webhook error:', error);
    }
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
