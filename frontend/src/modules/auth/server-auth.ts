import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";

const secretKey = process.env.ACCESS_JWT_SECRET;
if (!secretKey) throw new Error("FATAL: ACCESS_JWT_SECRET is not configured.");
const JWT_SECRET_KEY = new TextEncoder().encode(secretKey);


export async function getServerAuthUser(): Promise<ISignedPayload | null> {
  const cookieStore = await  cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    return payload as unknown as ISignedPayload;
  } catch (e) {
    const error = e as Error;

    if (error.name === "JWTExpired") {
      console.warn("Token validation failed: JWT Expired.");
    } else {
      console.warn(
        "Token validation failed: Invalid Signature/Claim.",
        error.message
      );
    }

    return null;
  }
}