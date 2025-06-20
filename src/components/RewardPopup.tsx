
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, X, ExternalLink, Zap } from "lucide-react";

export const RewardPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 15 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleJoinServer = () => {
    window.open('https://discord.gg/qHp8SjPDXN', '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 border-purple-500/50 max-w-md w-full relative animate-scale-in">
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Gift className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">🎉 Extra Rewards Available!</h3>
            <p className="text-purple-200">Join our exclusive Discord server for bonus rewards</p>
          </div>

          <div className="space-y-3 mb-6">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 w-full justify-center py-2">
              <Zap className="mr-2 h-4 w-4" />
              Extra Discord Nitro Monthly
            </Badge>
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 w-full justify-center py-2">
              <Gift className="mr-2 h-4 w-4" />
              Exclusive Member Perks
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 w-full justify-center py-2">
              ⚡ Priority Support
            </Badge>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleJoinServer}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Join Discord Server
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
