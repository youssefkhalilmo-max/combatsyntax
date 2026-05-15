export interface Technique {
  id: string;
  name: string;
  discipline: "Striking" | "BJJ" | "Wrestling" | "Clinch";
  stance: "Orthodox" | "Southpaw" | "Both";
  category: "Submissions" | "Takedowns" | "Kicks" | "Punches" | "Elbows" | "Knees" | "Clinch Work" | "Ground Work";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  imageUrl: string;
  technicalBreakdown: string;
  relatedTechniqueIds: string[];
  videoUrl?: string;
}

export const techniques: Technique[] = [
  {
    id: "1",
    name: "Teep Kick",
    discipline: "Striking",
    stance: "Both",
    category: "Kicks",
    difficulty: "Beginner",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Teep+Kick",
    technicalBreakdown: "The teep (push kick) is a fundamental Muay Thai technique used to maintain distance and off-balance opponents. Shift weight to the rear leg, extend the lead leg with the foot flexed, and push through the target using the hips.",
    relatedTechniqueIds: ["2", "3"]
  },
  {
    id: "2",
    name: "Roundhouse Kick",
    discipline: "Striking",
    stance: "Both",
    category: "Kicks",
    difficulty: "Intermediate",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Roundhouse+Kick",
    technicalBreakdown: "Pivot on the supporting foot while rotating the hips fully. Swing the kicking leg in a circular motion, striking with the shin. Keep the hands up throughout the motion for defense.",
    relatedTechniqueIds: ["1", "4"]
  },
  {
    id: "3",
    name: "Jab",
    discipline: "Striking",
    stance: "Both",
    category: "Punches",
    difficulty: "Beginner",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Jab",
    technicalBreakdown: "The jab is the most important punch in combat sports. Extend the lead hand straight from guard position, rotating the fist at impact. Keep the rear hand protecting the chin and return quickly to guard.",
    relatedTechniqueIds: ["4", "5"]
  },
  {
    id: "4",
    name: "Cross",
    discipline: "Striking",
    stance: "Both",
    category: "Punches",
    difficulty: "Beginner",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Cross",
    technicalBreakdown: "The cross (straight right) is a power punch thrown from the rear hand. Rotate the rear hip and shoulder forward while extending the arm. Pivot on the rear foot to generate maximum power.",
    relatedTechniqueIds: ["3", "6"]
  },
  {
    id: "5",
    name: "Rear Naked Choke",
    discipline: "BJJ",
    stance: "Both",
    category: "Submissions",
    difficulty: "Intermediate",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Rear+Naked+Choke",
    technicalBreakdown: "Secure back control with hooks in. Slide the choking arm under their chin, grab your own bicep, and place the other hand behind their head. Squeeze by expanding your chest and pulling arms together.",
    relatedTechniqueIds: ["6", "7"]
  },
  {
    id: "6",
    name: "Armbar",
    discipline: "BJJ",
    stance: "Both",
    category: "Submissions",
    difficulty: "Intermediate",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Armbar",
    technicalBreakdown: "Control the opponent's arm, sit up and place your leg over their head. Fall back while trapping the arm between your legs. Squeeze your knees together and lift hips to apply pressure to the elbow joint.",
    relatedTechniqueIds: ["5", "8"]
  },
  {
    id: "7",
    name: "Triangle Choke",
    discipline: "BJJ",
    stance: "Both",
    category: "Submissions",
    difficulty: "Advanced",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Triangle+Choke",
    technicalBreakdown: "From guard, control one arm and throw your leg over their shoulder. Lock the figure-four with your legs, pulling their head down. Squeeze knees together and cut the angle to finish.",
    relatedTechniqueIds: ["5", "6"]
  },
  {
    id: "8",
    name: "Double Leg Takedown",
    discipline: "Wrestling",
    stance: "Both",
    category: "Takedowns",
    difficulty: "Intermediate",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Double+Leg+Takedown",
    technicalBreakdown: "Level change by dropping your hips and penetrating with your head to the side. Wrap both arms around their legs, lift while driving forward, and trip them to the mat.",
    relatedTechniqueIds: ["9", "10"]
  },
  {
    id: "9",
    name: "Single Leg Takedown",
    discipline: "Wrestling",
    stance: "Both",
    category: "Takedowns",
    difficulty: "Beginner",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Single+Leg+Takedown",
    technicalBreakdown: "Shoot in on one leg, grabbing behind the knee. Cup the heel with your other hand. Stand up while lifting the leg and trip them to complete the takedown.",
    relatedTechniqueIds: ["8", "10"]
  },
  {
    id: "10",
    name: "Thai Clinch",
    discipline: "Clinch",
    stance: "Both",
    category: "Clinch Work",
    difficulty: "Intermediate",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Thai+Clinch",
    technicalBreakdown: "Secure double-collar tie by cupping both hands behind their neck. Pull their head down while controlling posture. Use the clinch to off-balance and set up knee strikes.",
    relatedTechniqueIds: ["11", "12"]
  },
  {
    id: "11",
    name: "Knee to the Body",
    discipline: "Clinch",
    stance: "Both",
    category: "Knees",
    difficulty: "Beginner",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Knee+to+Body",
    technicalBreakdown: "From the clinch, pull their head down while driving your knee upward. Rise on your toes and thrust your hips forward to generate power. Aim for the solar plexus or liver.",
    relatedTechniqueIds: ["10", "12"]
  },
  {
    id: "12",
    name: "Elbow Strike",
    discipline: "Striking",
    stance: "Both",
    category: "Elbows",
    difficulty: "Intermediate",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Elbow+Strike",
    technicalBreakdown: "Raise the elbow to shoulder height, then whip it downward or horizontally depending on the angle. Keep the arm tight to the body and rotate the hips for maximum impact.",
    relatedTechniqueIds: ["10", "11"]
  },
  {
    id: "13",
    name: "Guillotine Choke",
    discipline: "BJJ",
    stance: "Both",
    category: "Submissions",
    difficulty: "Beginner",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Guillotine+Choke",
    technicalBreakdown: "As opponent shoots, wrap your arm around their neck with their head under your armpit. Grab your own hand and squeeze by lifting your elbows and closing the guard.",
    relatedTechniqueIds: ["5", "6"]
  },
  {
    id: "14",
    name: "Superman Punch",
    discipline: "Striking",
    stance: "Orthodox",
    category: "Punches",
    difficulty: "Advanced",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Superman+Punch",
    technicalBreakdown: "Fake a leg kick to lower their guard. As they react, leap forward with the rear leg while throwing a cross. The momentum from the leap adds significant power to the strike.",
    relatedTechniqueIds: ["3", "4"]
  },
  {
    id: "15",
    name: "Scissor Sweep",
    discipline: "BJJ",
    stance: "Both",
    category: "Ground Work",
    difficulty: "Intermediate",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Scissor+Sweep",
    technicalBreakdown: "From closed guard, control one sleeve and opposite lapel. Open your guard and place one leg across their stomach while hooking their other leg with your other foot. Sweep them by scissoring your legs.",
    relatedTechniqueIds: ["6", "7"]
  },
  {
    id: "16",
    name: "Spinning Back Kick",
    discipline: "Striking",
    stance: "Both",
    category: "Kicks",
    difficulty: "Advanced",
    imageUrl: "https://placehold.co/800x600/1a1a1a/00d4ff?text=Spinning+Back+Kick",
    technicalBreakdown: "Turn your back to the target while looking over your shoulder. Pivot completely and thrust the rear leg backward, striking with the heel. The rotation generates tremendous power.",
    relatedTechniqueIds: ["1", "2"]
  }
];

export const disciplines = ["Striking", "BJJ", "Wrestling", "Clinch"] as const;
export const stances = ["Orthodox", "Southpaw", "Both"] as const;
export const categories = ["Submissions", "Takedowns", "Kicks", "Punches", "Elbows", "Knees", "Clinch Work", "Ground Work"] as const;
export const difficulties = ["Beginner", "Intermediate", "Advanced"] as const;
