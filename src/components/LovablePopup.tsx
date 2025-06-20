
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, ExternalLink, Zap, Code } from "lucide-react";

export const LovablePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkAndShowPopup = () => {
      // 3% chance to show popup
      const shouldShow = Math.random() < 0.03;
      if (shouldShow) {
        setIsOpen(true);
      }
    };

    // Show popup every 30 minutes (1,800,000 ms)
    const interval = setInterval(checkAndShowPopup, 1800000);
    
    // Also check on initial load after a delay
    const initialTimer = setTimeout(checkAndShowPopup, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, []);

  if (!isOpen) return null;

  const handleUseNow = () => {
    window.open('https://lovable.dev/invite/c18f3704-f01a-4c1b-8d0c-8cf700f49b61', '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="bg-gradient-to-br from-blue-900/90 to-indigo-900/90 border-blue-500/50 max-w-md w-full relative animate-scale-in">
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
            <Sparkles className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">🚀 Build Apps with AI!</h3>
            <p className="text-blue-200">Create amazing web applications using Lovable AI - No coding experience needed!</p>
          </div>

          <div className="space-y-3 mb-6">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 w-full justify-center py-2">
              <Code className="mr-2 h-4 w-4" />
              AI-Powered Development
            </Badge>
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 w-full justify-center py-2">
              <Zap className="mr-2 h-4 w-4" />
              Build Apps in Minutes
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 w-full justify-center py-2">
              ✨ No Code Required
            </Badge>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleUseNow} 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-3"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Try Lovable Now
            </Button>
            <Button 
              onClick={() => setIsOpen(false)} 
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 bg-zinc-500 hover:bg-zinc-400"
            >
              Not Interested
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
