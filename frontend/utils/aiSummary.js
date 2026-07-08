export function generateAISummary(text) {
  if (!text) return "AI Summary: No content provided.";
  const words = text.split(" ");
  const preview = words.slice(0, 15).join(" ");
  return `AI Summary: ${preview}${words.length > 15 ? "..." : ""}`;
}
