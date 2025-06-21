
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, X, ExternalLink, TrendingUp } from "lucide-react";

export const LinkvertisePopup = () => {
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

      // 15% chance to show popup
      const shouldShow = Math.random() < 0.15;
      if (shouldShow) {
        setIsOpen(true);
        localStorage.setItem('lastPopupTime', now.toString());
      }
    };

    // Show popup every 10 minutes (600,000 ms)
    const interval = setInterval(checkAndShowPopup, 600000);
    
    // Also check on initial load after a short delay
    const initialTimer = setTimeout(checkAndShowPopup, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  if (!isOpen) return null;

  const handleStartEarning = () => {
    window.open('https://publisher.linkvertise.dev/ac/1167083', '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" data-popup-type="linkvertise">
      <Card className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 border-green-500/50 max-w-md w-full relative animate-scale-in">
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
            <DollarSign className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">💰 Earn Money Online!</h3>
            <p className="text-green-200">Start earning with Linkvertise - Get paid for every click!</p>
          </div>

          <div className="space-y-3 mb-6">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 w-full justify-center py-2">
              <TrendingUp className="mr-2 h-4 w-4" />
              High Revenue Potential
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 w-full justify-center py-2">
              <DollarSign className="mr-2 h-4 w-4" />
              Easy Setup & Management
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 w-full justify-center py-2">
              💎 Premium Ad Network
            </Badge>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleStartEarning} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Start Earning Now
            </Button>
            <Button 
              onClick={() => setIsOpen(false)} 
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 bg-zinc-500 hover:bg-zinc-400"
            >
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
