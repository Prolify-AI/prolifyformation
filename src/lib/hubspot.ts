const HUBSPOT_TOKEN =
  process.env.HUBSPOT_ACCESS_TOKEN ||
  process.env.HUBSPOT_PRIVATE_APP_TOKEN ||
  process.env.HUBSPOT_TOKEN;

const BASE_URL = "https://api.hubapi.com";

export function isHubSpotConfigured(): boolean {
  return Boolean(HUBSPOT_TOKEN);
}

async function hubspotFetch(endpoint: string, options: RequestInit = {}) {
  if (!HUBSPOT_TOKEN) {
    console.warn("[HubSpot] No access token configured");
    return null;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`[HubSpot] ${response.status}:`, body);
    return null;
  }

  return response.json();
}

export async function createOrUpdateContact(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  businessType?: string;
  leadScore?: number;
  source?: string;
}): Promise<{ id: string } | null> {
  const properties: Record<string, string> = {
    email: data.email,
  };

  if (data.firstName) properties.firstname = data.firstName;
  if (data.lastName) properties.lastname = data.lastName;
  if (data.country) properties.country = data.country;
  if (data.businessType) properties.industry = data.businessType;
  if (data.source) properties.hs_lead_status = "NEW";
  if (typeof data.leadScore === "number") {
    properties.hs_lead_status = data.leadScore > 60 ? "OPEN_DEAL" : "NEW";
  }

  const search = await hubspotFetch("/crm/v3/objects/contacts/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [{ propertyName: "email", operator: "EQ", value: data.email }],
        },
      ],
    }),
  });

  if (search?.results?.length > 0) {
    const contactId = search.results[0].id;
    const updated = await hubspotFetch(`/crm/v3/objects/contacts/${contactId}`, {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    });
    return updated ? { id: contactId } : null;
  }

  const created = await hubspotFetch("/crm/v3/objects/contacts", {
    method: "POST",
    body: JSON.stringify({ properties }),
  });

  return created?.id ? { id: created.id } : null;
}

export async function createDeal(data: {
  contactId: string;
  dealName: string;
  stage?: string;
}): Promise<{ id: string } | null> {
  const deal = await hubspotFetch("/crm/v3/objects/deals", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        dealname: data.dealName,
        pipeline: "default",
        dealstage: data.stage ?? "appointmentscheduled",
      },
    }),
  });

  if (!deal?.id) {
    return null;
  }

  await hubspotFetch(`/crm/v3/objects/deals/${deal.id}/associations/contacts/${data.contactId}/3`, {
    method: "PUT",
  });

  return { id: deal.id };
}

export async function createTicketInHubSpot(data: {
  subject: string;
  description: string;
  priority?: string;
  contactId?: string;
}): Promise<{ id: string } | null> {
  const dealStage =
    data.priority === "critical" || data.priority === "high"
      ? "appointmentscheduled"
      : "qualifiedtobuy";

  const deal = await hubspotFetch("/crm/v3/objects/deals", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        dealname: `🎫 ${data.subject}`,
        description: data.description,
        pipeline: "default",
        dealstage: dealStage,
        amount: "0",
      },
    }),
  });

  if (!deal?.id) {
    return null;
  }

  if (data.contactId) {
    await hubspotFetch(`/crm/v3/objects/deals/${deal.id}/associations/contacts/${data.contactId}/3`, {
      method: "PUT",
    });
  }

  return { id: deal.id };
}
