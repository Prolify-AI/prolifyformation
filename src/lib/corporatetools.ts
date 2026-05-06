async function apiRequest(method: string, endpoint: string, body: unknown = null) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const res = await fetch(`${supabaseUrl}/functions/v1/rainc-proxy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ method, path: endpoint, body }),
  });

  const data = await res.json();
  console.log("RAINC RESPONSE:", JSON.stringify(data));
  if (!res.ok) throw new Error(JSON.stringify(data));

  const companyErrors = data?.company_errors || data?.result?.[0]?.company_errors;
  const jurisdictionErrors = data?.jurisdiction_errors || data?.result?.[0]?.jurisdiction_errors;
  if (companyErrors || jurisdictionErrors) {
    const msgs: string[] = [];
    if (companyErrors) msgs.push(`Company errors: ${JSON.stringify(companyErrors)}`);
    if (jurisdictionErrors) msgs.push(`Jurisdiction errors: ${JSON.stringify(jurisdictionErrors)}`);
    throw new Error(msgs.join("; "));
  }

  return data;
}

export { apiRequest };
