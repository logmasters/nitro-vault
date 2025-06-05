
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Zap } from "lucide-react";

interface RewardClaim {
  id: string;
  username: string;
  reward: string;
  type: 'nitro' | 'robux';
  timestamp: Date;
}

export const LiveRewardFeed = () => {
  const [claims, setClaims] = useState<RewardClaim[]>([]);

  // Simulate live feed with random claims
  useEffect(() => {
    const rewardTypes = [
      { reward: "Discord Nitro Classic (1 Month)", type: 'nitro' as const },
      { reward: "800 Robux", type: 'robux' as const },
      { reward: "1000 Robux", type: 'robux' as const },
      { reward: "Discord Nitro Boost (1 Month)", type: 'nitro' as const },
      { reward: "2000 Robux", type: 'robux' as const },
    ];

    const usernames = [
      "GamerPro123", "NoobSlayer", "DiscordFan", "RobloxMaster", "Player456",
      "CoolGamer", "NitroLover", "RobuxHunter", "GameDev99", "ProGamer2024"
    ];

    // Initial claims
    const initialClaims: RewardClaim[] = Array.from({ length: 5 }, (_, i) => ({
      id: `initial-${i}`,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      ...rewardTypes[Math.floor(Math.random() * rewardTypes.length)],
      timestamp: new Date(Date.now() - Math.random() * 300000), // Last 5 minutes
    }));

    setClaims(initialClaims);

    // Add new claims every 10-30 seconds
    const interval = setInterval(() => {
      const newClaim: RewardClaim = {
        id: `claim-${Date.now()}`,
        username: usernames[Math.floor(Math.random() * usernames.length)],
        ...rewardTypes[Math.floor(Math.random() * rewardTypes.length)],
        timestamp: new Date(),
      };

      setClaims(prev => [newClaim, ...prev.slice(0, 9)]); // Keep only 10 most recent
    }, Math.random() * 20000 + 10000); // 10-30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-3">
        {claims.map((claim, index) => (
          <Card 
            key={claim.id}
            className={`bg-gray-800/30 border-gray-700 transition-all duration-500 ${
              index === 0 ? 'animate-fade-in scale-100' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {claim.type === 'nitro' ? (
                      <Gift className="h-5 w-5 text-indigo-400" />
                    ) : (
                      <Zap className="h-5 w-5 text-green-400" />
                    )}
                    <span className="text-white font-medium">{claim.username}</span>
                  </div>
                  <span className="text-gray-400">claimed</span>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      claim.type === 'nitro' 
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                    }`}
                  >
                    {claim.reward}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">{formatTimeAgo(claim.timestamp)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
