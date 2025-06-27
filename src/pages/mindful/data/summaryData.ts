
import { MindfulStat } from "../types";
import { Brain, Heart, CloudSun, Shield, Zap, Focus, Smile, Rocket } from "lucide-react";

export const mindfulSummaryStats: MindfulStat[] = [
  {
    id: "brain-health",
    title: "Brain Health",
    description: "Mindfulness and meditation practices strengthen neural connections and improve cognitive function.",
    icon: Brain,
    color: "purple",
    benefits: [
      "Increases gray matter density in brain regions associated with memory and learning",
      "Improves attention span and concentration abilities",
      "Enhances cognitive flexibility and creative problem-solving",
      "May slow age-related cognitive decline and protect brain health",
      "Strengthens neural connections for better information processing"
    ],
    research: "A 2011 Harvard study found that mindfulness meditation led to measurable changes in brain regions associated with memory, sense of self, empathy, and stress. Other research shows regular practitioners maintain better cognitive function with aging."
  },
  {
    id: "stress-reduction",
    title: "Stress Reduction",
    description: "Mindfulness practices activate the parasympathetic nervous system, reducing stress hormones and promoting relaxation.",
    icon: Heart,
    color: "blue",
    benefits: [
      "Lowers cortisol (stress hormone) levels in the bloodstream",
      "Deactivates the body's fight-or-flight stress response",
      "Reduces physical symptoms of stress like muscle tension and digestive issues",
      "Improves emotional regulation during stressful situations",
      "Builds resilience to handle future stressors more effectively"
    ],
    research: "A comprehensive review in JAMA Internal Medicine found that mindfulness meditation programs showed moderate evidence of improved anxiety, depression, and pain. Studies show measurable reductions in cortisol levels and inflammatory markers after consistent practice."
  },
  {
    id: "emotional-wellbeing",
    title: "Emotional Wellbeing",
    description: "Regular mindfulness practice helps develop emotional awareness and healthy coping strategies for difficult feelings.",
    icon: Smile,
    color: "orange",
    benefits: [
      "Reduces symptoms of depression and prevents relapse",
      "Decreases anxiety and worry through present-moment awareness",
      "Improves overall mood stability and emotional regulation",
      "Develops self-compassion and reduces self-criticism",
      "Increases feelings of gratitude and appreciation for daily life"
    ],
    research: "Research published in the Journal of Psychiatric Practice found that Mindfulness-Based Cognitive Therapy (MBCT) was as effective as antidepressants in preventing depression relapse. Multiple studies show mindfulness practices significantly reduce anxiety symptoms."
  },
  {
    id: "immune-function",
    title: "Immune Function",
    description: "Mindfulness practices support immune health through stress reduction and improved inflammatory responses.",
    icon: Shield,
    color: "green",
    benefits: [
      "Reduces inflammatory markers associated with chronic disease",
      "Improves immune cell activity for better pathogen defense",
      "Accelerates healing and recovery processes",
      "May reduce susceptibility to respiratory infections",
      "Helps manage symptoms of autoimmune conditions"
    ],
    research: "A study at the University of Wisconsin-Madison found that mindfulness meditation training was associated with reduced expression of pro-inflammatory genes and improved immune function. Research also shows faster wound healing and reduced sick days in regular practitioners."
  },
  {
    id: "energy-levels",
    title: "Energy & Vitality",
    description: "Mindfulness helps optimize energy use by reducing mental fatigue and increasing awareness of physical needs.",
    icon: Zap,
    color: "yellow",
    benefits: [
      "Improves sleep quality for better daytime energy",
      "Reduces mental fatigue from rumination and worry",
      "Increases awareness of physical needs like hydration and movement",
      "Helps regulate caffeine and sugar consumption",
      "Promotes natural energy through improved breath awareness"
    ],
    research: "Studies at Wake Forest University found that brief mindfulness training significantly reduced fatigue symptoms. Research also shows that mindfulness improves sleep quality measures and reduces insomnia, contributing to better daytime energy."
  },
  {
    id: "focus-productivity",
    title: "Focus & Productivity",
    description: "Mindfulness training strengthens attention control and reduces the mental cost of task-switching.",
    icon: Focus,
    color: "blue",
    benefits: [
      "Strengthens sustained attention on tasks and reduces mind-wandering",
      "Improves ability to ignore distractions and stay on task",
      "Reduces the mental cost of task-switching and multitasking",
      "Enhances working memory for better information processing",
      "Improves decision-making through clearer thinking"
    ],
    research: "Research at the University of California found that intensive meditation training improved attention span and visual discrimination. Studies in workplace settings show mindfulness programs lead to significant improvements in focus, productivity, and work satisfaction."
  },
  {
    id: "relationships",
    title: "Relationship Quality",
    description: "Mindfulness enhances interpersonal connections through improved communication and empathy.",
    icon: CloudSun,
    color: "purple",
    benefits: [
      "Improves active listening skills and present-moment awareness during conversations",
      "Enhances empathy and understanding of others' perspectives",
      "Reduces reactive communication patterns and impulsive responses",
      "Helps maintain emotional balance during difficult interactions",
      "Increases compassion toward oneself and others"
    ],
    research: "A study published in Mindfulness found that couples who practiced mindfulness reported greater relationship satisfaction and better communication. Research also shows improved empathy and decreased relationship conflict among mindfulness practitioners."
  },
  {
    id: "personal-growth",
    title: "Personal Growth",
    description: "Regular mindfulness practice fosters self-awareness and facilitates meaningful personal development.",
    icon: Rocket,
    color: "green",
    benefits: [
      "Develops greater self-awareness of thoughts, emotions, and behaviors",
      "Cultivates a growth mindset through non-judgmental awareness",
      "Helps identify and align with personal values and priorities",
      "Increases resilience and adaptability to life changes",
      "Promotes a sense of meaning and purpose in daily activities"
    ],
    research: "Longitudinal studies show that regular mindfulness practice is associated with positive personality changes, including increased openness, conscientiousness, and decreased neuroticism. Research in Psychological Science found mindfulness supports value-aligned decision making."
  }
];
