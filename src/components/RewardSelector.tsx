
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Check } from "lucide-react";

interface RewardOption {
  id: string;
  name: string;
  description: string;
  duration: string;
  popular?: boolean;
}

interface RewardSelectorProps {
  onRewardSelect: (reward: RewardOption) => void;
}

export const RewardSelector = ({ onRewardSelect }: RewardSelectorProps) => {
  const [selectedReward, setSelectedReward] = useState<string>('nitro-boost-3m');

  const rewardOptions: RewardOption[] = [
    {
      id: 'nitro-boost-3m',
      name: 'Discord Nitro Boost',
      description: 'Full Nitro experience with all premium features',
      duration: '3 Months',
      popular: true
    },
    {
      id: 'nitro-basic-3m',
      name: 'Discord Nitro Basic',
      description: 'Essential Nitro features for everyday use',
      duration: '3 Months'
    },
    {
      id: 'nitro-boost-1m',
      name: 'Discord Nitro Boost',
      description: 'Full Nitro experience with all premium features',
      duration: '1 Month'
    },
    {
      id: 'nitro-basic-1m',
      name: 'Discord Nitro Basic',
      description: 'Essential Nitro features for everyday use',
      duration: '1 Month'
    }
  ];

  const handleRewardSelect = (reward: RewardOption) => {
    setSelectedReward(reward.id);
    onRewardSelect(reward);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Choose Your Reward</h3>
        <p className="text-gray-300">Select the Discord Nitro plan you want to claim</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewardOptions.map((reward) => (
          <Card
            key={reward.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedReward === reward.id
                ? 'bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border-purple-500'
                : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'
            }`}
            onClick={() => handleRewardSelect(reward)}
          >
            <CardContent className="p-6 relative">
              {reward.popular && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                  🔥 Popular
                </Badge>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <Gift className="h-8 w-8 text-purple-400" />
                {selectedReward === reward.id && (
                  <div className="bg-green-500 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              <h4 className="text-xl font-semibold text-white mb-2">{reward.name}</h4>
              <p className="text-gray-400 mb-3 text-sm">{reward.description}</p>
              
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                {reward.duration}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
