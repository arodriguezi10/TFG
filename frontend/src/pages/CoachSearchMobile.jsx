import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { ChevronLeft, Search, UserPlus, CheckCircle2, Clock, X } from "lucide-react";
import Card from "../components/Card";

const CoachSearchMobile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // { found, user, relationStatus }
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!email.trim()) return;
    setSearching(true);
    setResult(null);
    setError("");

    try {
      // Buscar usuario por email
      const { data: foundUser, error: userError } = await supabase
        .from("users")
        .select("id, first_name, last_name, subscription_tier, role")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle();

      if (userError) throw userError;

      if (!foundUser) {
        setResult({ found: false });
        return;
      }

      if (foundUser.id === user.id) {
        setError("No puedes enviarte una solicitud a ti mismo");
        return;
      }

      if (foundUser.role === "coach") {
        setError("Este usuario es un entrenador, no un atleta");
        return;
      }

      // Ver si ya existe relacion
      const { data: existing } = await supabase
        .from("coach_client_relations")
        .select("status")
        .eq("coach_id", user.id)
        .eq("client_id", foundUser.id)
        .maybeSingle();

      setResult({
        found: true,
        user: {
          ...foundUser,
          fullName: `${foundUser.first_name || ""} ${foundUser.last_name || ""}`.trim() || "Atleta",
        },
        relationStatus: existing?.status || null,
      });
    } catch (err) {
      console.error(err);
      setError("Error al buscar el usuario");
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async () => {
    if (!result?.user) return;
    setSending(true);
    try {
      const { error } = await supabase
        .from("coach_client_relations")
        .insert({ coach_id: user.id, client_id: result.user.id, status: "pending" });

      if (error) throw error;

      setResult(prev => ({ ...prev, relationStatus: "pending" }));
    } catch (err) {
      console.error(err);
      setError("Error al enviar la solicitud");
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "active") return (
      <span className="flex items-center gap-1.5 bg-accent3/10 border border-accent3 px-3 py-1.5 rounded-xl font-subheading font-bold text-[13px] text-accent3">
        <CheckCircle2 size={14} /> Vinculado
      </span>
    );
    if (status === "pending") return (
      <span className="flex items-center gap-1.5 bg-orange-bg2 border border-orange px-3 py-1.5 rounded-xl font-subheading font-bold text-[13px] text-orange">
        <Clock size={14} /> Solicitud enviada
      </span>
    );
    if (status === "rejected") return (
      <span className="flex items-center gap-1.5 bg-red-bg1 border border-red px-3 py-1.5 rounded-xl font-subheading font-bold text-[13px] text-red">
        <X size={14} /> Solicitud rechazada
      </span>
    );
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="px-4 pt-14 pb-4 border-b border-text-low/20 flex items-center gap-3">
        <button onClick={() => navigate("/coach")} className="bg-surf h-10 w-10 rounded-xl border border-text-low flex items-center justify-center text-text-low hover:text-text-high transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="font-subheading text-[12px] text-text-low uppercase tracking-wide mb-0.5">Entrenador</p>
          <h1 className="font-heading font-extrabold text-[24px] text-text-high">Buscar atleta</h1>
        </div>
      </div>

      <div className="px-4 pt-6 flex flex-col gap-5">
        {/* BUSCADOR */}
        <div>
          <p className="font-subheading font-bold text-[12px] text-text-low uppercase tracking-wide mb-2">Email del atleta</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="atleta@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setResult(null); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-surf border border-text-low rounded-xl px-4 py-3 font-body text-[14px] text-text-high outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !email.trim()}
              className="bg-primary h-12 w-12 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
            >
              {searching
                ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                : <Search size={18} className="text-text-high" />}
            </button>
          </div>
          {error && <p className="font-body text-[12px] text-red mt-2">{error}</p>}
        </div>

        {/* RESULTADO */}
        {result && !result.found && (
          <Card>
            <div className="flex flex-col items-center py-6 gap-2">
              <p className="font-heading font-bold text-[16px] text-text-high">No encontrado</p>
              <p className="font-body text-[13px] text-text-low text-center">No existe ninguna cuenta con ese email</p>
            </div>
          </Card>
        )}

        {result?.found && result.user && (
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-accent1 h-14 w-14 rounded-2xl flex items-center justify-center font-heading font-bold text-[24px] text-primary shrink-0">
                {result.user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-[18px] text-text-high">{result.user.fullName}</p>
                <p className="font-body text-[13px] text-text-low">{email}</p>
              </div>
            </div>

            {result.relationStatus ? (
              <div className="flex justify-center">{getStatusBadge(result.relationStatus)}</div>
            ) : (
              <button
                onClick={handleSendRequest}
                disabled={sending}
                className="w-full bg-primary py-3 rounded-2xl font-heading font-bold text-[15px] text-text-high flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {sending
                  ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                  : <><UserPlus size={16} /> Enviar solicitud</>}
              </button>
            )}
          </Card>
        )}

        {/* INFO */}
        {!result && !error && (
          <div className="bg-surf border border-text-low rounded-2xl p-4">
            <p className="font-heading font-bold text-[14px] text-text-high mb-2">Como funciona</p>
            <div className="flex flex-col gap-2">
              {[
                "Introduce el email del atleta",
                "Le enviamos una solicitud de vinculacion",
                "Cuando la acepte, podras supervisar su cuenta",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="bg-primary h-5 w-5 rounded-full flex items-center justify-center font-heading font-bold text-[11px] text-text-high shrink-0 mt-0.5">{i + 1}</div>
                  <p className="font-body text-[13px] text-text-low">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachSearchMobile;