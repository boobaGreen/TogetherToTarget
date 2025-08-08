export type AvailabilityHours =
  | "morning"
  | "afternoon"
  | "evening"
  | "flexible";
export type MeetingFrequency = "weekly" | "biweekly";

export interface AvailabilityData {
  availabilityHours: AvailabilityHours;
  preferredDays: number[]; // 0=Domenica, 1=Lunedì, etc.
  meetingFrequency: MeetingFrequency;
  timezone: string;
  notes?: string;
}

export interface AvailabilitySettingsProps {
  selectedCategory: {
    id: number;
    name_it: string;
    emoji: string;
    color: string;
  };
  goalDescription: string;
  experienceLevel: string;
  initialData?: AvailabilityData;
  onAvailabilityChange: (data: AvailabilityData) => void;
  onValidation: (isValid: boolean) => void;
}

export interface TimeSlot {
  id: AvailabilityHours;
  label: string;
  description: string;
  icon: string;
  timeRange: string;
}

export interface DayOption {
  id: number;
  short: string;
  long: string;
}
