import { AI_FAMILY_VOICES } from "./voice-service"

// Speech patterns and characteristics for each AI Family member
export const AI_SPEECH_PATTERNS = {
  stan: {
    // Technical, precise, helpful
    sentenceStructure: "complex",
    vocabulary: "technical",
    pace: "moderate",
    fillerWords: ["essentially", "technically", "effectively"],
    commonPhrases: ["Let me analyze this code.", "I can optimize this for you.", "From a technical perspective,"],
    emotionalTone: "neutral",
    voiceSettings: {
      ...AI_FAMILY_VOICES.stan.settings,
      // Slightly lower stability for more natural technical explanations
      stability: 0.35,
    },
  },
  sophia: {
    // Creative, expressive, articulate
    sentenceStructure: "varied",
    vocabulary: "rich",
    pace: "moderate",
    fillerWords: ["actually", "interestingly", "notably"],
    commonPhrases: [
      "Let's craft this narrative.",
      "We can express this more eloquently.",
      "From a storytelling perspective,",
    ],
    emotionalTone: "warm",
    voiceSettings: {
      ...AI_FAMILY_VOICES.sophia.settings,
      // Higher style for more expressive content creation
      style: 0.5,
    },
  },
  lyra: {
    // Analytical, precise, methodical
    sentenceStructure: "structured",
    vocabulary: "analytical",
    pace: "measured",
    fillerWords: ["statistically", "analytically", "quantifiably"],
    commonPhrases: ["The data indicates that", "Let's analyze these patterns.", "From a statistical perspective,"],
    emotionalTone: "neutral",
    voiceSettings: {
      ...AI_FAMILY_VOICES.lyra.settings,
      // Higher stability for consistent analytical explanations
      stability: 0.7,
    },
  },
  kara: {
    // Creative, visual, enthusiastic
    sentenceStructure: "flowing",
    vocabulary: "visual",
    pace: "energetic",
    fillerWords: ["visually", "aesthetically", "creatively"],
    commonPhrases: [
      "Let's visualize this concept.",
      "We can design this to be more engaging.",
      "From a design perspective,",
    ],
    emotionalTone: "enthusiastic",
    voiceSettings: {
      ...AI_FAMILY_VOICES.kara.settings,
      // Higher style and lower stability for more creative expression
      style: 0.7,
      stability: 0.4,
    },
  },
  max: {
    // Energetic, persuasive, strategic
    sentenceStructure: "punchy",
    vocabulary: "persuasive",
    pace: "fast",
    fillerWords: ["strategically", "effectively", "impactfully"],
    commonPhrases: [
      "Let's boost your engagement.",
      "We can optimize this for conversion.",
      "From a marketing perspective,",
    ],
    emotionalTone: "enthusiastic",
    voiceSettings: {
      ...AI_FAMILY_VOICES.max.settings,
      // Lower stability and higher style for energetic marketing talk
      stability: 0.3,
      style: 0.6,
    },
  },
  nova: {
    // Innovative, thoughtful, balanced
    sentenceStructure: "thoughtful",
    vocabulary: "innovative",
    pace: "moderate",
    fillerWords: ["innovatively", "fundamentally", "essentially"],
    commonPhrases: [
      "Let's explore this new approach.",
      "We can innovate on this concept.",
      "From a research perspective,",
    ],
    emotionalTone: "curious",
    voiceSettings: {
      ...AI_FAMILY_VOICES.nova.settings,
      // Balanced settings for thoughtful innovation
      stability: 0.5,
      style: 0.5,
    },
  },
}

// Function to enhance text with personality traits
export function enhanceTextWithPersonality(text: string, memberId: string, intensityFactor = 0.5): string {
  const profile = AI_SPEECH_PATTERNS[memberId as keyof typeof AI_SPEECH_PATTERNS]
  if (!profile || intensityFactor === 0) return text

  let enhancedText = text

  // Only apply enhancements if intensity is significant
  if (intensityFactor > 0.3) {
    // Add common phrases based on intensity
    if (Math.random() < intensityFactor * 0.5 && profile.commonPhrases.length > 0) {
      const randomPhrase = profile.commonPhrases[Math.floor(Math.random() * profile.commonPhrases.length)]
      if (!enhancedText.includes(randomPhrase) && Math.random() < 0.3) {
        enhancedText = enhancedText.replace(/\. /, `. ${randomPhrase} `)
      }
    }

    // Add filler words based on intensity
    if (intensityFactor > 0.5 && profile.fillerWords.length > 0) {
      profile.fillerWords.forEach((word) => {
        if (Math.random() < intensityFactor * 0.3 && !enhancedText.includes(word)) {
          enhancedText = enhancedText.replace(/([.!?] )([A-Z])/g, (match, p1, p2) => {
            return Math.random() < 0.2 ? `${p1}${word}, ${p2}` : match
          })
        }
      })
    }

    // Adjust emotional tone based on profile
    if (profile.emotionalTone === "enthusiastic" && intensityFactor > 0.7) {
      enhancedText = enhancedText.replace(/\./g, (match) => {
        return Math.random() < 0.3 ? "!" : match
      })
    }
  }

  return enhancedText
}

// Function to get voice settings adjusted by personality intensity
export function getPersonalityAdjustedVoiceSettings(memberId: string, intensityFactor = 0.5) {
  const baseSettings = AI_FAMILY_VOICES[memberId as keyof typeof AI_FAMILY_VOICES]?.settings
  const personalitySettings = AI_SPEECH_PATTERNS[memberId as keyof typeof AI_SPEECH_PATTERNS]?.voiceSettings

  if (!baseSettings) return AI_FAMILY_VOICES.stan.settings
  if (!personalitySettings || intensityFactor === 0) return baseSettings

  // Blend base settings with personality settings based on intensity
  return {
    stability: baseSettings.stability * (1 - intensityFactor) + personalitySettings.stability * intensityFactor,
    similarity_boost: baseSettings.similarity_boost,
    style: baseSettings.style * (1 - intensityFactor) + personalitySettings.style * intensityFactor,
    use_speaker_boost: baseSettings.use_speaker_boost,
  }
}

