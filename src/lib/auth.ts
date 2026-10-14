import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// ponytail: one admin, one password from env, one signed cookie. No user table, no sign-up.
// Upgrade path: if you ever need several admins, swap this for a real auth provider.

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 დღე

function secret() {
  const s = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_SECRET / ADMIN_PASSWORD არ არის მითითებული .env.local-ში");
  return s;
}

function sign(expires: number) {
  return `${expires}.${createHmac("sha256", secret()).update(String(expires)).digest("hex")}`;
}

function valid(token: string | undefined) {
  if (!token) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac || Number(exp) < Date.now()) return false;
  const expected = createHmac("sha256", secret()).update(exp).digest("hex");
  const a = Buffer.from(mac, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isLoggedIn() {
  try {
    return valid((await cookies()).get(COOKIE)?.value);
  } catch {
    return false;
  }
}

export async function login() {
  (await cookies()).set(COOKIE, sign(Date.now() + MAX_AGE * 1000), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function logout() {
  (await cookies()).delete(COOKIE);
}

/** Every admin mutation calls this first. */
export async function requireAdmin() {
  if (!(await isLoggedIn())) throw new Error("ავტორიზაცია საჭიროა");
}
