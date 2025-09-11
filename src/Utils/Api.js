export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://cf-server-tr24.onrender.com"

if (typeof window !== "undefined") {
  console.log("[v0] API_BASE (client):", API_BASE)
} else {
  console.log("[v0] API_BASE (server):", API_BASE ? "***set***" : "MISSING")
}
