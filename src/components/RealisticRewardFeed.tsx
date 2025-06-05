
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Zap } from "lucide-react";

interface RewardClaim {
  id: string;
  username: string;
  reward: string;
  type: 'nitro' | 'robux';
  timestamp: Date;
}

export const RealisticRewardFeed = () => {
  const [claims, setClaims] = useState<RewardClaim[]>([]);

  const realisticUsernames = [
    "GamerPro2024", "NoobSlayer", "DiscordFan", "RobloxMaster", "Player456",
    "CoolGamer", "NitroLover", "RobuxHunter", "GameDev99", "ProGamer2024",
    "ShadowNinja", "FireDragon", "IceQueen", "ThunderBolt", "StarWars",
    "MinecraftPro", "FortniteKing", "ApexLegend", "ValorantAce", "CSGOPro",
    "DarkKnight", "BluePhoenix", "RedWolf", "GreenArrow", "PurpleLion",
    "GoldenEagle", "SilverFox", "BronzeShield", "IronFist", "DiamondSword",
    "EmeraldGem", "RubyRose", "SapphireBlue", "TopazYellow", "OnyxBlack",
    "CrystalClear", "MysticMage", "ElementalForce", "CosmicRay", "NeonLight",
    "QuantumLeap", "CyberPunk", "TechWizard", "CodeMaster", "PixelArt",
    "RetroGamer", "ModernWarfare", "FutureSoldier", "SpaceExplorer", "TimeTravel",
    "DimensionHop", "ParallelWorld", "AlternateReality", "VirtualHero", "DigitalNomad",
    "CloudWalker", "SkyDiver", "OceanRider", "MountainClimber", "DesertStorm",
    "JungleTiger", "ArcticWolf", "VolcanoFire", "EarthQuake", "WindStorm",
    "LightningStrike", "RainDrop", "SnowFlake", "SunShine", "MoonLight",
    "StarGazer", "PlanetHopper", "GalaxyRanger", "UniverseExplorer", "CosmosTraveler",
    "NebulaWanderer", "MeteorShower", "CometTail", "AsteroidBelt", "BlackHole",
    "WhiteDwarf", "RedGiant", "BlueSupergiant", "NeutronStar", "Pulsar",
    "Quasar", "Supernova", "BigBang", "DarkMatter", "DarkEnergy",
    "StringTheory", "QuantumPhysics", "Relativity", "Gravity", "Electromagnetism",
    "WeakForce", "StrongForce", "Higgs", "Boson", "Fermion",
    "Lepton", "Quark", "Gluon", "Photon", "Electron",
    "Proton", "Neutron", "Atom", "Molecule", "Compound",
    "Element", "Periodic", "Chemistry", "Biology", "Physics",
    "Mathematics", "Geometry", "Algebra", "Calculus", "Statistics",
    "Probability", "Logic", "Algorithm", "DataStructure", "Programming",
    "SoftwareEngineer", "WebDeveloper", "AppDeveloper", "GameDeveloper", "AIResearcher",
    "MachineLearning", "DeepLearning", "NeuralNetwork", "BigData", "BlockChain",
    "CryptoCurrency", "Bitcoin", "Ethereum", "NFT", "Web3",
    "Metaverse", "VirtualReality", "AugmentedReality", "MixedReality", "ExtendedReality",
    "ArtificialIntelligence", "RoboticsEngineer", "CyberSecurity", "CloudComputing", "EdgeComputing",
    "QuantumComputing", "IoT", "5G", "Robotics", "Automation",
    "SmartHome", "SmartCity", "SmartCar", "ElectricVehicle", "SelfDriving",
    "RenewableEnergy", "SolarPower", "WindPower", "HydroPower", "NuclearPower",
    "CleanEnergy", "GreenTech", "Sustainability", "ClimateChange", "Environment",
    "Conservation", "Recycling", "ZeroWaste", "CircularEconomy", "EcoFriendly",
    "OrganicFood", "HealthyLifestyle", "Fitness", "Yoga", "Meditation",
    "Mindfulness", "WellBeing", "MentalHealth", "PositiveVibes", "GoodEnergy",
    "SuccessMindset", "MotivationDaily", "InspiredLife", "DreamBig", "AchieveGoals",
    "NeverGiveUp", "KeepGoing", "StayStrong", "BelieveInYourself", "YouCanDoIt",
    "PositiveThinking", "GoodVibesOnly", "HappyLife", "JoyfulMoments", "PeacefulMind",
    "LoveLife", "GratefulHeart", "BlessedLife", "LuckyOne", "FortunateSoul",
    "WinnerMindset", "ChampionSpirit", "VictoryDance", "SuccessStory", "LegendInMaking"
  ];

  const rewardTypes = [
    { reward: "Discord Nitro Classic (1 Month)", type: 'nitro' as const },
    { reward: "Discord Nitro Classic (3 Months)", type: 'nitro' as const },
    { reward: "Discord Nitro Boost (1 Month)", type: 'nitro' as const },
    { reward: "Discord Nitro Boost (3 Months)", type: 'nitro' as const },
    { reward: "400 Robux", type: 'robux' as const },
    { reward: "800 Robux", type: 'robux' as const },
    { reward: "1000 Robux", type: 'robux' as const },
    { reward: "1700 Robux", type: 'robux' as const },
    { reward: "2000 Robux", type: 'robux' as const },
  ];

  useEffect(() => {
    // Initial claims with varied timestamps
    const initialClaims: RewardClaim[] = Array.from({ length: 8 }, (_, i) => ({
      id: `initial-${i}`,
      username: realisticUsernames[Math.floor(Math.random() * realisticUsernames.length)],
      ...rewardTypes[Math.floor(Math.random() * rewardTypes.length)],
      timestamp: new Date(Date.now() - Math.random() * 3600000), // Last hour
    }));

    setClaims(initialClaims);

    // Add new claims every 15-45 seconds with realistic variation
    const interval = setInterval(() => {
      const newClaim: RewardClaim = {
        id: `claim-${Date.now()}`,
        username: realisticUsernames[Math.floor(Math.random() * realisticUsernames.length)],
        ...rewardTypes[Math.floor(Math.random() * rewardTypes.length)],
        timestamp: new Date(),
      };

      setClaims(prev => [newClaim, ...prev.slice(0, 11)]); // Keep 12 most recent
    }, Math.random() * 30000 + 15000); // 15-45 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-3">
        {claims.map((claim, index) => (
          <Card 
            key={claim.id}
            className={`bg-gray-800/30 border-gray-700 transition-all duration-500 ${
              index === 0 ? 'animate-fade-in scale-100' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {claim.type === 'nitro' ? (
                      <Gift className="h-5 w-5 text-indigo-400" />
                    ) : (
                      <Zap className="h-5 w-5 text-green-400" />
                    )}
                    <span className="text-white font-medium">{claim.username}</span>
                  </div>
                  <span className="text-gray-400">claimed</span>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      claim.type === 'nitro' 
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
                        : 'bg-green-500/20 text-green-400 border-green-500/30'
                    }`}
                  >
                    {claim.reward}
                  </Badge>
                </div>
                <span className="text-sm text-gray-500">{formatTimeAgo(claim.timestamp)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
