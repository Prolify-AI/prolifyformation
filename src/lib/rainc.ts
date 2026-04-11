import { apiRequest } from "@/lib/corporatetools";
import { usStates } from "@/lib/us-states";

export type RaincSubmitPayload = {
  companyName: string;
  entityType: string;
  businessState: string;
  managementStructure: string;
  contactTitle: string;
  contactFirstName: string;
  contactLastName: string;
  contactPhone: string;
  contactEmail: string;
  contactStreet: string;
  contactCity: string;
  contactState: string;
  contactZip: string;
};

export type RaincStep =
  | "create_company"
  | "add_service"
  | "submit_info";

export type RaincProgress = {
  step: RaincStep;
  companyId?: string;
  serviceId?: string;
};

export type RaincResult =
  | { success: true; companyId: string }
  | { success: false; failedStep: RaincStep; error: string; progress: RaincProgress };

async function raincRequest(method: string, path: string, body?: unknown) {
  return apiRequest(method, path, body ?? null);
}

function normalizeEntityType(raw: string): string {
  const v = raw.trim().toLowerCase();
  if (v === "llc" || v === "limited liability company (llc)" || v === "limited liability company" || v === "limited_liability_company") return "Limited Liability Company";
  if (v === "c-corp" || v === "c corporation (c-corp)" || v === "c corporation" || v === "c_corporation") return "Corporation";
  if (v === "s-corp" || v === "s corporation (s-corp)" || v === "s corporation" || v === "s_corporation") return "Corporation";
  return raw;
}

function normalizeJurisdiction(raw: string): string {
  if (!raw) return raw;
  const trimmed = raw.trim();
  const match = usStates.find(
    (s) => s.code.toLowerCase() === trimmed.toLowerCase() || s.name.toLowerCase() === trimmed.toLowerCase()
  );
  return match ? match.name : trimmed;
}

function normalizeManagementStructure(raw: string): string {
  const v = raw.trim().toLowerCase();
  if (v === "member managed" || v === "member-managed" || v === "member_managed") return "Member Managed";
  if (v === "manager managed" || v === "manager-managed" || v === "manager_managed") return "Manager Managed";
  return raw;
}

export async function checkNameAvailability(companyName: string): Promise<{ available: boolean; error?: string }> {
  try {
    const data = await raincRequest("GET", "/companies", { name: companyName });
    const result = data.result || data;
    const companies = Array.isArray(result) ? result : [];
    const taken = companies.some(
      (c: Record<string, unknown>) =>
        typeof c.name === "string" &&
        c.name.toLowerCase() === companyName.toLowerCase()
    );
    return { available: !taken };
  } catch (e) {
    return { available: false, error: String(e) };
  }
}

function buildServiceInfo(payload: RaincSubmitPayload, managementStructure: string) {
  const isManagerManaged = managementStructure === "Manager Managed";

  const address = {
    line1: payload.contactStreet,
    line2: "",
    city: payload.contactCity,
    state_province_region: payload.contactState,
    zip_postal_code: payload.contactZip,
    country: "United States",
  };

  const official = {
    role: isManagerManaged ? "Manager" : "Member",
    first_name: payload.contactFirstName,
    last_name: payload.contactLastName,
    address,
  };

  const info: Record<string, unknown> = {
    contact_person: {
      title: payload.contactTitle || "Owner",
      first_name: payload.contactFirstName,
      last_name: payload.contactLastName,
      phone_number: payload.contactPhone,
      email_address: payload.contactEmail,
      address,
    },
    management_type: managementStructure,
  };

  if (isManagerManaged) {
    info["official.manager"] = [official];
  } else {
    info["official.member"] = [official];
  }

  return info;
}

