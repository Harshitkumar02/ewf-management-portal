import { useState, useEffect, useCallback } from "react";
import { getAll, type GeoFence } from "@/lib/db";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

export interface GeoFenceConfig {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  name: string;
}

function getDistanceMeters(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "Geolocation is not supported by your browser" }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState((s) => ({
          ...s,
          loading: false,
          error: error.code === 1
            ? "Location access denied. Please enable location permissions."
            : error.code === 2
            ? "Location unavailable. Please try again."
            : "Location request timed out. Please try again.",
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return { ...state, requestLocation };
}

export function checkGeoFence(
  userLat: number,
  userLon: number,
  fence: GeoFenceConfig
): { withinFence: boolean; distanceMeters: number } {
  const distance = getDistanceMeters(userLat, userLon, fence.latitude, fence.longitude);
  return {
    withinFence: distance <= fence.radiusMeters,
    distanceMeters: Math.round(distance),
  };
}

// Load geo-fences from localStorage DB
export function getProjectGeoFences(): GeoFenceConfig[] {
  const fences = getAll<GeoFence>("geofences");
  return fences.map((f) => ({
    name: f.name,
    latitude: f.latitude,
    longitude: f.longitude,
    radiusMeters: f.radiusMeters,
  }));
}

// Keep backward compat export
export const PROJECT_GEO_FENCES: GeoFenceConfig[] = [
  { name: "Dhaka Office", latitude: 23.8103, longitude: 90.4125, radiusMeters: 500 },
  { name: "Chittagong Field", latitude: 22.3569, longitude: 91.7832, radiusMeters: 1000 },
  { name: "Sylhet Center", latitude: 24.8949, longitude: 91.8687, radiusMeters: 500 },
  { name: "Rajshahi Office", latitude: 24.3745, longitude: 88.6042, radiusMeters: 500 },
  { name: "Khulna Office", latitude: 22.8456, longitude: 89.5403, radiusMeters: 500 },
];
