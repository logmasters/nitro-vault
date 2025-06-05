
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, Zap, Check } from "lucide-react";

interface RewardOption {
  id: string;
  name: string;
  description: string;
  value: string;
  image: string;
  type: 'nitro' | 'robux';
}

const Rewards = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedReward, setSelectedReward] = useState<RewardOption | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const rewardType = searchParams.get('type') as 'nitro' | 'robux';

  const nitroRewards: RewardOption[] = [
    {
      id: 'nitro-classic-1m',
      name: 'Discord Nitro Classic',
      description: '1 Month Subscription',
      value: '$4.99 Value',
      image: '🎮',
      type: 'nitro'
    },
    {
      id: 'nitro-boost-1m',
      name: 'Discord Nitro Boost',
      description: '1 Month Subscription',
      value: '$9.99 Value',
      image: '⚡',
      type: 'nitro'
    }
  ];

  const robuxRewards: RewardOption[] = [
    {
      id: 'robux-400',
      name: '400 Robux',
      description: 'Perfect for accessories',
      value: '$4.95 Value',
      image: '💎',
      type: 'robux'
    },
    {
      id: 'robux-800',
      name: '800 Robux',
      description: 'Great for premium items',
      value: '$9.95 Value',
      image: '💰',
      type: 'robux'
    },
    {
      id: 'robux-1700',
      name: '1,700 Robux',
      description: 'Best value package',
      value: '$19.95 Value',
      image: '🏆',
      type: 'robux'
    },
    {
      id: 'robux-2000',
      name: '2,000 Robux',
      description: 'Premium gaming experience',
      value: '$24.95 Value',
      image: '👑',
      type: 'robux'
    }
  ];

  const rewards = rewardType === 'nitro' ? nitroRewards : robuxRewards;
  const quantityOptions = rewardType === 'nitro' ? ['1 Month', '3 Months'] : ['1x', '2x', '3x'];

  useEffect(() => {
    if (!rewardType || !['nitro', 'robux'].includes(rewardType)) {
      navigate('/');
    }
  }, [rewardType, navigate]);

  const handleContinue = () => {
    if (!selectedReward) return;
    
    const params = new URLSearchParams({
      reward: selectedReward.id,
      quantity: quantity,
      type: rewardType
    });
    
    navigate(`/verify?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">NitroVault</h1>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  1
                </div>
                <span className="ml-2 text-white font-medium">Choose Reward</span>
              </div>
              <div className="w-8 h-1 bg-gray-600"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 font-semibold">
                  2
                </div>
                <span className="ml-2 text-gray-400">Verify</span>
              </div>
              <div className="w-8 h-1 bg-gray-600"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 font-semibold">
                  3
                </div>
                <span className="ml-2 text-gray-400">Claim</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your {rewardType === 'nitro' ? 'Discord Nitro' : 'Robux'} Reward
            </h2>
            <p className="text-gray-400">Select the reward you'd like to claim</p>
          </div>

          {/* Reward Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {rewards.map((reward) => (
              <Card
                key={reward.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedReward?.id === reward.id
                    ? 'bg-purple-500/20 border-purple-500 shadow-purple-500/25 shadow-xl'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
                onClick={() => setSelectedReward(reward)}
              >
                <CardContent className="p-6 text-center relative">
                  {selectedReward?.id === reward.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div className="text-4xl mb-4">{reward.image}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{reward.name}</h3>
                  <p className="text-gray-400 mb-3">{reward.description}</p>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      rewardType === 'nitro' 
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                    }`}
                  >
                    {reward.value}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quantity Selection */}
          {selectedReward && (
            <Card className="bg-gray-800/50 border-gray-700 mb-8 animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Choose Quantity</h3>
                <div className="flex flex-wrap gap-3">
                  {quantityOptions.map((option) => (
                    <Button
                      key={option}
                      variant={quantity === option ? "default" : "outline"}
                      onClick={() => setQuantity(option)}
                      className={`${
                        quantity === option
                          ? 'bg-purple-500 hover:bg-purple-600 text-white'
                          : 'border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Continue Button */}
          {selectedReward && (
            <div className="text-center animate-fade-in">
              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                Continue to Verification
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
