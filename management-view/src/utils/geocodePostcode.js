// src/utils/geocodePostcode.js
// Simple utility to convert Singapore postal code to lat/lng using Google Maps Geocoding API
// Usage: await geocodePostcode(postcode)

export async function geocodePostcode(postcode, apiKey) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&region=sg&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status === 'OK' && data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  }
  throw new Error('Failed to geocode postcode: ' + postcode);
}
