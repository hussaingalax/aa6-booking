import { useEffect, useState } from "react";
import { supabase } from "./supabaseAdmin";

export type BookingRow = {
  id: string;
  created_at: string;
  name: string;
  mobile: string;
  amount: number;
  txn_id: string;
  screenshot_url: string;
  payment_status: "pending" | "completed" | "rejected";
  verified_at: string | null;
  attendance_status: "attended" | "not_attended";
  attendance_at: string | null;
};

export function useBookings() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
  setLoading(true);
  setError("");

  const res = await supabase
    .from("aa6_bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (res.error) {
    setError(res.error.message);
    setRows([]);
  } else {
    setRows((res.data || []) as BookingRow[]);
  }

  setLoading(false);
}

  useEffect(() => {
    load();
  }, []);

  return { rows, loading, error, reload: load };
}
