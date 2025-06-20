import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Copy, Users, Gift, Share2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface ReferralData {
  code: string;
  referrals: number;
  rewards: number;
  totalEarned: number;
}
export const ReferralSystem = () => {
  const [referralData, setReferralData] = useState<ReferralData>({
    code: '',
    referrals: 0,
    rewards: 0,
    totalEarned: 0
  });
  const [copied, setCopied] = useState(false);
  const {
    toast
  } = useToast();

  // Generate or load referral code
  useEffect(() => {
    const savedData = localStorage.getItem('nitrovault_referral_data');
    if (savedData) {
      setReferralData(JSON.parse(savedData));
    } else {
      const newCode = generateReferralCode();
      const newData = {
        code: newCode,
        referrals: 0,
        rewards: 0,
        totalEarned: 0
      };
      setReferralData(newData);
      localStorage.setItem('nitrovault_referral_data', JSON.stringify(newData));
    }
  }, []);
  const generateReferralCode = (): string => {
    return 'NV' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };
  const getReferralLink = (): string => {
    return `${window.location.origin}?ref=${referralData.code}`;
  };
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(getReferralLink());
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Your referral link has been copied to clipboard."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };
  const shareReferralLink = async () => {
    const shareData = {
      title: 'Join NitroVault - Free Discord Nitro & Robux!',
      text: 'Get free Discord Nitro and Robux rewards! Use my referral link to get started.',
      url: getReferralLink()
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        copyReferralLink();
      }
    } catch (error) {
      copyReferralLink();
    }
  };
  const rewardTiers = [{
    referrals: 1,
    reward: "Discord Nitro Basic (1 Month)"
  }, {
    referrals: 3,
    reward: "Discord Nitro Boost (1 Month)"
  }, {
    referrals: 5,
    reward: "Discord Nitro Boost (3 Months)"
  }, {
    referrals: 10,
    reward: "Discord Nitro Boost (6 Months)"
  }, {
    referrals: 25,
    reward: "Discord Nitro Boost (1 Year)"
  }];
  return <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Referral Program
        </h2>
        <p className="text-gray-300 text-lg">
          Invite friends and earn amazing rewards together!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{referralData.referrals}</div>
            <div className="text-gray-400">Friends Referred</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <Gift className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{referralData.rewards}</div>
            <div className="text-gray-400">Rewards Earned</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-lg px-3 py-1">
              ${referralData.totalEarned} Value
            </Badge>
            <div className="text-gray-400 mt-2">Total Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 bg-zinc-500">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 bg-zinc-500">
          <div className="flex items-center space-x-2">
            <Input value={getReferralLink()} readOnly className="bg-gray-800/50 border-gray-600 text-white" />
            <Button onClick={copyReferralLink} variant="outline" size="icon" className="border-gray-600 hover:bg-gray-700">
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={copyReferralLink} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button onClick={shareReferralLink} variant="outline" className="flex-1 border-gray-600 text-gray-300 bg-zinc-500 hover:bg-zinc-400">
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reward Tiers */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Referral Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rewardTiers.map((tier, index) => {
            const isUnlocked = referralData.referrals >= tier.referrals;
            const isCurrent = referralData.referrals < tier.referrals && (index === 0 || referralData.referrals >= rewardTiers[index - 1].referrals);
            return <div key={tier.referrals} className={`flex items-center justify-between p-4 rounded-lg border ${isUnlocked ? 'bg-green-500/20 border-green-500/30' : isCurrent ? 'bg-purple-500/20 border-purple-500/30' : 'bg-gray-700/30 border-gray-600'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUnlocked ? 'bg-green-500' : isCurrent ? 'bg-purple-500' : 'bg-gray-600'}`}>
                      {isUnlocked ? <Check className="h-4 w-4 text-white" /> : <span className="text-white text-sm font-bold">{tier.referrals}</span>}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {tier.referrals} Referral{tier.referrals > 1 ? 's' : ''}
                      </div>
                      <div className="text-gray-400 text-sm">{tier.reward}</div>
                    </div>
                  </div>
                  <Badge variant={isUnlocked ? 'default' : 'secondary'} className={isUnlocked ? 'bg-green-500/20 text-green-400 border-green-500/30' : isCurrent ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-gray-600/20 text-gray-400 border-gray-600/30'}>
                    {isUnlocked ? 'Unlocked' : isCurrent ? 'Next' : 'Locked'}
                  </Badge>
                </div>;
          })}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold">1</span>
              </div>
              <h4 className="text-white font-medium mb-2">Share Your Link</h4>
              <p className="text-gray-400 text-sm">Copy and share your unique referral link with friends</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-400 font-bold">2</span>
              </div>
              <h4 className="text-white font-medium mb-2">Friends Join</h4>
              <p className="text-gray-400 text-sm">Your friends sign up and complete verification</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 font-bold">3</span>
              </div>
              <h4 className="text-white font-medium mb-2">Earn Rewards</h4>
              <p className="text-gray-400 text-sm">Both you and your friend get bonus rewards!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};