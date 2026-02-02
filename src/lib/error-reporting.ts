import { supabase } from "@/integrations/supabase/client";

interface ErrorReport {
  errorMessage: string;
  errorStack?: string;
  errorType: "boundary" | "unhandled_rejection" | "runtime" | "network" | "unknown";
  componentName?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Reports errors to the database for production monitoring.
 * Fails silently to avoid cascading errors.
 */
export async function reportError(report: ErrorReport): Promise<void> {
  // Skip in development to avoid noise
  if (import.meta.env.DEV) {
    console.warn("[ErrorReporting] Skipped in development:", report);
    return;
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id ?? null;

    await (supabase.from("error_reports") as any).insert({
      error_message: report.errorMessage.slice(0, 5000),
      error_stack: report.errorStack?.slice(0, 10000),
      error_type: report.errorType,
      component_name: report.componentName,
      url: window.location.href,
      user_agent: navigator.userAgent,
      user_id: userId,
      metadata: report.metadata ?? {},
    });
  } catch (err) {
    // Fail silently - don't let error reporting cause more errors
    console.error("[ErrorReporting] Failed to report error:", err);
  }
}

/**
 * Extracts useful info from an unknown error value.
 */
export function normalizeError(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  if (typeof error === "string") {
    return { message: error };
  }
  return { message: String(error) };
}
