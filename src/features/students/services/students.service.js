import { supabase } from "../../../services/supabase";

// DB row ko UI format mein badalna (UI mein id = student_code dikhta hai)
const toUi = (s) => ({
  id: s.student_code,
  name: s.name,
  dept: s.dept,
  semester: s.semester,
  status: s.status,
  joined: s.joined,
});

export async function getStudents() {
  const { data, error } = await supabase
    .from("students")
    .select("student_code, name, dept, semester, status, joined, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(toUi);
}

export async function addStudent(payload) {
  const student_code = `ST-${Date.now().toString().slice(-6)}`;
  const { data, error } = await supabase
    .from("students")
    .insert({
      student_code,
      name: payload.name,
      dept: payload.dept,
      semester: 1,
      status: "Active",
    })
    .select()
    .single();
  if (error) throw error;
  return toUi(data);
}
