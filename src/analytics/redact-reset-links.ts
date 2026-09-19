export function redactResetLinks(properties: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(properties).map(([key, value]) => {
      if (typeof value === "string" && URL.canParse(value)) {
        const url = new URL(value);
        if (url.pathname === "/reset-password") {
          url.search = "";
          url.hash = "";
          return [key, url.href];
        }
      }
      if (value && typeof value === "object" && !Array.isArray(value))
        return [key, redactResetLinks(value as Record<string, unknown>)];
      return [key, value];
    }),
  );
}
