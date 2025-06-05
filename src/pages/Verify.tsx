
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, AlertTriangle, Users, Gift } from "lucide-react";
import { DiscordAuthButton } from "@/components/DiscordAuthButton";
import { VerificationTasks } from "@/components/VerificationTasks";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showExplanation, setShowExplanation] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [discordAuthed, setDiscordAuthed] = useState(false);

  const reward = searchParams.get('reward');
  const quantity = searchParams.get('quantity');
  const type = searchParams.get('type');

  useEffect(() => {
    if (!reward || !quantity || !type) {
      navigate('/');
    }
  }, [reward, quantity, type, navigate]);

  const getRewardDisplayName = () => {
    if (type === 'nitro') {
      return reward?.includes('classic') ? 'Discord Nitro Classic' : 'Discord Nitro Boost';
    } else {
      const robuxAmount = reward?.match(/\d+/)?.[0] || '400';
      return `${robuxAmount} Robux`;
    }
  };

  const handleVerifyNow = () => {
    setIsVerifying(true);
    setShowTasks(true);
  };

  const handleTasksComplete = () => {
    setTimeout(() => {
      const params = new URLSearchParams({
        reward: reward || '',
        quantity: quantity || '',
        type: type || ''
      });
      navigate(`/success?${params.toString()}`);
    }, 2000);
  };

  const explanationText = `Because people abused our website with bots and fake requests, we ran out of stock multiple times. To keep our service free and fair for everyone, we now require human verification. This quick process helps us ensure real users get real rewards!`;

  if (showTasks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowTasks(false)}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <Gift className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">NitroVault</h1>
            </div>
          </nav>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <VerificationTasks onAllTasksComplete={handleTasksComplete} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
            disabled={isVerifying}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">NitroVault</h1>
          </div>
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
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  2
                </div>
                <span className="ml-2 text-white font-medium">Verify</span>
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

          {/* Selected Reward Summary */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Selected Reward</h3>
                <div className="flex items-center justify-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-lg py-2 px-4 ${
                      type === 'nitro' 
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                    }`}
                  >
                    {getRewardDisplayName()} ({quantity})
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discord Auth Section */}
          <div className="mb-8">
            <DiscordAuthButton />
          </div>

          {/* Verification Warning */}
          <Card className="bg-yellow-500/10 border-yellow-500/30 mb-8">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  🚧 Please Verify You're Human
                </h2>
              </div>

              {!showExplanation ? (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                      <div className="text-left">
                        <h4 className="font-semibold text-white mb-2">Quick Verification Required</h4>
                        <p className="text-gray-300 leading-relaxed">
                          To prevent abuse and ensure fair access to rewards for all users, we need to verify that you're human. This process takes less than 2 minutes and helps us maintain our free service.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleVerifyNow}
                      disabled={isVerifying}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          ✅ Verify Now
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => setShowExplanation(true)}
                      variant="outline"
                      size="lg"
                      className="border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white px-8 py-4 text-lg"
                      disabled={isVerifying}
                    >
                      ❓ Why is this needed?
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-start space-x-3">
                      <Users className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                      <div className="text-left">
                        <h4 className="font-semibold text-white mb-3">Why We Need Verification</h4>
                        <p className="text-gray-300 leading-relaxed mb-4">
                          {explanationText}
                        </p>
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h5 className="text-sm font-semibold text-white mb-2">Benefits of verification:</h5>
                          <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Prevents bot abuse and fake requests</li>
                            <li>• Ensures fair distribution of rewards</li>
                            <li>• Keeps our service completely free</li>
                            <li>• Protects legitimate users like you</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleVerifyNow}
                      disabled={isVerifying}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          ✅ I Understand, Verify Now
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => setShowExplanation(false)}
                      variant="outline"
                      size="lg"
                      className="border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white px-8 py-4 text-lg"
                      disabled={isVerifying}
                    >
                      ← Back
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="text-gray-400">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-400" />
              <div className="text-sm">SSL Secured</div>
            </div>
            <div className="text-gray-400">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <div className="text-sm">15,000+ Verified Users</div>
            </div>
            <div className="text-gray-400">
              <Gift className="h-8 w-8 mx-auto mb-2 text-purple-400" />
              <div className="text-sm">Instant Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
