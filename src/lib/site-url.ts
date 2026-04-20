const DEFAULT_SITE_URL = "https://prolify.co";

const sanitizeBaseUrl = (value: string) => value.trim().replace(/\/+$/, "");

export const getBaseUrl = () => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    return sanitizeBaseUrl(configured);
  }

  if (typeof window !== "undefined") {
    return sanitizeBaseUrl(window.location.origin);
  }

  return DEFAULT_SITE_URL;
};

export const buildSiteUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${normalizedPath}`;
};
