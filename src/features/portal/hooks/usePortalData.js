import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";

export default function usePortalData(user) {
  const [record, setRecord] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;
  const role = user?.role;

  useEffect(() => {
    if (!userId) return;
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const isTeacher = role === "teacher";
        const { data: rec, error } = await supabase
          .from(isTeacher ? "teachers" : "students")
          .select("*")
          .eq("profile_id", userId)
          .maybeSingle();
        if (error) throw error;

        let list = [];
        if (rec && isTeacher) {
          const { data, error: cErr } = await supabase
            .from("courses")
            .select("id, code, title")
            .eq("teacher_id", rec.id)
            .order("code");
          if (cErr) throw cErr;
          list = data ?? [];
        } else if (rec) {
          const { data, error: eErr } = await supabase
            .from("enrollments")
            .select("course:courses(id, code, title, teacher:teachers(name))")
            .eq("student_id", rec.id);
          if (eErr) throw eErr;
          list = (data ?? []).map((e) => e.course).filter(Boolean);
        }

        if (alive) {
          setRecord(rec ?? null);
          setCourses(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => { alive = false; };
  }, [userId, role]);

  return { record, courses, loading };
}