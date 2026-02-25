import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Serverless function that returns geolocation data from Vercel headers.
 * These headers are automatically set by Vercel CDN for all requests.
 *
 * Works on:
 * - *.vercel.app (preview deployments)
 * - Custom domains configured in Vercel
 *
 * Does NOT work on:
 * - localhost (use fallback API)
 * - Sites behind a proxy (Cloudflare, etc.)
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Read Vercel geolocation headers
  const city = req.headers["x-vercel-ip-city"] as string | undefined;
  const region = req.headers["x-vercel-ip-country-region"] as string | undefined;
  const country = req.headers["x-vercel-ip-country"] as string | undefined;

  // Decode URL-encoded city names (e.g., "S%C3%A3o%20Paulo" -> "São Paulo")
  const decodedCity = city ? decodeURIComponent(city) : null;

  // Check if we have valid geolocation data
  if (!decodedCity || !region) {
    return res.status(200).json({
      success: false,
      error: "Geolocation headers not available",
      // This happens on localhost or when behind a proxy
    });
  }

  return res.status(200).json({
    success: true,
    city: decodedCity,
    region: region, // State abbreviation (e.g., "DF", "SP")
    country: country || "BR",
  });
}
