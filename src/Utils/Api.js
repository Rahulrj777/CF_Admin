export const API_BASE = process.env.VITE_API_BASE

if (typeof window !== "undefined") {
  console.log("[v0] API_BASE (client):", API_BASE)
} else {
  console.log("[v0] API_BASE (server):", API_BASE ? "***set***" : "MISSING")
}
