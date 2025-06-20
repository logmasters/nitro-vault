import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Zap, Star, Users, Shield, CheckCircle, Clock, MessageCircle } from "lucide-react";
import { StatsCounter } from "@/components/StatsCounter";
import { RealisticRewardFeed } from "@/components/RealisticRewardFeed";
import { VerificationTasks } from "@/components/VerificationTasks";
import { RewardPopup } from "@/components/RewardPopup";
import { RewardSelector } from "@/components/RewardSelector";
import { logger } from "@/utils/logger";
import { ReferralSystem } from "@/components/ReferralSystem";
type PageState = 'landing' | 'reward-selection' | 'verification' | 'processing' | 'success' | 'referrals';
const Index = () => {
  const [searchParams] = useSearchParams();
  const [currentState, setCurrentState] = useState<PageState>('landing');
  const [showProcessing, setShowProcessing] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  useEffect(() => {
    // Log visit and handle referrals
    const referralCode = searchParams.get('ref');
    logger.logVisit(referralCode || undefined);
  }, [searchParams]);

  const handleStartVerification = () => {
    setCurrentState('reward-selection');
  };
  const handleRewardSelected = (reward: any) => {
    setSelectedReward(reward);
    setCurrentState('verification');
  };
  const handleAllTasksComplete = () => {
    setCurrentState('processing');
    setShowProcessing(true);

    // After processing, show success
    setTimeout(() => {
      setCurrentState('success');
    }, 30000);
  };
  const renderLandingPage = () => <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Free Discord Nitro & Robux
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get premium Discord Nitro and Robux rewards instantly. Complete verification below to claim your rewards.
          </p>
          <Button onClick={handleStartVerification} size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
            <Gift className="mr-3 h-6 w-6" />
            Claim Your Rewards Now
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <StatsCounter />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Why Choose NitroVault?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-3">100% Safe & Secure</h4>
                <p className="text-gray-400">SSL encrypted and completely safe. No personal information required.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <Zap className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-3">Instant Delivery</h4>
                <p className="text-gray-400">Receive your rewards instantly after verification. No waiting time.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-3">Trusted by Thousands</h4>
                <p className="text-gray-400">Join over 15,000+ satisfied users who've claimed their rewards.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Feed Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">🔥 Latest Rewards Claimed</h3>
          <RealisticRewardFeed />
        </div>
      </section>
    </div>;
  const renderRewardSelectionPage = () => <div className="animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <RewardSelector onRewardSelect={handleRewardSelected} />
          
          <div className="text-center mt-8">
            <Button onClick={() => setCurrentState('landing')} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>;
  const renderVerificationPage = () => <div className="animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Complete Verification
            </h2>
            <p className="text-gray-300 text-lg">Follow the steps below to claim your {selectedReward?.name}</p>
          </div>

          <VerificationTasks onAllTasksComplete={handleAllTasksComplete} />
        </div>
      </div>
    </div>;
  const renderProcessingPage = () => <div className="animate-fade-in">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
            <CardContent className="p-12 text-center">
              <Clock className="h-20 w-20 text-yellow-500 mx-auto mb-8 animate-pulse" />
              <h3 className="text-3xl font-bold text-white mb-6">Almost There! 🎉</h3>
              <p className="text-yellow-300 mb-8 text-xl leading-relaxed">
                Your verification is complete! While we prepare your rewards, please add this URL to your Discord bio and status for faster claiming:
              </p>
              <Card className="bg-gray-800/50 border-gray-700 mb-8">
                <CardContent className="p-6">
                  <code className="text-green-400 text-xl break-all font-mono bg-gray-900/50 px-4 py-2 rounded">
                    {window.location.origin}
                  </code>
                </CardContent>
              </Card>
              <div className="space-y-4 text-gray-300 text-lg">
                <div className="flex items-center justify-center space-x-3">
                  <MessageCircle className="h-6 w-6 text-indigo-400" />
                  <p><strong>Discord Bio:</strong> Add the URL to your "About Me" section</p>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Zap className="h-6 w-6 text-green-400" />
                  <p><strong>Discord Status:</strong> Set the URL as your custom status</p>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Clock className="h-6 w-6 text-yellow-400" />
                  <p><strong>This speeds up processing by 90%!</strong></p>
                </div>
              </div>
              <div className="mt-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-gray-300 text-lg">Processing your reward... Please wait</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
  const renderSuccessPage = () => <div className="animate-fade-in">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-12">
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-8" />
              <h3 className="text-4xl font-bold text-white mb-6">Congratulations! 🎉</h3>
              <p className="text-green-300 text-xl mb-8">
                Your {selectedReward?.name} has been successfully processed and should be available in your account shortly!
              </p>
              <div className="space-y-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-lg px-6 py-2">
                  ✅ {selectedReward?.name} Activated
                </Badge>
              </div>
              <Button onClick={() => setCurrentState('landing')} className="mt-8 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
  const renderReferralsPage = () => <div className="animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <ReferralSystem />
        
        <div className="text-center mt-8">
          <Button onClick={() => setCurrentState('landing')} variant="outline" className="border-gray-600 text-gray-300 bg-zinc-500 hover:bg-zinc-400">
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
      {/* Popup Ad */}
      <RewardPopup />

      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">NitroVault</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setCurrentState('referrals')} variant="outline" className="border-purple-500/50 text-purple-300 bg-zinc-500 hover:bg-zinc-400">
              <Users className="mr-2 h-4 w-4" />
              Referrals
            </Button>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              ✅ 100% Free
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              ⚡ Instant Delivery
            </Badge>
          </div>
        </nav>
      </header>

      {/* Dynamic Content Based on State */}
      {currentState === 'landing' && renderLandingPage()}
      {currentState === 'reward-selection' && renderRewardSelectionPage()}
      {currentState === 'verification' && renderVerificationPage()}
      {currentState === 'processing' && renderProcessingPage()}
      {currentState === 'success' && renderSuccessPage()}
      {currentState === 'referrals' && renderReferralsPage()}

      {/* Footer - Only show on landing page */}
      {currentState === 'landing' && <footer className="container mx-auto px-4 py-12 border-t border-gray-800">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Gift className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">NitroVault</span>
            </div>
            <p className="text-gray-400 mb-4">
              Free Discord Nitro & Robux rewards platform. Safe, fast, and reliable.
            </p>
            <div className="flex items-center justify-center space-x-6">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="mr-1 h-3 w-3" />
                SSL Secured
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Shield className="mr-1 h-3 w-3" />
                Privacy Protected
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Users className="mr-1 h-3 w-3" />
                15K+ Users
              </Badge>
            </div>
          </div>
        </footer>}
    </div>
  );
};

export default Index;
