import { useCallback, useEffect, useState } from "react";
import { getStudents, addStudent } from "../services/students.service";

export default function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getStudents().then(setStudents).finally(() => setLoading(false)); }, []);

  const create = useCallback(async (payload) => {
    const s = await addStudent(payload);
    setStudents((prev) => [s, ...prev]);
  }, []);

  return { students, loading, create };
}
