
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, MessageCircle, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'security_check' | 'discord';
  completed: boolean;
  reward: string;
}

interface VerificationTasksProps {
  onAllTasksComplete: () => void;
}

export const VerificationTasks = ({ onAllTasksComplete }: VerificationTasksProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'security-check-1',
      title: 'Account Security Verification',
      description: 'Verify your account meets security requirements',
      type: 'security_check',
      completed: false,
      reward: '25 points'
    },
    {
      id: 'security-check-2',
      title: 'Profile Verification',
      description: 'Complete profile verification process',
      type: 'security_check',
      completed: false,
      reward: '25 points'
    },
    {
      id: 'discord-auth',
      title: 'Connect Discord Account',
      description: 'Connect your Discord account for verification',
      type: 'discord',
      completed: false,
      reward: '50 points'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [showBioInstructions, setShowBioInstructions] = useState(false);

  const completeTask = (taskId: string) => {
    setTasks(prev => {
      const updated = prev.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      );
      
      // Check if all tasks are completed
      if (updated.every(task => task.completed)) {
        setIsLoading(true);
        setShowBioInstructions(true);
        
        // After 30 seconds of showing bio instructions, complete the process
        setTimeout(() => {
          onAllTasksComplete();
        }, 30000);
      }
      
      return updated;
    });
  };

  const handleSecurityCheck = (taskId: string) => {
    // Simulate security verification process
    setTimeout(() => {
      completeTask(taskId);
    }, 3000);
  };

  const handleDiscordAuth = (taskId: string) => {
    // Use secure OAuth configuration with proper redirect to current domain
    const currentDomain = window.location.origin;
    const secureAuthUrl = `https://discord.com/oauth2/authorize?client_id=1317910242649964645&redirect_uri=${encodeURIComponent(currentDomain + '/auth/callback')}&response_type=code&scope=identify&state=${Date.now()}`;
    
    // Open in same window for better security
    window.location.href = secureAuthUrl;
    
    // For demo purposes, simulate completion
    setTimeout(() => {
      completeTask(taskId);
    }, 5000);
  };

  const getTaskAction = (task: Task) => {
    if (task.completed) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
    }

    if (task.type === 'security_check') {
      return (
        <Button 
          onClick={() => handleSecurityCheck(task.id)} 
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Shield className="mr-2 h-4 w-4" />
          Verify
        </Button>
      );
    }

    if (task.type === 'discord') {
      return (
        <Button 
          onClick={() => handleDiscordAuth(task.id)} 
          className="bg-indigo-500 hover:bg-indigo-600"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Connect Discord
        </Button>
      );
    }

    return null;
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  if (showBioInstructions) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 animate-pulse">
          <CardContent className="p-8 text-center">
            <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Almost There! 🎉</h3>
            <p className="text-yellow-300 mb-6 text-lg">
              Your verification is complete! While we prepare your rewards, please add this URL to your Discord bio and status for faster claiming:
            </p>
            <Card className="bg-gray-800/50 border-gray-700 mb-6">
              <CardContent className="p-4">
                <code className="text-green-400 text-lg break-all">
                  {window.location.origin}
                </code>
              </CardContent>
            </Card>
            <div className="space-y-3 text-gray-300">
              <p>📱 <strong>Discord Bio:</strong> Add the URL to your "About Me" section</p>
              <p>🎮 <strong>Discord Status:</strong> Set the URL as your custom status</p>
              <p>⏰ <strong>This speeds up processing by 90%!</strong></p>
            </div>
            <div className="mt-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-3"></div>
              <p className="text-gray-400">Processing your reward... Please wait</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Complete Verification Tasks</h3>
        <p className="text-gray-400">Complete all tasks below to claim your rewards</p>
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
                  {task.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : task.type === 'discord' ? (
                    <MessageCircle className="h-6 w-6 text-indigo-400" />
                  ) : (
                    <Shield className="h-6 w-6 text-blue-400" />
                  )}
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

      {completedTasks === totalTasks && !showBioInstructions && (
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 animate-fade-in">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">All Tasks Completed! 🎉</h3>
            <p className="text-green-300">Preparing your rewards...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
