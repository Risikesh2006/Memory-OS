"use client";

import { Camera, BookOpen, Star, Trophy, Heart, Music, Plane, Cpu } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "First Memory",
    date: "Jan 2024",
    content: "Uploaded your very first memory to Legacy OS — a photo from your college fest that sparked it all.",
    category: "Milestone",
    icon: Star,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "College Life",
    date: "Feb 2024",
    content: "Started building the College Life collection — 427 memories of late nights, friendships, and breakthroughs.",
    category: "Collection",
    icon: BookOpen,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "First Hackathon",
    date: "Mar 2024",
    content: "Built VisionShare with your team over 48 sleepless hours. Placed 2nd and made friends for life.",
    category: "Achievement",
    icon: Cpu,
    relatedIds: [2, 4],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 4,
    title: "Travels",
    date: "Apr 2024",
    content: "Weekend trip to Coorg — mountains, coffee plantations, and the first time you felt completely free.",
    category: "Travel",
    icon: Plane,
    relatedIds: [3, 5],
    status: "completed" as const,
    energy: 80,
  },
  {
    id: 5,
    title: "Milestones",
    date: "May 2024",
    content: "Completed 74 personal milestones — from finishing your first novel to learning to cook a full meal.",
    category: "Growth",
    icon: Trophy,
    relatedIds: [4, 6],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 6,
    title: "Moments",
    date: "Jun 2024",
    content: "Captured 198 photos of moments that took your breath away — sunsets, laughs, and quiet mornings.",
    category: "Memories",
    icon: Camera,
    relatedIds: [5, 7],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 7,
    title: "Connections",
    date: "Jul 2024",
    content: "The people who shaped you — family, friends, mentors. Legacy OS helps you remember every shared moment.",
    category: "People",
    icon: Heart,
    relatedIds: [6, 8],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 8,
    title: "Soundtrack",
    date: "Aug 2024",
    content: "Every era of your life has a soundtrack. Your Legacy OS vault links songs to memories automatically.",
    category: "Music",
    icon: Music,
    relatedIds: [7, 1],
    status: "pending" as const,
    energy: 40,
  },
];

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Legacy OS</span>
        </div>
        <div className="text-center">
          <h1 className="text-white font-black text-2xl tracking-tight">Your Timeline</h1>
          <p className="text-white/40 text-xs font-medium tracking-widest uppercase mt-0.5">Orbital Memory View</p>
        </div>
        <div className="text-white/30 text-xs font-mono tracking-widest">
          {timelineData.length} nodes
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-center">
        <p className="text-white/30 text-xs tracking-widest uppercase">Click a node to explore · Click orbit to dismiss</p>
      </div>

      <RadialOrbitalTimeline timelineData={timelineData} />
    </div>
  );
}
