import { useEffect, useMemo, useState } from "react";
import { getStudents } from "../services/students.service";

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStudents() {
    setLoading(true);
    setError("");

    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError("تعذر تحميل بيانات الطلاب.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return students;

    return students.filter((student) =>
      [student.fullName, student.phone, student.guardianName, student.levelName, student.className]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [students, search]);

  const stats = useMemo(() => {
    return {
      total: students.length,
      male: students.filter((s) => s.gender === "male").length,
      female: students.filter((s) => s.gender === "female").length,
      active: students.filter((s) => s.status === "active").length
    };
  }, [students]);

  return {
    students,
    filteredStudents,
    search,
    setSearch,
    loading,
    error,
    stats,
    reload: loadStudents
  };
}
