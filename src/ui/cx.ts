/** Tiny class-name joiner for the design system (truthy strings only). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
