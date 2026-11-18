/** Turns coordinates into a readable place name using MapTiler. */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const fallback = `Pin ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  if (!key) return fallback;
  try {
    const res = await fetch(
      `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${key}`,
    );
    if (!res.ok) return fallback;
    const data = await res.json();
    const label = data?.features?.[0]?.place_name as string | undefined;
    return label || fallback;
  } catch {
    return fallback;
  }
}

/** Reads the device's GPS position; rejects with a customer-friendly message. */
export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Your browser can't share your location."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) =>
        reject(
          new Error(
            err.code === err.PERMISSION_DENIED
              ? "Location access is turned off. Choose your area below instead."
              : "Could not get your location. Choose your area below instead.",
          ),
        ),
      { enableHighAccuracy: true, timeout: 12_000 },
    );
  });
}
