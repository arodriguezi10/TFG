import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401, headers: corsHeaders });
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Usuario no encontrado" }), { status: 401, headers: corsHeaders });
  }

  const userId = user.id;

  // Borrado manual en cascada
  await supabase.from("workout_exercise_logs").delete().eq("user_id", userId);
  await supabase.from("workout_sessions").delete().eq("user_id", userId);
  await supabase.from("routine_exercises").delete().in("routine_id",
    (await supabase.from("routines").select("id").eq("user_id", userId)).data?.map(r => r.id) || []
  );
  await supabase.from("routines").delete().eq("user_id", userId);
  await supabase.from("weight_logs").delete().eq("user_id", userId);
  await supabase.from("daily_checkins").delete().eq("user_id", userId);
  await supabase.from("progressions").delete().eq("user_id", userId);
  await supabase.from("exercises").delete().eq("user_id", userId).eq("is_custom", true);
  await supabase.from("league_members").delete().eq("user_id", userId);
  await supabase.from("leagues").delete().eq("owner_id", userId);
  await supabase.from("users").delete().eq("id", userId);

  // Borrar de auth
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
});