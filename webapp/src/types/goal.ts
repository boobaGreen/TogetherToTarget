export interface GoalInputData {
  description: string;
  deadline?: Date;
}

export interface GoalInputProps {
  selectedCategory: {
    id: number;
    name_it: string;
    name_en: string;
    emoji: string;
    color: string;
  };
  initialData?: GoalInputData;
  onGoalChange: (data: GoalInputData) => void;
  onValidation: (isValid: boolean) => void;
}

export interface GoalSuggestion {
  text: string;
  category: string;
  timeframe: string;
}
