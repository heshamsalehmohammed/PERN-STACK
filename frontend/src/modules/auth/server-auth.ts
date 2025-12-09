import { cookies } from "next/headers";

/**
 * Decode JWT payload from the cookie (UI-only, no signature verification).
 * Real security is enforced in your Express backend + middleware.
 */
export async function getServerAuthUser(): Promise<ISignedPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const [, payloadPart] = token.split(".");
    if (!payloadPart) return null;

    // base64url decode
    const json = Buffer.from(payloadPart, "base64url").toString("utf8");
    const payload = JSON.parse(json) as ISignedPayload;

    return payload;
  } catch {
    return null;
  }
}
