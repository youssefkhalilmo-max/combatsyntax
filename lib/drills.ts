export interface Drill {
  id: string;
  name: string;
  category: "Striking" | "Grappling" | "Conditioning" | "Sparring" | "Defense";
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  imageUrl: string;
  videoUrl?: string;
}

export const drills: Drill[] = [
  {
    id: "1",
    name: "Shadow Boxing Combo",
    category: "Striking",
    duration: "3 rounds x 3 min",
    difficulty: "Beginner",
    description: "Practice basic striking combinations: jab-cross, jab-cross-hook, and jab-cross-hook-upper. Focus on proper form and footwork.",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Shadow+Boxing",
  },
  {
    id: "2",
    name: "Heavy Bag Power",
    category: "Striking",
    duration: "5 rounds x 3 min",
    difficulty: "Intermediate",
    description: "Power striking drills on heavy bag focusing on generating power from hips and proper rotation.",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Heavy+Bag",
  },
  {
    id: "3",
    name: "Sprawl Defense",
    category: "Defense",
    duration: "10 min",
    difficulty: "Beginner",
    description: "Practice sprawling technique to defend against takedown attempts. Focus on quick reaction and proper hip placement.",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Sprawl",
  },
  {
    id: "4",
    name: "Guard Passing",
    category: "Grappling",
    duration: "15 min",
    difficulty: "Advanced",
    description: "Advanced guard passing drills including knee cut, torreando, and pressure passing techniques.",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Guard+Passing",
  },
  {
    id: "5",
    name: "HIIT Circuit",
    category: "Conditioning",
    duration: "20 min",
    difficulty: "Intermediate",
    description: "High-intensity interval training circuit with burpees, mountain climbers, and MMA-specific movements.",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=HIIT+Circuit",
  },
  {
    id: "6",
    name: "Light Sparring",
    category: "Sparring",
    duration: "3 rounds x 5 min",
    difficulty: "Intermediate",
    description: "Technical sparring focusing on timing and distance without full power. Great for practicing combinations.",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Light+Sparring",
  },
  {
    id: "7",
    name: "Clinch Work",
    category: "Striking",
    duration: "10 min",
    difficulty: "Intermediate",
    description: "Practice clinch positions, knees, and elbow strikes from the clinch. Focus on control and balance.",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Clinch+Work",
  },
  {
    id: "8",
    name: "Submission Defense",
    category: "Defense",
    duration: "15 min",
    difficulty: "Advanced",
    description: "Defensive drills for common submissions including armbar, triangle, and guillotine escapes.",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Submission+Defense",
  },
];

export const drillCategories = ["Striking", "Grappling", "Conditioning", "Sparring", "Defense"] as const;
export const drillDifficulties = ["Beginner", "Intermediate", "Advanced"] as const;
