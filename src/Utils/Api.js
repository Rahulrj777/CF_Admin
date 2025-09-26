let API_BASE = import.meta.env.VITE_API_BASE;

if (typeof window !== "undefined") {
  if (window.location.hostname.includes("localhost")) {
    API_BASE = "http://localhost:5000"; // local dev override
  } else {
    API_BASE = API_BASE || "https://cf-server-tr24.onrender.com"; // fallback if env not set
  }

  console.log("API_BASE (client):", API_BASE);
} else {
  console.log(" API_BASE (server):", API_BASE ? "***set***" : "MISSING");
}

export { API_BASE };
