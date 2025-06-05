
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Check, Share, Home, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const reward = searchParams.get('reward');
  const quantity = searchParams.get('quantity');
  const type = searchParams.get('type');

  useEffect(() => {
    if (!reward || !quantity || !type) {
      navigate('/');
      return;
    }

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [reward, quantity, type, navigate]);

  const getRewardDisplayName = () => {
    if (type === 'nitro') {
      return reward?.includes('classic') ? 'Discord Nitro Classic' : 'Discord Nitro Boost';
    } else {
      const robuxAmount = reward?.match(/\d+/)?.[0] || '400';
      return `${robuxAmount} Robux`;
    }
  };

  const handleShare = () => {
    const shareText = `I just claimed ${getRewardDisplayName()} for free at NitroVault! 🎮`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Free Discord Nitro & Robux',
        text: shareText,
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
      toast({
        title: "Copied to clipboard!",
        description: "Share link copied successfully",
      });
    }
  };

  const handleCopyCode = () => {
    // Generate a fake code for demonstration
    const fakeCode = type === 'nitro' ? 'NITRO-' + Math.random().toString(36).substr(2, 9).toUpperCase() : 'RBX-' + Math.random().toString(36).substr(2, 12).toUpperCase();
    
    navigator.clipboard.writeText(fakeCode);
    toast({
      title: "Code copied!",
      description: "Your reward code has been copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-2">
          <Gift className="h-8 w-8 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">NitroVault</h1>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  ✓
                </div>
                <span className="ml-2 text-green-400 font-medium">Choose Reward</span>
              </div>
              <div className="w-8 h-1 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  ✓
                </div>
                <span className="ml-2 text-green-400 font-medium">Verify</span>
              </div>
              <div className="w-8 h-1 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  ✓
                </div>
                <span className="ml-2 text-green-400 font-medium">Claim</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 mb-8">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  🎉 Success!
                </h2>
                <p className="text-xl text-green-300 mb-6">
                  Your reward is being delivered
                </p>
              </div>

              {/* Selected Reward */}
              <div className="mb-6">
                <Badge 
                  variant="secondary" 
                  className={`text-xl py-3 px-6 ${
                    type === 'nitro' 
                      ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                      : 'bg-green-500/20 text-green-400 border-green-500/30'
                  }`}
                >
                  {getRewardDisplayName()} ({quantity})
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-100 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-300">
                  {isComplete ? 'Processing complete!' : `Processing... ${progress}%`}
                </p>
              </div>

              {isComplete && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-3">Important Information</h3>
                    <div className="text-left text-gray-300 space-y-2">
                      <p>✅ Verification completed successfully</p>
                      <p>✅ Reward request processed</p>
                      <p>✅ Delivery initiated</p>
                      <p className="text-yellow-300">⏱️ Delivery may take up to 10 minutes</p>
                    </div>
                  </div>

                  {/* Mock reward code */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Your Reward Code:</p>
                        <code className="text-green-400 font-mono text-lg">
                          {type === 'nitro' ? 'NITRO-XXXXX-XXXXX' : 'RBX-XXXXXXXXXX'}
                        </code>
                      </div>
                      <Button
                        onClick={handleCopyCode}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:border-gray-500"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm">
                    Thank you for verifying! We are now processing your {getRewardDisplayName()} request. 
                    Delivery may take up to 10 minutes. Enjoy your reward!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {isComplete && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleShare}
                  size="lg"
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white"
                >
                  <Share className="mr-2 h-5 w-5" />
                  Share with Friends
                </Button>
                
                <Button
                  onClick={() => navigate('/')}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Get More Rewards
                </Button>
              </div>

              {/* Trust message */}
              <Card className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-gray-400">
                    🔒 Your reward is secured and will be delivered automatically. 
                    Check your email or account for delivery confirmation.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;
