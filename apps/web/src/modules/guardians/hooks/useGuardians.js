import { useEffect, useMemo, useState } from "react";
import { getGuardians } from "../services/guardians.service";

export function useGuardians() {
  const [guardians, setGuardians] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadGuardians() {
    setLoading(true);
    setError("");

    try {
      const data = await getGuardians();
      setGuardians(data);
    } catch (err) {
      console.error(err);
      setError("تعذر تحميل بيانات أولياء الأمور.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGuardians();
  }, []);

  const filteredGuardians = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return guardians;

    return guardians.filter((guardian) =>
      [
        guardian.fullName,
        guardian.phone,
        guardian.alternatePhone,
        guardian.email,
        guardian.relationType,
        guardian.jobTitle
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [guardians, search]);

  const stats = useMemo(() => {
    return {
      total: guardians.length,
      active: guardians.filter((g) => g.status === "active").length,
      withChildren: guardians.filter((g) => (g.childrenCount || 0) > 0).length,
      phonePreferred: guardians.filter((g) => g.preferredContactMethod === "phone").length
    };
  }, [guardians]);

  return {
    guardians,
    filteredGuardians,
    search,
    setSearch,
    loading,
    error,
    stats,
    reload: loadGuardians
  };
}