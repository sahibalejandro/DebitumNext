/**
 * Returns true if the given status code matches any of the given status codes.
 */
export function anyStatusCode(code: number, ...statuses: number[]): boolean {
  return statuses.includes(code);
}
