export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface ExperienceLevelData {
  level: ExperienceLevel;
  motivation?: string; // Ora opzionale
}

export interface ExperienceLevelProps {
  selectedCategory: {
    id: number;
    name_it: string;
    name_en: string;
    emoji: string;
    color: string;
  };
  goalDescription: string;
  initialData?: ExperienceLevelData;
  onExperienceChange: (data: ExperienceLevelData) => void;
  onValidation: (isValid: boolean) => void;
}

export interface ExperienceOption {
  level: ExperienceLevel;
  title: string;
  description: string;
  icon: string;
  examples: string[];
}
