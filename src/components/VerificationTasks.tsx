
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, Download, Share, ExternalLink } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'ad' | 'app' | 'share';
  completed: boolean;
  reward: string;
}

interface VerificationTasksProps {
  onAllTasksComplete: () => void;
}

export const VerificationTasks = ({ onAllTasksComplete }: VerificationTasksProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'watch-ad',
      title: 'Watch Advertisement',
      description: 'Watch a 30-second ad to support our free service',
      type: 'ad',
      completed: false,
      reward: '25 points'
    },
    {
      id: 'download-app',
      title: 'Download Partner App',
      description: 'Download and open one of our partner apps',
      type: 'app',
      completed: false,
      reward: '50 points'
    },
    {
      id: 'share-site',
      title: 'Share with Friends',
      description: 'Share this site with 2 friends to spread the word',
      type: 'share',
      completed: false,
      reward: '30 points'
    }
  ]);

  const completeTask = (taskId: string) => {
    setTasks(prev => {
      const updated = prev.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      );
      
      // Check if all tasks are completed
      if (updated.every(task => task.completed)) {
        setTimeout(() => onAllTasksComplete(), 1000);
      }
      
      return updated;
    });
  };

  const handleWatchAd = () => {
    // Simulate ad watching
    setTimeout(() => {
      completeTask('watch-ad');
    }, 2000);
  };

  const handleDownloadApp = () => {
    // Open app store or download link
    window.open('https://play.google.com/store', '_blank');
    setTimeout(() => {
      completeTask('download-app');
    }, 3000);
  };

  const handleShare = () => {
    const shareData = {
      title: 'Free Discord Nitro & Robux - NitroVault',
      text: 'Get free Discord Nitro and Robux rewards instantly! 🎮',
      url: window.location.origin
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
      window.open(shareUrl, '_blank');
    }
    
    setTimeout(() => {
      completeTask('share-site');
    }, 2000);
  };

  const getTaskIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-6 w-6 text-green-500" />;
    
    switch (type) {
      case 'ad': return <Play className="h-6 w-6 text-blue-400" />;
      case 'app': return <Download className="h-6 w-6 text-purple-400" />;
      case 'share': return <Share className="h-6 w-6 text-orange-400" />;
      default: return <ExternalLink className="h-6 w-6 text-gray-400" />;
    }
  };

  const getTaskAction = (task: Task) => {
    if (task.completed) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
    }

    switch (task.type) {
      case 'ad':
        return (
          <Button onClick={handleWatchAd} className="bg-blue-500 hover:bg-blue-600">
            <Play className="mr-2 h-4 w-4" />
            Watch Ad
          </Button>
        );
      case 'app':
        return (
          <Button onClick={handleDownloadApp} className="bg-purple-500 hover:bg-purple-600">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        );
      case 'share':
        return (
          <Button onClick={handleShare} className="bg-orange-500 hover:bg-orange-600">
            <Share className="mr-2 h-4 w-4" />
            Share Now
          </Button>
        );
      default:
        return null;
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Complete Verification Tasks</h3>
        <p className="text-gray-400">Complete all tasks below to finish verification</p>
        <div className="mt-4">
          <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500"
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">{completedTasks}/{totalTasks} tasks completed</p>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card 
            key={task.id} 
            className={`transition-all duration-300 ${
              task.completed 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-gray-800/50 border-gray-700'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getTaskIcon(task.type, task.completed)}
                  <div>
                    <h4 className="text-lg font-semibold text-white">{task.title}</h4>
                    <p className="text-gray-400">{task.description}</p>
                    <Badge variant="secondary" className="mt-2 bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                      +{task.reward}
                    </Badge>
                  </div>
                </div>
                <div>
                  {getTaskAction(task)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {completedTasks === totalTasks && (
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 animate-fade-in">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">All Tasks Completed! 🎉</h3>
            <p className="text-green-300">Redirecting to claim your reward...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
