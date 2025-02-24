"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Medal, Leaf, Train, Bus, PersonStanding, Award, Star, TreePine } from 'lucide-react';

// Achievement definitions with progress tracking
const ACHIEVEMENTS = [
  {
    id: 1,
    title: "Carbon Crusader",
    description: "Save your first 10kg of CO₂ by using public transport",
    icon: <Leaf className="w-8 h-8 text-primary" />,
    progress: 80,
    target: 10,
    current: 8,
    unlocked: true
  },
  {
    id: 2,
    title: "Metro Master",
    description: "Complete 50 trips using the metro",
    icon: <Train className="w-8 h-8 text-primary" />,
    progress: 60,
    target: 50,
    current: 30,
    unlocked: true
  },
  {
    id: 3,
    title: "Bus Pioneer",
    description: "Travel 100km by bus",
    icon: <Bus className="w-8 h-8 text-primary" />,
    progress: 45,
    target: 100,
    current: 45,
    unlocked: false
  },
  {
    id: 4,
    title: "Walking Warrior",
    description: "Walk 50km instead of driving",
    icon: <PersonStanding className="w-8 h-8 text-primary" />,
    progress: 20,
    target: 50,
    current: 10,
    unlocked: false
  },
  {
    id: 5,
    title: "Green Legend",
    description: "Save 1000kg of CO₂ in total",
    icon: <Award className="w-8 h-8 text-primary" />,
    progress: 30,
    target: 1000,
    current: 300,
    unlocked: false
  }
];

const MILESTONES = [
  {
    level: "Bronze",
    icon: <Medal className="w-6 h-6 text-orange-400" />,
    requirement: "Save 100kg CO₂",
    achieved: true
  },
  {
    level: "Silver",
    icon: <Medal className="w-6 h-6 text-gray-400" />,
    requirement: "Save 500kg CO₂",
    achieved: false
  },
  {
    level: "Gold",
    icon: <Medal className="w-6 h-6 text-yellow-400" />,
    requirement: "Save 1000kg CO₂",
    achieved: false
  }
];

function AchievementCard({ achievement }: { achievement: typeof ACHIEVEMENTS[number] }) {
  return (
    <Card className={`${achievement.unlocked ? 'bg-card' : 'bg-secondary/30'} transition-all hover:scale-[1.02]`}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        {achievement.icon}
        <CardTitle className="ml-4 text-lg font-medium">
          {achievement.title}
          {achievement.unlocked && (
            <Badge className="ml-2 bg-primary" variant="secondary">
              <Star className="w-3 h-3 mr-1" />
              Unlocked
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
        <div className="space-y-2">
          <Progress value={achievement.progress} className="h-2" />
          <p className="text-sm text-right text-muted-foreground">
            {achievement.current} / {achievement.target}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-card-foreground">Green Transport Achievements</h1>
          <div className="flex items-center space-x-2">
            <TreePine className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">Level 12</span>
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {MILESTONES.map((milestone) => (
            <Card key={milestone.level} className={milestone.achieved ? 'bg-card' : 'bg-secondary/30'}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  {milestone.icon}
                  <div>
                    <h3 className="font-medium">{milestone.level}</h3>
                    <p className="text-sm text-muted-foreground">{milestone.requirement}</p>
                  </div>
                </div>
                {milestone.achieved && (
                  <Star className="w-5 h-5 text-primary" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACHIEVEMENTS.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>

        {/* Stats Summary */}
        <Card className="bg-card mt-8">
          <CardHeader>
            <CardTitle>Your Impact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total CO₂ Saved</p>
              <p className="text-2xl font-bold text-primary">383 kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Green Trips Taken</p>
              <p className="text-2xl font-bold">127</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Achievement Progress</p>
              <p className="text-2xl font-bold">{ACHIEVEMENTS.filter(a => a.unlocked).length} / {ACHIEVEMENTS.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}