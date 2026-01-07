import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

type UseLocationResult = {
  location: Location.LocationObject | null;
  error: string | null;
  isLoading: boolean;
  permissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  getLocation: () => Promise<Location.LocationObject | null>;
};

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  /**
   * Request foreground location permission
   */
  const requestPermission = useCallback(async () => {
    setError(null);

    const { status } = await Location.requestForegroundPermissionsAsync();

    const granted = status === Location.PermissionStatus.GRANTED;
    setPermissionGranted(granted);

    if (!granted) {
      setError("Location permission not granted");
    }

    return granted;
  }, []);

  /**
   * Fetch current location (one-shot)
   */
  const getLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        const granted = await requestPermission();
        if (!granted) return null;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation(loc);
      return loc;
    } catch (err) {
      console.error(err);
      setError("Failed to get location");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [requestPermission]);

  /**
   * Check permission once on mount
   */
  useEffect(() => {
    Location.getForegroundPermissionsAsync().then(({ status }) => {
      setPermissionGranted(status === Location.PermissionStatus.GRANTED);
    });
  }, []);

  return {
    location,
    error,
    isLoading,
    permissionGranted,
    requestPermission,
    getLocation,
  };
}
