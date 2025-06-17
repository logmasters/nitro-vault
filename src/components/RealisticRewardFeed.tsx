
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";

interface RewardClaim {
  id: string;
  username: string;
  reward: string;
  timestamp: Date;
}

// Persistent storage key
const STORAGE_KEY = 'nitrovault_reward_claims';

export const RealisticRewardFeed = () => {
  const [claims, setClaims] = useState<RewardClaim[]>([]);

  const realisticUsernames = [
    "rizzmachine69", "slattbabyjay", "urfav.jaylen", "itzz.kaykay", "clutchzay",
    "nahfrlilbro", "snaggy.jr", "trapbby.ari", "yeatpackin", "dripzach",
    "notxavier", "yxng.tr3", "sheluv.ty", "builtlike._dat", "crybby.lex",
    "qvwn.kiara", "d1.zo", "spazzyrex", "javiongotgame", "tootrill.chris",
    "6ixshaquille", "onmymomma.liljay", "vsco.jenni", "icedout.chase", "fye.breezy",
    "zoowop.nah", "trendy.tay", "dwnbad.marq", "realslime.milo", "ggitskev",
    
    "lucas_gamer07", "sophia.roblox123", "jayden_fortnitegod", "ava.minecrafterx",
    "noob_master444", "emily_plays_games", "ethan.levelup", "gamerboy321",
    "chloe_builds", "ryan_on_switch",

    "coolkid22", "bestuser2023", "john_doe99", "sweetangel12", "crazycatlover",
    "funny_memer99", "that_one_kid", "its_me_matt", "rebelgirl14", "jackplaysyt"
  ];

  const nitroRewards = [
    "Discord Nitro Boost (3 Months)",
    "Discord Nitro Basic (3 Months)", 
    "Discord Nitro Boost (1 Month)",
    "Discord Nitro Basic (1 Month)",
    "Discord Nitro Boost (6 Months)",
    "Discord Nitro Basic (6 Months)"
  ];

  // Load claims from localStorage
  const loadClaimsFromStorage = (): RewardClaim[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((claim: any) => ({
          ...claim,
          timestamp: new Date(claim.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading claims from storage:', error);
    }
    return [];
  };

  // Save claims to localStorage
  const saveClaimsToStorage = (claimsToSave: RewardClaim[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(claimsToSave));
    } catch (error) {
      console.error('Error saving claims to storage:', error);
    }
  };

  useEffect(() => {
    // Load existing claims or create initial ones
    let storedClaims = loadClaimsFromStorage();
    
    if (storedClaims.length === 0) {
      // Create initial claims if none exist
      storedClaims = Array.from({ length: 12 }, (_, i) => ({
        id: `initial-${i}`,
        username: realisticUsernames[Math.floor(Math.random() * realisticUsernames.length)],
        reward: nitroRewards[Math.floor(Math.random() * nitroRewards.length)],
        timestamp: new Date(Date.now() - Math.random() * 7200000), // Last 2 hours
      }));
      saveClaimsToStorage(storedClaims);
    }

    setClaims(storedClaims);

    // Add new claims every 20-60 seconds
    const interval = setInterval(() => {
      const newClaim: RewardClaim = {
        id: `claim-${Date.now()}`,
        username: realisticUsernames[Math.floor(Math.random() * realisticUsernames.length)],
        reward: nitroRewards[Math.floor(Math.random() * nitroRewards.length)],
        timestamp: new Date(),
      };

      setClaims(prev => {
        const updated = [newClaim, ...prev.slice(0, 14)]; // Keep 15 most recent
        saveClaimsToStorage(updated);
        return updated;
      });
    }, Math.random() * 40000 + 20000); // 20-60 seconds

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
                    <Gift className="h-5 w-5 text-indigo-400" />
                    <span className="text-white font-medium">{claim.username}</span>
                  </div>
                  <span className="text-gray-400">claimed</span>
                  <Badge 
                    variant="secondary" 
                    className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
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
