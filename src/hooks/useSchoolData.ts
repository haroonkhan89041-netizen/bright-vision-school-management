import { useCallback, useEffect, useState } from "react";
import { loadSchoolData, type SchoolData } from "../services/schoolDataService";

export function useSchoolData(enabled = true) {
  const [data, setData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      setData(await loadSchoolData());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load school data");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => { void refresh(); }, [refresh]);
  return { data, loading, error, refresh };
}
