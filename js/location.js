/* ============================================================
   GOLDEN PIZZA CAFE — LOCATION & DELIVERY
   Geolocation request, Haversine distance, and the delivery
   pricing rule:
     0–5 KM        → FREE
     above 5 KM    → ₹10 per additional KM (rounded up)
   Values are read from Admin-configurable settings when
   available (DB.getSettings()), falling back to CONFIG defaults.
   ============================================================ */

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/** Haversine formula — returns distance in KM between two coordinates. */
function haversineDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in KM
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
window.haversineDistanceKm = haversineDistanceKm;

/**
 * Requests the browser's current position once (no continuous tracking).
 * Resolves { lat, lng } or rejects with a readable reason string.
 */
function requestCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject("Your browser does not support location access.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject("Location permission denied. Please enter your address manually.");
        } else {
          reject("Could not determine your location. Please enter your address manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}
window.requestCurrentLocation = requestCurrentLocation;

/**
 * Computes the delivery charge for a given distance using the
 * free-radius + per-km-beyond rule. Distance is rounded to 1
 * decimal for display; the extra-KM charge rounds UP to the next
 * whole KM so partial KMs beyond the free radius are still charged.
 */
function calculateDelivery(distanceKm, settings) {
  const freeKm = settings?.free_delivery_km ?? CONFIG.DELIVERY.freeDeliveryKm;
  const perKm = settings?.extra_charge_per_km ?? CONFIG.DELIVERY.extraChargePerKm;
  const roundedDistance = Math.round(distanceKm * 10) / 10;

  if (roundedDistance <= freeKm) {
    return { distance: roundedDistance, extraKm: 0, charge: 0, free: true };
  }
  const extraKm = Math.ceil(roundedDistance - freeKm);
  const charge = extraKm * perKm;
  return { distance: roundedDistance, extraKm, charge, free: false };
}
window.calculateDelivery = calculateDelivery;
