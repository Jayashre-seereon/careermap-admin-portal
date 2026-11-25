// Category supports multiple selections. Saved as a JSON array string; older records hold a
// single plain-text option.
export const parseCategoryList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  const text = String(value ?? "").trim();
  if (!text) return [];
  if (text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
    } catch {
      /* not JSON - treat as a single value */
    }
  }
  return [text];
};
