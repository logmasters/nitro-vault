
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { logger } from "@/utils/logger";

export const StatsCounter = () => {
  const [stats, setStats] = useState({
    totalRewards: 0,
    activeUsers: 0,
    rewardsToday: 0
  });

  useEffect(() => {
    // Initialize with saved stats or default values
    const initialStats = logger.getStats();
    setStats({
      totalRewards: initialStats.totalRewards || Math.floor(Math.random() * 5000) + 10000,
      activeUsers: initialStats.activeUsers || Math.floor(Math.random() * 500) + 800,
      rewardsToday: initialStats.rewardsToday || Math.floor(Math.random() * 100) + 200
    });

    // Update stats from logger every 5 seconds
    const interval = setInterval(() => {
      const currentStats = logger.getStats();
      setStats(prev => ({
        totalRewards: Math.max(prev.totalRewards, currentStats.totalRewards || prev.totalRewards),
        activeUsers: Math.max(1, currentStats.activeUsers || prev.activeUsers),
        rewardsToday: Math.max(prev.rewardsToday, currentStats.rewardsToday || prev.rewardsToday)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {stats.totalRewards.toLocaleString()}
          </div>
          <div className="text-purple-300">Total Rewards Claimed</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {stats.activeUsers.toLocaleString()}
          </div>
          <div className="text-green-300">Active Users Online</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {stats.rewardsToday.toLocaleString()}
          </div>
          <div className="text-yellow-300">Rewards Today</div>
        </CardContent>
      </Card>
    </div>
  );
};
