
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, X, ExternalLink, Star, Trophy } from "lucide-react";

export const MicrosoftRewardsPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkAndShowPopup = () => {
      // Check if any other popup is currently open
      const otherPopupsOpen = document.querySelector('[data-popup-type]');
      if (otherPopupsOpen) return;

      // Check last popup time to ensure 2 minute delay between popups
      const lastPopupTime = localStorage.getItem('lastPopupTime');
      const now = Date.now();
      if (lastPopupTime && now - parseInt(lastPopupTime) < 120000) return; // 2 minutes

      // 5% chance to show popup
      const shouldShow = Math.random() < 0.05;
      if (shouldShow) {
        setIsOpen(true);
        localStorage.setItem('lastPopupTime', now.toString());
      }
    };

    // Show popup every 15 minutes (900,000 ms)
    const interval = setInterval(checkAndShowPopup, 900000);
    
    // Also check on initial load after a delay
    const initialTimer = setTimeout(checkAndShowPopup, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  if (!isOpen) return null;

  const handleClaimRewards = () => {
    window.open('https://rewards.bing.com/welcome?rh=1D760FD&ref=rafsrchae', '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" data-popup-type="microsoft-rewards">
      <Card className="bg-gradient-to-br from-orange-900/90 to-red-900/90 border-orange-500/50 max-w-md w-full relative animate-scale-in">
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
            <Trophy className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">🏆 Microsoft Rewards!</h3>
            <p className="text-orange-200">Earn points with Microsoft Rewards and get amazing prizes!</p>
          </div>

          <div className="space-y-3 mb-6">
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 w-full justify-center py-2">
              <Star className="mr-2 h-4 w-4" />
              Free Points & Rewards
            </Badge>
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 w-full justify-center py-2">
              <Gift className="mr-2 h-4 w-4" />
              Gift Cards & Games
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 w-full justify-center py-2">
              💰 Cash Back Available
            </Badge>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleClaimRewards} 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Claim Microsoft Rewards
            </Button>
            <Button 
              onClick={() => setIsOpen(false)} 
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 bg-zinc-500 hover:bg-zinc-400"
            >
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
