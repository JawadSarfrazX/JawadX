import { supabase } from "../../../services/supabase";

export async function getFees() {
  const { data, error } = await supabase
    .from("fees")
    .select("id, category, amount, paid, due_date, student:students(name, student_code)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getStudentOptions() {
  const { data, error } = await supabase
    .from("students")
    .select("id, name, student_code")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function addFee({ student_id, category, amount, due_date }) {
  const { error } = await supabase.from("fees").insert({
    student_id,
    category,
    amount: Number(amount),
    due_date: due_date || null,
    paid: false,
  });
  if (error) throw error;
}

export async function setFeePaid(id, paid) {
  const { error } = await supabase.from("fees").update({ paid }).eq("id", id);
  if (error) throw error;
}

export async function deleteFee(id) {
  const { error } = await supabase.from("fees").delete().eq("id", id);
  if (error) throw error;
}