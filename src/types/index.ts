export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone_optional?: string | null;
  created_at: string;
  updated_at: string;
}

export type QuestionType = "multiple_choice" | "checkbox" | "rating" | "yes_no" | "text";

export interface SurveyOption {
  id: string;
  question_id: string;
  label: string;
  order_index: number;
}

export interface SurveyQuestion {
  id: string;
  prompt: string;
  question_type: QuestionType;
  is_required: boolean;
  is_active: boolean;
  order_index: number;
  options?: SurveyOption[];
}

export interface SurveyResponse {
  id: string;
  user_id: string | null;
  is_anonymous: boolean;
  created_at: string;
}

export interface SurveyAnswer {
  id: string;
  response_id: string;
  question_id: string;
  answer_value: string;
}

export type CampaignStatus = "draft" | "published" | "completed";

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  cover_image?: string | null;
  topics: string[];
  start_date: string;
  end_date: string;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  source_url?: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface LegalResource {
  id: string;
  title: string;
  topic: string;
  summary: string;
  general_information: string;
  official_source_url?: string | null;
  jurisdiction: string;
  last_verified: string;
  published: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  description: string;
  phone: string;
  website?: string | null;
  category: string;
  jurisdiction: string;
  is_active: boolean;
}

export type ReportStatus = "new" | "reviewing" | "resolved" | "closed";

export interface SafetyReport {
  id: string;
  user_id?: string | null;
  category: string;
  description: string;
  approximate_location?: string | null;
  incident_date?: string | null;
  is_anonymous: boolean;
  contact_information?: string | null;
  status: ReportStatus;
  admin_notes?: string | null;
  created_at: string;
}

export interface OnboardingPreferences {
  user_id: string;
  interests: string[];
  wants_survey: boolean;
  completed: boolean;
}
