
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Users, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LiveRewardFeed } from "@/components/LiveRewardFeed";
import { StatsCounter } from "@/components/StatsCounter";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">NitroVault</h1>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Live
          </Badge>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Claim Free
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                Discord Nitro & Robux!
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              No login required • Instant delivery after human verification
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/rewards?type=nitro')}
              size="lg" 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
            >
              <Gift className="mr-2 h-5 w-5" />
              Get Discord Nitro
            </Button>
            <Button 
              onClick={() => navigate('/rewards?type=robux')}
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Robux
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <StatsCounter />
      </section>

      {/* Live Feed Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-4">Latest Rewards Claimed</h3>
          <p className="text-gray-400">Real users getting real rewards right now</p>
        </div>
        <LiveRewardFeed />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">100% Safe</h4>
              <p className="text-gray-400">Our verification system ensures real users only</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Instant Delivery</h4>
              <p className="text-gray-400">Get your rewards within minutes of verification</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Trusted by Thousands</h4>
              <p className="text-gray-400">Join our community of satisfied users</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400 border-t border-gray-800">
        <p>&copy; 2024 NitroVault. All rights reserved. Not affiliated with Discord or Roblox.</p>
      </footer>
    </div>
  );
};

export default Index;
