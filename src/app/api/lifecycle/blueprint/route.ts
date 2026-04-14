import { NextResponse } from "next/server";
import {
  FINAL_LIFECYCLE_STAGES,
  FINAL_TRIGGER_EVENT_MAP,
  HUBSPOT_PRIMARY_SEGMENTS,
  LIFECYCLE_SENDERS,
  GLOBAL_FREQUENCY_RULES,
  SEQUENCE_SUPPRESSION_RULES,
  SUNSET_POLICY,
  FINAL_MASTER_EMAIL_MATRIX,
  LIFECYCLE_SEQUENCES,
} from "@/lib/email/lifecycle";

export async function GET() {
  return NextResponse.json({
    stages: FINAL_LIFECYCLE_STAGES,
    events: FINAL_TRIGGER_EVENT_MAP,
    segments: HUBSPOT_PRIMARY_SEGMENTS,
    senders: LIFECYCLE_SENDERS,
    rules: {
      globalFrequency: GLOBAL_FREQUENCY_RULES,
      sequenceSuppression: SEQUENCE_SUPPRESSION_RULES,
      sunsetPolicy: SUNSET_POLICY,
    },
    emailMatrix: FINAL_MASTER_EMAIL_MATRIX,
    sequences: LIFECYCLE_SEQUENCES,
    stats: {
      totalEmails: FINAL_MASTER_EMAIL_MATRIX.length,
      totalEvents: FINAL_TRIGGER_EVENT_MAP.length,
      totalSegments: HUBSPOT_PRIMARY_SEGMENTS.length,
      totalSequences: LIFECYCLE_SEQUENCES.length,
    },
  });
}
