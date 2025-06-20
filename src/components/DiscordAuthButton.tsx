
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Gift } from "lucide-react";

export const DiscordAuthButton = () => {
  const handleDiscordAuth = () => {
    // Use secure OAuth configuration with proper redirect to current domain
    const currentDomain = window.location.origin;
    const secureAuthUrl = `https://discord.com/oauth2/authorize?client_id=1317910242649964645&redirect_uri=${encodeURIComponent(currentDomain + '/auth/callback')}&response_type=code&scope=identify&state=${Date.now()}`;
    
    // Open in same window for better security
    window.location.href = secureAuthUrl;
  };

  const handleJoinDiscord = () => {
    window.open('https://discord.gg/uYh6p2TF', '_blank');
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <MessageCircle className="h-8 w-8 text-indigo-400" />
              <h3 className="text-xl font-semibold text-white">Discord Authorization Required</h3>
            </div>
            <p className="text-gray-300">
              Connect your Discord account to claim rewards and verify your identity
            </p>
            <Button
              onClick={handleDiscordAuth}
              size="lg"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Authorize with Discord
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Gift className="h-8 w-8 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Join Our Discord Server</h3>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                +50 Bonus Points
              </Badge>
            </div>
            <p className="text-gray-300">
              Join our community and get bonus rewards for being an active member
            </p>
            <Button
              onClick={handleJoinDiscord}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Join Discord Server
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
