import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { ChevronLeft, CheckCircle2, X, Clock, Users, Shield } from "lucide-react";
import Card from "../components/Card";

const CoachRequestsDesktop = () => {
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

      setRequests(relations.map(r => ({ ...r, coach: coaches?.find(c => c.id === r.coach_id) || null })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleRespond = async (relationId, status) => {
    setProcessing(relationId);
    try {
      const { error } = await supabase.from("coach_client_relations").update({ status }).eq("id", relationId);
      if (error) throw error;
      setRequests(prev => prev.filter(r => r.id !== relationId));
    } catch (err) { console.error(err); alert("Error al procesar la solicitud"); }
    finally { setProcessing(null); }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-8 pt-8 pb-6 border-b border-text-low/20 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Perfil</p>
          <h1 className="font-heading font-extrabold text-[28px] text-text-high">Solicitudes de entrenador</h1>
        </div>
      </div>

      <div className="flex-1 px-8 py-8 grid grid-cols-2 gap-10 max-w-4xl">

        {/* COLUMNA IZQUIERDA — SOLICITUDES */}
        <div className="flex flex-col gap-4">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="bg-surf h-24 w-24 rounded-3xl border border-text-low flex items-center justify-center">
                <Users size={44} className="text-text-low" />
              </div>
              <p className="font-heading font-bold text-[20px] text-text-high">Sin solicitudes pendientes</p>
              <p className="font-body text-[14px] text-text-low text-center">Cuando un entrenador quiera vincularse contigo aparecera aqui</p>
            </div>
          ) : (
            <>
              <p className="font-body text-[13px] text-text-low">{requests.length} solicitud{requests.length !== 1 ? "es" : ""} pendiente{requests.length !== 1 ? "s" : ""}</p>
              {requests.map(request => (
                <Card key={request.id}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary-bg h-14 w-14 rounded-2xl border border-primary flex items-center justify-center font-heading font-bold text-[24px] text-primary shrink-0">
                      {(request.coach?.first_name || "E").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-[18px] text-text-high">
                        {`${request.coach?.first_name || ""} ${request.coach?.last_name || ""}`.trim() || "Entrenador"}
                      </p>
                      <p className="font-body text-[13px] text-text-low">{request.coach?.email}</p>
                      <span className="mt-1 inline-flex items-center gap-1 bg-orange-bg2 border border-orange px-2.5 py-0.5 rounded-full font-subheading font-bold text-[11px] text-orange">
                        <Clock size={11} /> Recibida el {formatDate(request.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => handleRespond(request.id, "rejected")} disabled={processing === request.id}
                      className="flex-1 bg-surf border border-red py-3 rounded-xl font-heading font-bold text-[14px] text-red flex items-center justify-center gap-2 hover:bg-red/5 transition-colors disabled:opacity-50">
                      <X size={16} /> Rechazar
                    </button>
                    <button onClick={() => handleRespond(request.id, "active")} disabled={processing === request.id}
                      className="flex-1 bg-accent3 py-3 rounded-xl font-heading font-bold text-[14px] text-background flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                      {processing === request.id
                        ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-background" />
                        : <><CheckCircle2 size={16} /> Aceptar</>}
                    </button>
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* COLUMNA DERECHA — INFO */}
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-bg h-10 w-10 rounded-xl border border-primary flex items-center justify-center shrink-0">
                <Shield size={18} className="text-primary" />
              </div>
              <p className="font-heading font-bold text-[16px] text-text-high">Tu privacidad primero</p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { title: "Control total", desc: "Solo tu decides quien puede ver tus datos. Nadie accede sin tu permiso." },
                { title: "Acceso limitado", desc: "El entrenador puede ver tu progreso y rutinas, pero no puede modificar tu cuenta ni tus datos personales." },
                { title: "Revocacion inmediata", desc: "Puedes eliminar la vinculacion en cualquier momento desde tu perfil." },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3 py-3 border-b border-text-low/20 last:border-0 last:pb-0">
                  <CheckCircle2 size={16} className="text-accent3 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-subheading font-bold text-[14px] text-text-high mb-0.5">{title}</p>
                    <p className="font-body text-[13px] text-text-low">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachRequestsDesktop;