const CAP_BASE_URL = process.env.CAP_BASE_URL ?? "http://localhost:4004";

export async function capFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${CAP_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `CAP request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
