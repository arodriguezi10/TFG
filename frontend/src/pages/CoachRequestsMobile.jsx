import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { ChevronLeft, CheckCircle2, X, Clock, Users } from "lucide-react";
import Card from "../components/Card";

const CoachRequestsMobile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => { if (user) loadRequests(); }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const { data: relations } = await supabase
        .from("coach_client_relations")
        .select("id, coach_id, status, created_at")
        .eq("client_id", user.id)
        .eq("status", "pending");

      if (!relations || relations.length === 0) { setRequests([]); return; }

      const coachIds = relations.map(r => r.coach_id);
      const { data: coaches } = await supabase
        .from("users")
        .select("id, first_name, last_name, email")
        .in("id", coachIds);

      const enriched = relations.map(r => ({
        ...r,
        coach: coaches?.find(c => c.id === r.coach_id) || null,
      }));

      setRequests(enriched);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleRespond = async (relationId, status) => {
    setProcessing(relationId);
    try {
      const { error } = await supabase
        .from("coach_client_relations")
        .update({ status })
        .eq("id", relationId);
      if (error) throw error;
      setRequests(prev => prev.filter(r => r.id !== relationId));
    } catch (err) { console.error(err); alert("Error al procesar la solicitud"); }
    finally { setProcessing(null); }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-4 pt-14 pb-4 border-b border-text-low/20 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Perfil</p>
          <h1 className="font-heading font-extrabold text-[24px] text-text-high">Solicitudes de entrenador</h1>
        </div>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-3">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="bg-surf h-20 w-20 rounded-3xl border border-text-low flex items-center justify-center">
              <Users size={36} className="text-text-low" />
            </div>
            <p className="font-heading font-bold text-[18px] text-text-high">Sin solicitudes pendientes</p>
            <p className="font-body text-[13px] text-text-low text-center">Cuando un entrenador quiera vincularse contigo aparecera aqui</p>
          </div>
        ) : (
          <>
            <p className="font-body text-[13px] text-text-low">{requests.length} solicitud{requests.length !== 1 ? "es" : ""} pendiente{requests.length !== 1 ? "s" : ""}</p>
            {requests.map(request => (
              <Card key={request.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary-bg h-12 w-12 rounded-2xl border border-primary flex items-center justify-center font-heading font-bold text-[20px] text-primary shrink-0">
                    {(request.coach?.first_name || "E").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-bold text-[16px] text-text-high">
                      {`${request.coach?.first_name || ""} ${request.coach?.last_name || ""}`.trim() || "Entrenador"}
                    </p>
                    <p className="font-body text-[12px] text-text-low">{request.coach?.email}</p>
                  </div>
                  <span className="bg-orange-bg2 border border-orange px-2.5 py-1 rounded-full font-subheading font-bold text-[11px] text-orange flex items-center gap-1">
                    <Clock size={11} /> Pendiente
                  </span>
                </div>

                <div className="bg-surf border border-text-low rounded-xl p-3 mb-4">
                  <p className="font-body text-[12px] text-text-low leading-relaxed">
                    Este entrenador quiere vincularse contigo. Si aceptas, podra ver tu progreso, rutinas y planificacion. Puedes revocar el acceso en cualquier momento.
                  </p>
                  <p className="font-body text-[11px] text-text-low/60 mt-2">Solicitud recibida el {formatDate(request.created_at)}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespond(request.id, "rejected")}
                    disabled={processing === request.id}
                    className="flex-1 bg-surf border border-red py-2.5 rounded-xl font-heading font-bold text-[14px] text-red flex items-center justify-center gap-2 hover:bg-red/5 transition-colors disabled:opacity-50"
                  >
                    <X size={15} /> Rechazar
                  </button>
                  <button
                    onClick={() => handleRespond(request.id, "active")}
                    disabled={processing === request.id}
                    className="flex-1 bg-accent3 py-2.5 rounded-xl font-heading font-bold text-[14px] text-background flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {processing === request.id
                      ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-background" />
                      : <><CheckCircle2 size={15} /> Aceptar</>}
                  </button>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CoachRequestsMobile;