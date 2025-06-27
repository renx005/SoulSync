
import { MindfulnessExerciseType } from "../types";

export const mindfulnessExercises: MindfulnessExerciseType[] = [
  {
    id: "body-scan",
    name: "Body Scan Meditation",
    description: "A progressive practice of bringing attention to each part of the body to release tension and cultivate body awareness.",
    duration: 10,
    focus: "Body awareness",
    color: "blue",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable position lying down or sitting. Close your eyes and take a few deep breaths to settle in. Feel the weight of your body against the surface beneath you.",
        duration: 60
      },
      {
        title: "Feet & Legs",
        instruction: "Bring your attention to your feet. Notice any sensations - warmth, coolness, tingling, or pressure. There's no need to change anything, just observe. Then gradually move your attention up through your legs, noticing sensations in your calves, knees, and thighs.",
        duration: 120
      },
      {
        title: "Torso",
        instruction: "Shift your awareness to your abdomen, noticing the gentle rise and fall with each breath. Continue up to your chest, back, and shoulders. Are there areas of tension or relaxation? Simply observe without judgment.",
        duration: 120
      },
      {
        title: "Arms & Hands",
        instruction: "Move your attention down your arms to your hands. Notice any sensations in your shoulders, upper arms, elbows, forearms, wrists, and finally your hands and fingers. Observe any tingling, warmth, or other sensations that arise.",
        duration: 90
      },
      {
        title: "Neck & Head",
        instruction: "Bring awareness to your neck, throat, and head. Notice your jaw, mouth, nose, eyes, ears, and scalp. If you find tension anywhere, acknowledge it with kindness and allow it to soften with your breath.",
        duration: 90
      },
      {
        title: "Whole Body",
        instruction: "Now expand your awareness to sense your entire body as a whole. Feel the boundary between your body and the space around it. Notice the sense of your body as a complete, integrated whole, breathing and alive.",
        duration: 60
      },
      {
        title: "Closing",
        instruction: "Slowly deepen your breath and gently wiggle your fingers and toes. When you feel ready, slowly open your eyes, carrying this sense of body awareness with you into the rest of your day.",
        duration: 60
      }
    ]
  },
  {
    id: "progressive-muscle-relaxation",
    name: "Progressive Muscle Relaxation",
    description: "Systematically tense and release muscle groups to reduce physical tension and stress, improving overall relaxation response.",
    duration: 12,
    focus: "Tension release",
    color: "green",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable position sitting or lying down. Take a few deep breaths to begin. Allow your body to settle into the surface beneath you. Loosen any tight clothing and remove glasses if you're wearing them.",
        duration: 60
      },
      {
        title: "Hands & Arms",
        instruction: "Make a tight fist with both hands, squeezing as hard as you can. Notice the tension in your hands and forearms. Hold for 5 seconds... and release completely. Feel the difference between tension and relaxation. Notice the sensation of warmth and heaviness as the muscles relax.",
        duration: 90
      },
      {
        title: "Upper Arms & Shoulders",
        instruction: "Bend your elbows and tense your biceps as if you're showing off your muscles. Hold for 5 seconds... and release, letting your arms rest comfortably. Notice the pleasant feeling of relaxation spreading through your arms.",
        duration: 90
      },
      {
        title: "Shoulders & Neck",
        instruction: "Raise your shoulders toward your ears, creating tension. Hold for 5 seconds... and release, letting your shoulders drop and relax completely. Feel the tension draining away from your neck and shoulders.",
        duration: 90
      },
      {
        title: "Face",
        instruction: "Scrunch your facial muscles, squeezing your eyes shut, wrinkling your nose, and clenching your jaw. Hold for 5 seconds... and release, feeling your face become smooth and relaxed. Notice the sensation of the muscles in your face softening.",
        duration: 90
      },
      {
        title: "Chest & Abdomen",
        instruction: "Take a deep breath, filling your lungs completely, and tense your chest and abdomen. Hold for 5 seconds... and slowly exhale, releasing all tension. Feel your torso softening with each breath.",
        duration: 90
      },
      {
        title: "Back",
        instruction: "Gently arch your back, creating tension along your spine. Hold for 5 seconds... and release, allowing your back to rest comfortably against the surface beneath you. Notice the relaxation spreading across your back.",
        duration: 90
      },
      {
        title: "Legs & Feet",
        instruction: "Extend your legs, point your toes, and tense all the muscles in your legs. Hold for 5 seconds... and release, letting your legs fall gently back into place. Feel the heaviness and warmth as your legs relax completely.",
        duration: 90
      },
      {
        title: "Full Body Awareness",
        instruction: "Now focus on your entire body, scanning from head to toe. Notice the pleasant sensations of relaxation throughout. If you find any remaining areas of tension, breathe into them and allow them to soften.",
        duration: 90
      },
      {
        title: "Closing",
        instruction: "Lie or sit quietly, enjoying this state of deep relaxation. Take a moment to appreciate how different your body feels now compared to when you started. When you're ready, slowly reawaken your body by wiggling fingers and toes, stretching gently, and opening your eyes.",
        duration: 60
      }
    ]
  },
  {
    id: "mindful-breathing",
    name: "Mindful Breathing",
    description: "A foundational practice of bringing full attention to the physical sensations of breathing, helping to anchor you in the present moment.",
    duration: 5,
    focus: "Breath",
    color: "purple",
    steps: [
      {
        title: "Getting Settled",
        instruction: "Find a comfortable seated position with your back straight but not rigid. Rest your hands on your legs and gently close your eyes or lower your gaze. Take a moment to notice how your body feels right now.",
        duration: 45
      },
      {
        title: "Noticing Your Breath",
        instruction: "Bring your attention to your breathing. Don't try to change it - simply notice the natural rhythm. You might feel the air moving through your nostrils, the rise and fall of your chest, or the expansion of your abdomen. Choose one place to focus on.",
        duration: 60
      },
      {
        title: "Following the Breath",
        instruction: "Follow the complete cycle of each breath. The beginning of the inhale... the middle... and the end. Then the beginning of the exhale... the middle... and the end. Just riding the waves of your breath with full awareness.",
        duration: 90
      },
      {
        title: "Counting Breaths",
        instruction: "If it helps, try counting your breaths. Count 'one' on the inhale, 'two' on the exhale, and so on up to ten. Then start again at one. This helps keep your mind focused on the breath.",
        duration: 60
      },
      {
        title: "Returning to the Breath",
        instruction: "When your mind wanders, gently recognize that it has wandered, and kindly bring your attention back to your breathing. This is the essence of the practice - noticing when your attention has drifted and returning to the breath without judgment.",
        duration: 90
      },
      {
        title: "Expanding Awareness",
        instruction: "While maintaining awareness of your breath, expand your attention to include sensations in your whole body. Notice how your entire body subtly moves with each breath, like waves on the ocean.",
        duration: 60
      },
      {
        title: "Closing the Practice",
        instruction: "Gradually broaden your awareness to include the sounds around you. Take a deeper breath, inviting energy and alertness. When you're ready, gently open your eyes, carrying this mindful awareness with you.",
        duration: 45
      }
    ]
  },
  {
    id: "mindful-awareness",
    name: "Mindful Awareness Practice",
    description: "Develop present-moment awareness through the methodical observation of sensory experiences, thoughts, and emotions.",
    duration: 8,
    focus: "Sensory awareness",
    color: "blue",
    steps: [
      {
        title: "Grounding",
        instruction: "Sit comfortably and take a few deep breaths. Feel the weight of your body against the chair or floor. Notice the points of contact where your body touches the surface beneath you. Let yourself be fully supported.",
        duration: 45
      },
      {
        title: "Sound Awareness",
        instruction: "Open your awareness to sounds. Notice nearby sounds, distant sounds, and the quality of silence between sounds. There's no need to identify or name them, just experience them directly as patterns of sensation arising in your awareness.",
        duration: 75
      },
      {
        title: "Body Sensations",
        instruction: "Shift your attention to physical sensations. Notice temperature, tingling, pulsing, pressure, or any other sensations present in your body right now. Observe how these sensations naturally change and shift, moment by moment.",
        duration: 75
      },
      {
        title: "Breath Awareness",
        instruction: "Bring attention to your breathing. Feel the sensations of air moving in and out. Notice the rise and fall of your abdomen or chest, the feeling of air at your nostrils. Use the breath as an anchor for your awareness.",
        duration: 60
      },
      {
        title: "Thought Observation",
        instruction: "Now notice your thoughts. Watch them arise, exist for a moment, and pass away, like clouds moving across the sky. Try not to get caught up in any particular thought - just observe them coming and going, without judgment.",
        duration: 90
      },
      {
        title: "Emotional Awareness",
        instruction: "Become aware of any emotions present. What does this emotion feel like in your body? Is there tension, warmth, heaviness, or lightness? Notice without judgment, allowing all emotions to be as they are, neither pushing them away nor holding onto them.",
        duration: 90
      },
      {
        title: "Open Awareness",
        instruction: "Now expand to open awareness. Allow whatever is most prominent in your experience - sounds, sensations, thoughts, or emotions - to naturally enter and leave your awareness. Rest in this spacious awareness that holds all experience.",
        duration: 90
      },
      {
        title: "Closing",
        instruction: "Slowly bring your attention back to your breathing. Take a few deep breaths and, when you're ready, gently open your eyes. See if you can maintain this quality of mindful awareness as you transition back to your day.",
        duration: 45
      }
    ]
  },
  {
    id: "present-moment",
    name: "Present Moment Grounding",
    description: "A short, accessible practice to quickly anchor yourself in the present moment anytime, anywhere, especially during stressful situations.",
    duration: 3,
    focus: "Present moment",
    color: "orange",
    steps: [
      {
        title: "Pause",
        instruction: "Wherever you are, whatever you're doing, just pause. Take a conscious break from autopilot. Set an intention to be fully present for the next few minutes.",
        duration: 15
      },
      {
        title: "Three Conscious Breaths",
        instruction: "Take three slow, deep breaths. Feel the full sensation of each inhale and exhale. Let each breath help you arrive more fully in the present moment.",
        duration: 30
      },
      {
        title: "Five Senses Check-in",
        instruction: "Notice 5 things you can see around you, observing details and colors. Then acknowledge 4 things you can feel (like the texture of your clothing or the surface beneath you). Next, notice 3 things you can hear. Then 2 things you can smell (or simply notice your breath). Finally, note 1 thing you can taste, or the sensation in your mouth.",
        duration: 90
      },
      {
        title: "Body Scan",
        instruction: "Quickly scan through your body from head to toe. Notice any areas of tension and allow them to soften with your awareness. Feel your feet on the ground, grounding you to the present moment.",
        duration: 45
      },
      {
        title: "Integration",
        instruction: "Take one more deep breath and set an intention to carry this present-moment awareness into your next activity. Remind yourself that you can return to this practice anytime you need to center yourself.",
        duration: 30
      }
    ]
  },
  {
    id: "loving-kindness",
    name: "Loving Kindness Meditation",
    description: "Cultivate positive emotions and compassion toward yourself and others through this heart-centered practice of well-wishing.",
    duration: 10,
    focus: "Compassion",
    color: "purple",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable position and take a few deep breaths to settle in. Place your hands over your heart if that feels comfortable. Bring a gentle smile to your face, even if it feels a bit artificial at first.",
        duration: 45
      },
      {
        title: "Self-Kindness",
        instruction: "Bring to mind an image of yourself. Silently repeat these phrases, directing them to yourself with sincerity: 'May I be safe and protected. May I be healthy and strong. May I be happy and peaceful. May I live with ease.' Feel the intention behind the words, allowing warmth to develop in your heart.",
        duration: 120
      },
      {
        title: "Benefactor",
        instruction: "Now bring to mind someone who has been kind to you - someone who makes you smile just thinking about them. Direct the same wishes to them: 'May you be safe and protected. May you be healthy and strong. May you be happy and peaceful. May you live with ease.' Feel the natural gratitude and goodwill flowing toward this person.",
        duration: 120
      },
      {
        title: "Beloved Friend",
        instruction: "Bring to mind a close friend or family member whom you care deeply about. Send them the same loving wishes, feeling the warmth in your heart expand as you do so. Notice how it feels to wish well for someone you love.",
        duration: 90
      },
      {
        title: "Neutral Person",
        instruction: "Bring to mind someone you neither like nor dislike - perhaps someone you see regularly but don't know well, like a store clerk or neighbor. Send them the same wishes for well-being, recognizing that like you, they wish to be happy and free from suffering.",
        duration: 90
      },
      {
        title: "Difficult Person",
        instruction: "Now, if you feel ready, bring to mind someone challenging in your life. Remember they also wish to be happy and free from suffering, even if their actions are unskillful. Send them the same wishes, even if it feels difficult. If this feels too challenging, return to sending loving-kindness to yourself or a benefactor.",
        duration: 90
      },
      {
        title: "All Beings",
        instruction: "Finally, expand your awareness to include all beings everywhere. 'May all beings be safe and protected. May all beings be healthy and strong. May all beings be happy and peaceful. May all beings live with ease.' Feel your heart opening to embrace all life with care and kindness.",
        duration: 90
      },
      {
        title: "Closing",
        instruction: "Return your awareness to your body and breath. Notice how you feel now compared to when you started. Carry this sense of connection and goodwill with you as you return to your day. When you're ready, slowly open your eyes.",
        duration: 45
      }
    ]
  },
  {
    id: "gratitude-practice",
    name: "Gratitude Meditation",
    description: "Develop appreciation for the positive aspects of life through conscious reflection on what you're thankful for.",
    duration: 7,
    focus: "Appreciation",
    color: "green",
    steps: [
      {
        title: "Settling In",
        instruction: "Find a comfortable position and take several deep breaths. Allow your body to relax and your mind to become calm. Set an intention to open yourself to feelings of gratitude and appreciation.",
        duration: 45
      },
      {
        title: "Simple Pleasures",
        instruction: "Bring to mind something simple that you often take for granted - clean water, electricity, the comfort of your bed, or the beauty of nature. Reflect on how this enriches your life and feel a sense of gratitude for its presence.",
        duration: 60
      },
      {
        title: "Body Gratitude",
        instruction: "Shift your awareness to your body. Consider the incredible functions it performs without conscious effort - your heart beating, lungs breathing, immune system protecting you. Send gratitude to your body for its continuous service.",
        duration: 60
      },
      {
        title: "Relationships",
        instruction: "Think of people who support, love, or inspire you. Bring them to mind one by one, acknowledging the gift of their presence in your life. Feel the warmth of appreciation spread through your chest as you consider these connections.",
        duration: 90
      },
      {
        title: "Personal Strengths",
        instruction: "Reflect on your own positive qualities and strengths - perhaps your kindness, creativity, determination, or sense of humor. Appreciate these aspects of yourself without pride or judgment, simply acknowledging them with gratitude.",
        duration: 60
      },
      {
        title: "Challenges as Growth",
        instruction: "Consider challenges or difficulties you've faced that ultimately led to growth or learning. Can you find a sense of gratitude for these experiences and how they've shaped you? This isn't about denying pain, but finding value even in difficulty.",
        duration: 60
      },
      {
        title: "Expanding Gratitude",
        instruction: "Widen your perspective to include all the conditions that support your life - the farmers who grow your food, the people who built your home, the countless individuals whose efforts contribute to your wellbeing. Feel gratitude for this vast web of support.",
        duration: 60
      },
      {
        title: "Closing Reflection",
        instruction: "Notice how you feel now. Has your mood shifted? Is there a sense of lightness or warmth? Set an intention to notice moments of gratitude throughout your day. When you're ready, gently open your eyes and carry this appreciative awareness with you.",
        duration: 45
      }
    ]
  },
  {
    id: "self-compassion",
    name: "Self-Compassion Practice",
    description: "Learn to treat yourself with the same kindness and understanding that you would offer to a good friend facing difficulties.",
    duration: 9,
    focus: "Self-kindness",
    color: "blue",
    steps: [
      {
        title: "Preparation",
        instruction: "Find a comfortable position and take a few deep breaths. Place a hand over your heart as a gesture of self-care and connection. Acknowledge that this is a time to be kind to yourself.",
        duration: 45
      },
      {
        title: "Acknowledging Difficulty",
        instruction: "Bring to mind a situation in your life that's causing you stress, pain, or difficulty. Don't analyze the situation - simply acknowledge that this is hard, and it's okay to feel whatever you're feeling about it.",
        duration: 60
      },
      {
        title: "Common Humanity",
        instruction: "Remind yourself that difficulty and suffering are part of the shared human experience. Everyone struggles at times - you're not alone in your pain. This isn't meant to minimize your experience, but to help you feel connected rather than isolated.",
        duration: 60
      },
      {
        title: "Self-Kindness",
        instruction: "Ask yourself: 'What do I need right now?' or 'What would I say to a dear friend facing this situation?' Offer yourself those same words of comfort and understanding. Speaking silently to yourself, use phrases like 'May I be kind to myself in this moment' or 'I'm here for myself through this difficulty.'",
        duration: 90
      },
      {
        title: "Soothing Touch",
        instruction: "If it feels supportive, continue with a hand on your heart, or try other soothing touches like gently holding your own hand, cradling your face, or giving yourself a gentle hug. Notice how physical touch can communicate care and comfort.",
        duration: 60
      },
      {
        title: "Compassionate Letter",
        instruction: "Imagine writing a letter to yourself from the perspective of an unconditionally loving friend or mentor who knows your struggles and still sees your inherent worth. What would they say? How would they encourage you?",
        duration: 90
      },
      {
        title: "Compassionate Breathing",
        instruction: "Breathe compassion in for yourself and all who suffer. On the inhale, imagine drawing in compassion, kindness and strength. On the exhale, allow tension, judgment, and self-criticism to dissolve. Continue this rhythmic breathing for several cycles.",
        duration: 90
      },
      {
        title: "Closing Integration",
        instruction: "Reflect on how it feels to offer yourself compassion. Notice any resistance that arose, as well as any moments of relief or tenderness. Set an intention to remember this practice when you're struggling. When you're ready, slowly open your eyes, maintaining this attitude of kindness toward yourself.",
        duration: 45
      }
    ]
  }
];
