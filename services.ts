import { supabase, isSupabaseConfigured } from "./supabase";
import {
  demoCampaigns,
  demoEmergencyContacts,
  demoLegalResources,
  demoResources,
  demoSurveyQuestions,
} from "./demoData";
import type {
  Campaign,
  EmergencyContact,
  LegalResource,
  Resource,
  SafetyReport,
  SurveyQuestion,
} from "../types";

/**
 * Every function here prefers Supabase when it's configured, and falls back
 * to local demo data otherwise, so the app is fully explorable before a
 * database is connected.
 */

export async function fetchCampaigns(): Promise<Campaign[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("status", "published")
      .order("start_date", { ascending: true });
    if (!error && data) return data as Campaign[];
  }
  return demoCampaigns.filter((c) => c.status === "published");
}

export async function fetchCampaignBySlug(slug: string): Promise<Campaign | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("campaigns").select("*").eq("slug", slug).single();
    if (!error && data) return data as Campaign;
  }
  return demoCampaigns.find((c) => c.slug === slug) ?? null;
}

export async function fetchResources(): Promise<Resource[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (!error && data) return data as Resource[];
  }
  return demoResources.filter((r) => r.published);
}

export async function fetchLegalResources(): Promise<LegalResource[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("legal_resources")
      .select("*")
      .eq("published", true)
      .order("topic", { ascending: true });
    if (!error && data) return data as LegalResource[];
  }
  return demoLegalResources.filter((l) => l.published);
}

export async function fetchEmergencyContacts(): Promise<EmergencyContact[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true });
    if (!error && data) return data as EmergencyContact[];
  }
  return demoEmergencyContacts.filter((e) => e.is_active);
}

export async function fetchSurveyQuestions(): Promise<SurveyQuestion[]> {
  if (isSupabaseConfigured && supabase) {
    const { data: questions, error } = await supabase
      .from("survey_questions")
      .select("*, survey_options(*)")
      .eq("is_active", true)
      .order("order_index", { ascending: true });
    if (!error && questions) {
      return questions.map((q: Record<string, unknown>) => ({
        ...q,
        options: (q.survey_options as SurveyQuestion["options"]) ?? [],
      })) as SurveyQuestion[];
    }
  }
  return demoSurveyQuestions.filter((q) => q.is_active);
}

export interface SurveySubmission {
  isAnonymous: boolean;
  userId: string | null;
  answers: Record<string, string>;
}

export async function submitSurvey(submission: SurveySubmission): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    const { data: response, error: responseError } = await supabase
      .from("survey_responses")
      .insert({
        user_id: submission.isAnonymous ? null : submission.userId,
        is_anonymous: submission.isAnonymous,
      })
      .select()
      .single();

    if (responseError || !response) {
      return { success: false, error: responseError?.message ?? "Could not save your response." };
    }

    const rows = Object.entries(submission.answers).map(([question_id, answer_value]) => ({
      response_id: response.id,
      question_id,
      answer_value,
    }));

    const { error: answersError } = await supabase.from("survey_answers").insert(rows);
    if (answersError) return { success: false, error: answersError.message };
    return { success: true };
  }

  const key = "safeaware_demo_survey_responses";
  const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
  existing.push({
    id: crypto.randomUUID(),
    user_id: submission.isAnonymous ? null : submission.userId,
    is_anonymous: submission.isAnonymous,
    answers: submission.answers,
    created_at: new Date().toISOString(),
  });
  localStorage.setItem(key, JSON.stringify(existing));
  return { success: true };
}

export function getLocalSurveyResponses(): Array<{
  id: string;
  is_anonymous: boolean;
  answers: Record<string, string>;
  created_at: string;
}> {
  return JSON.parse(localStorage.getItem("safeaware_demo_survey_responses") ?? "[]");
}

export interface ReportSubmission {
  category: string;
  description: string;
  approximateLocation?: string;
  incidentDate?: string;
  isAnonymous: boolean;
  contactInformation?: string;
  userId: string | null;
}

export async function submitReport(report: ReportSubmission): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("safety_reports").insert({
      user_id: report.isAnonymous ? null : report.userId,
      category: report.category,
      description: report.description,
      approximate_location: report.approximateLocation ?? null,
      incident_date: report.incidentDate ?? null,
      is_anonymous: report.isAnonymous,
      contact_information: report.isAnonymous ? null : report.contactInformation ?? null,
      status: "new",
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  const key = "safeaware_demo_reports";
  const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
  existing.push({
    id: crypto.randomUUID(),
    category: report.category,
    description: report.description,
    approximate_location: report.approximateLocation ?? null,
    incident_date: report.incidentDate ?? null,
    is_anonymous: report.isAnonymous,
    contact_information: report.isAnonymous ? null : report.contactInformation ?? null,
    status: "new",
    created_at: new Date().toISOString(),
  });
  localStorage.setItem(key, JSON.stringify(existing));
  return { success: true };
}

export function getLocalReports(): SafetyReport[] {
  return JSON.parse(localStorage.getItem("safeaware_demo_reports") ?? "[]");
}

export async function fetchReportsForAdmin(): Promise<SafetyReport[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("safety_reports")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data as SafetyReport[];
  }
  return getLocalReports().sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function updateReportStatus(id: string, status: SafetyReport["status"]): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from("safety_reports").update({ status }).eq("id", id);
    return;
  }
  const reports = getLocalReports();
  const updated = reports.map((r) => (r.id === id ? { ...r, status } : r));
  localStorage.setItem("safeaware_demo_reports", JSON.stringify(updated));
}

export async function fetchAllCampaignsForAdmin(): Promise<Campaign[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("campaigns").select("*").order("start_date", { ascending: false });
    if (!error && data) return data as Campaign[];
  }
  return demoCampaigns;
}