export async function submitToRainc(
  payload: RaincSubmitPayload,
  savedProgress: RaincProgress | null,
  onStepComplete: (step: RaincStep, progress: RaincProgress) => void
): Promise<RaincResult> {
  const progress: RaincProgress = savedProgress ? { ...savedProgress } : { step: "create_company" };

  let companyId = progress.companyId;
  let serviceId = progress.serviceId;

  const entityType = normalizeEntityType(payload.entityType);
  const managementStructure = normalizeManagementStructure(payload.managementStructure);
  const jurisdiction = normalizeJurisdiction(payload.businessState);

  // Step 1: Create company
  if (!companyId) {
    try {
      const data = await raincRequest("POST", "/companies", {
        companies: [
          {
            name: payload.companyName,
            entity_type: entityType,
            duplicate_name_allowed: true,
          },
        ],
      });
      const result = data.result || data;
      const company = Array.isArray(result) ? result[0] : result;

      if (company?.company_errors || company?.jurisdiction_errors) {
        const msgs: string[] = [];
        if (company.company_errors) msgs.push(`Company errors: ${JSON.stringify(company.company_errors)}`);
        if (company.jurisdiction_errors) msgs.push(`Jurisdiction errors: ${JSON.stringify(company.jurisdiction_errors)}`);
        throw new Error(msgs.join("; "));
      }

      companyId = company?.id || company?.company_id;

      if (!companyId) {
        throw new Error(`Company creation failed — no ID returned. Response: ${JSON.stringify(data)}`);
      }

      progress.companyId = companyId;
      progress.step = "add_service";
      onStepComplete("create_company", { ...progress });
    } catch (e) {
      const errStr = String(e);
      if (errStr.includes("DUPLICATE_COMPANY")) {
        try {
          const existing = await raincRequest("GET", "/companies", { name: payload.companyName });
          const existingResult = existing.result || existing;
          const companies = Array.isArray(existingResult) ? existingResult : [];
          const match = companies.find(
            (c: Record<string, unknown>) =>
              typeof c.name === "string" &&
              c.name.toLowerCase() === payload.companyName.toLowerCase()
          );
          companyId = match?.id || match?.company_id;
          if (!companyId) {
            return {
              success: false,
              failedStep: "create_company",
              error: `Une company nommée "${payload.companyName}" existe déjà. Veuillez utiliser un nom différent.`,
              progress,
            };
          }
          progress.companyId = companyId;
          progress.step = "add_service";
          onStepComplete("create_company", { ...progress });
        } catch (lookupErr) {
          return { success: false, failedStep: "create_company", error: String(lookupErr), progress };
        }
      } else {
        return { success: false, failedStep: "create_company", error: errStr, progress };
      }
    }
  } else {
    onStepComplete("create_company", { ...progress });
  }

  // Step 2: POST /services — link company to jurisdiction
  if (!serviceId) {
    try {
      const data = await raincRequest("POST", "/services", {
        company_id: companyId,
        jurisdictions: [jurisdiction],
      });
      const result = data.result || data;
      const service = Array.isArray(result) ? result[0] : result;
      serviceId = service?.id || service?.service_id;

      if (!serviceId) {
        throw new Error(`Service creation failed — no ID returned. Response: ${JSON.stringify(data)}`);
      }

      progress.serviceId = serviceId;
      progress.step = "submit_info";
      onStepComplete("add_service", { ...progress });
    } catch (e) {
      const errStr = String(e);
      const isAlreadyExists = errStr.includes("SERVICE_EXISTS") || errStr.toLowerCase().includes("already");
      if (isAlreadyExists) {
        try {
          const existing = await raincRequest("GET", "/services", { company_id: companyId });
          const existingResult = existing.result || existing;
          const services = Array.isArray(existingResult) ? existingResult : [];
          const match = services.find(
            (s: Record<string, unknown>) =>
              s.company_id === companyId &&
              (s.jurisdiction as string)?.toLowerCase() === jurisdiction.toLowerCase()
          );
          serviceId = match?.id;
          if (!serviceId) {
            return { success: false, failedStep: "add_service", error: errStr, progress };
          }
          progress.serviceId = serviceId;
          progress.step = "submit_info";
          onStepComplete("add_service", { ...progress });
        } catch {
          return { success: false, failedStep: "add_service", error: errStr, progress };
        }
      } else {
        return { success: false, failedStep: "add_service", error: errStr, progress };
      }
    }
  } else {
    onStepComplete("add_service", { ...progress });
  }

  // Step 3: POST /services/:id/info — submit contact person and officials
  try {
    const serviceInfo = buildServiceInfo(payload, managementStructure);
    await raincRequest("POST", `/services/${serviceId}/info`, serviceInfo);
    onStepComplete("submit_info", { ...progress });
    return { success: true, companyId: companyId! };
  } catch (e) {
    return { success: false, failedStep: "submit_info", error: String(e), progress };
  }
}
