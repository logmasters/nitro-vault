
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Zap, Star, Users, Shield, CheckCircle } from "lucide-react";
import { StatsCounter } from "@/components/StatsCounter";
import { RealisticRewardFeed } from "@/components/RealisticRewardFeed";
import { logger } from "@/utils/logger";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Log visit and handle referrals
    const referralCode = searchParams.get('ref');
    const userId = 'anonymous-' + Date.now(); // Generate temporary ID
    const username = 'Anonymous User';
    
    logger.logVisit(userId, username, referralCode || undefined);
  }, [searchParams]);

  const handleGetReward = (type: 'nitro' | 'robux') => {
    navigate(`/rewards?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">NitroVault</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              ✅ 100% Free
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              ⚡ Instant Delivery
            </Badge>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Free Discord Nitro & Robux
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get premium Discord Nitro and Robux rewards instantly. No login required, just complete quick verification.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              onClick={() => handleGetReward('nitro')}
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <Gift className="mr-3 h-6 w-6" />
              Get Discord Nitro
            </Button>
            
            <Button
              onClick={() => handleGetReward('robux')}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
            >
              <Zap className="mr-3 h-6 w-6" />
              Get Robux
            </Button>
          </div>
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
            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-colors">
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-3">100% Safe & Secure</h4>
                <p className="text-gray-400">SSL encrypted and completely safe. No personal information required.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors">
              <CardContent className="p-8 text-center">
                <Zap className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-3">Instant Delivery</h4>
                <p className="text-gray-400">Receive your rewards instantly after verification. No waiting time.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-colors">
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

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">What Our Users Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "GamerPro123", text: "Got my Nitro in under 5 minutes! This site is legit 🔥", reward: "Discord Nitro" },
              { name: "RobloxFan2024", text: "Finally found a working robux generator. Thank you NitroVault!", reward: "1000 Robux" },
              { name: "DiscordUser", text: "No scam, no surveys, just free Nitro. Amazing!", reward: "Discord Nitro Classic" }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name[0]}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">Claimed {testimonial.reward}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.text}"</p>
                  <div className="flex items-center mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {[
              {
                q: "Is this really free?",
                a: "Yes! We're completely free. We're supported by partnerships and ads, not your wallet."
              },
              {
                q: "How long does delivery take?",
                a: "Most rewards are delivered instantly after verification. Maximum wait time is 10 minutes."
              },
              {
                q: "Do I need to create an account?",
                a: "No account required! Just complete the verification and claim your reward."
              },
              {
                q: "Is this safe?",
                a: "Absolutely! We use SSL encryption and never ask for sensitive information like passwords."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-2">{faq.q}</h4>
                  <p className="text-gray-400">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-800">
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
      </footer>
    </div>
  );
};

export default Index;
