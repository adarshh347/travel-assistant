// app/config/api.ts

// Backend base URL (Render URL)
// export const API_BASE_URL = "https://travel-assistant-xq8l.onrender.com/api";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9001";