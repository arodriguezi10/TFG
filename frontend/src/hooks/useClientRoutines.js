import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useTargetUser } from "./useTargetUser";

export const useClientRoutines = () => {
  const { targetUserId } = useTargetUser();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetUserId) return;
    const fetchRoutines = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("routines")
        .select("*, routine_exercises(id)")
        .eq("user_id", targetUserId)
        .order("created_at", { ascending: false });
      if (!error) setRoutines(data || []);
      setLoading(false);
    };
    fetchRoutines();
  }, [targetUserId]);

  return { routines, loading };
};