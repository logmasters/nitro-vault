
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export const StatsCounter = () => {
  const [stats, setStats] = useState({
    totalRewards: 15420,
    activeUsers: 1247,
    rewardsToday: 342
  });

  useEffect(() => {
    // Simulate live stats updates
    const interval = setInterval(() => {
      setStats(prev => ({
        totalRewards: prev.totalRewards + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        rewardsToday: prev.rewardsToday + Math.floor(Math.random() * 2)
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
