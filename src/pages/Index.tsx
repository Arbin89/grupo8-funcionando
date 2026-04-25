import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  MapPin, Phone, Clock, Mail, ArrowRight,
  Sparkles, UtensilsCrossed, Star, ChefHat, Award,
} from "lucide-react";

// ─── Images ───────────────────────────────────────────────────────────────────

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=900&fit=crop&q=90";
const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=640&fit=crop&q=90";
const CARD_IMAGES = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop&q=80",
];

// ─── Data ─────────────────────────────────────────────────────────────────────

const featureCards = [
  {
    icon: ChefHat,
    image: CARD_IMAGES[0],
    title: "Menú Exquisito",
    desc: "Más de 100 platos cuidadosamente seleccionados con ingredientes frescos y técnicas contemporáneas.",
    accent: "text-orange-400",
    border: "border-orange-500/20",
  },
  {
    icon: Award,
    image: CARD_IMAGES[1],
    title: "Chef Experto",
    desc: "Nuestro equipo culinario prepara cada plato con precisión, pasión y constancia en la calidad.",
    accent: "text-sky-400",
    border: "border-sky-500/20",
  },
  {
    icon: Star,
    image: CARD_IMAGES[2],
    title: "Experiencia Premium",
    desc: "Servicio impecable, ambiente elegante y atención al detalle en cada momento de tu visita.",
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
  },
];

const contactInfo = [
  {
    icon: MapPin,
    label: "Dirección",
    lines: ["Avenida Principal 123, Centro, 10000", "Santo Domingo, República Dominicana"],
  },
  { icon: Phone, label: "Teléfono",  lines: ["+1 (809) 555-0123"] },
  { icon: Clock, label: "Horario",   lines: ["Lunes a Viernes: 12:00 PM – 11:00 PM", "Sábado y Domingo: 1:00 PM – 12:00 AM"] },
  { icon: Mail,  label: "Email",     lines: ["info@siger.com"] },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Index = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fffdf7] text-slate-900 dark:bg-[#0a0c10] dark:text-slate-100">

      {/* ── Background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#fff4d6_0%,#fff9eb_32%,#ffffff_70%)] dark:hidden" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_top_left,#141a24_0%,#0d121b_36%,#0a0c10_72%)] dark:block" />
        <div className="absolute left-[-10%] top-[-6%] h-[500px] w-[500px] rounded-full bg-amber-500/18 blur-[150px] dark:bg-orange-600/7" />
        <div className="absolute right-[-6%] top-[18%] h-[380px] w-[380px] rounded-full bg-yellow-400/15 blur-[130px] dark:bg-sky-600/5" />
        <div className="absolute bottom-[8%] left-[38%] h-[320px] w-[320px] rounded-full bg-orange-400/12 blur-[110px] dark:bg-emerald-600/4" />
        <div
          className="absolute inset-0 opacity-[0.016] dark:opacity-[0.022]"
          style={{ backgroundImage: "linear-gradient(#0f172a 1px,transparent 1px),linear-gradient(90deg,#0f172a 1px,transparent 1px)", backgroundSize: "42px 42px" }}
        />
      </div>

      <div className="relative z-20">
        <Navbar />
      </div>

      <main className="relative z-10">

        {/* ── Hero ── */}
        <section className="px-4 pb-20 pt-8 md:px-8 md:pb-28 md:pt-12">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">

            {/* Left copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/60 bg-orange-100/80 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-800 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
                <Sparkles className="h-3.5 w-3.5" />
                Experiencia gastronómica
              </span>

              <h1 className="mt-5 text-5xl font-black leading-[1.07] tracking-tight text-slate-900 md:text-7xl dark:text-white">
                Reserva en{" "}
                <span className="relative inline-block text-orange-500">
                  SIGER
                  <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-orange-500/30" />
                </span>{" "}
                y vive una noche que no olvidarás
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg dark:text-slate-400">
                Tradición e innovación en cada plato. Menú curado, ambiente elegante y un servicio diseñado para impresionar.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/reservar"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-black shadow-[0_8px_30px_-8px_rgba(249,115,22,0.6)] transition hover:bg-orange-400 hover:shadow-[0_8px_30px_-8px_rgba(249,115,22,0.8)]"
                >
                  Reservar ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.07]"
                >
                  Ver menú
                </Link>
              </div>

              {/* Social proof strip */}
              <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-slate-200/80 pt-8 dark:border-white/[0.07]">
                <div className="text-center">
                  <p className="text-2xl font-black text-orange-500">+100</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Platos</p>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-white/[0.08]" />
                <div className="text-center">
                  <p className="text-2xl font-black text-orange-500">4.9★</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Calificación</p>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-white/[0.08]" />
                <div className="text-center">
                  <p className="text-2xl font-black text-orange-500">+5k</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-500">Clientes</p>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div
              className="relative overflow-hidden rounded-3xl border border-amber-200/70 shadow-[0_28px_70px_-30px_rgba(120,53,15,0.45)] dark:border-white/[0.08] dark:shadow-[0_36px_90px_-35px_rgba(0,0,0,0.9)]"
              style={{ transform: `translateY(${Math.min(scrollY * 0.07, 16)}px)` }}
            >
              <img
                src={HERO_IMAGE}
                alt="SIGER Restaurant"
                className="h-[460px] w-full object-cover md:h-[540px]"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

              {/* Floating badge */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-white/20 bg-black/40 px-3 py-2 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-white">Mesas disponibles</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300">Reserva inteligente</p>
                <p className="mt-1 text-xl font-black text-white">Gestiona tu mesa en segundos</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <section className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">

            {/* Image */}
            <div
              className="relative overflow-hidden rounded-3xl border border-amber-200/70 shadow-[0_24px_60px_-28px_rgba(120,53,15,0.4)] dark:border-white/[0.08] dark:shadow-[0_30px_80px_-32px_rgba(0,0,0,0.82)]"
              style={{ transform: `translateY(${Math.max(0, 50 - scrollY * 0.1)}px)` }}
            >
              <img
                src={ABOUT_IMAGE}
                alt="Chef en cocina de SIGER"
                className="h-[420px] w-full object-cover transition duration-700 hover:scale-[1.03]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&h=640&fit=crop&q=90";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/30 to-transparent" />

              {/* Stat card overlaid */}
              <div className="absolute bottom-4 right-4 rounded-2xl border border-white/20 bg-black/50 px-4 py-3 text-center backdrop-blur-md">
                <p className="text-2xl font-black text-white">8+</p>
                <p className="text-xs font-medium text-slate-300">Años de experiencia</p>
              </div>
            </div>

            {/* Copy */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-500 dark:text-orange-400/80">
                Sobre SIGER
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl dark:text-white">
                Tradición, técnica y una cocina con carácter
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                En SIGER fusionamos ingredientes frescos con técnicas modernas para entregar una experiencia memorable en cada visita. Nuestro equipo trabaja con enfoque en sabor, consistencia y excelencia.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Desde cenas íntimas hasta encuentros especiales, diseñamos cada detalle para que tu momento sea único.
              </p>

              <Link
                to="/menu"
                className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-800 backdrop-blur transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.07]"
              >
                Explorar menú <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto w-full max-w-7xl">
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-500 dark:text-orange-400/80">
                Nuestras ventajas
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-5xl dark:text-white">
                ¿Por qué elegir <span className="text-orange-500">SIGER</span>?
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {featureCards.map((card) => (
                <article
                  key={card.title}
                  className={`group overflow-hidden rounded-3xl border ${card.border} bg-white/85 shadow-[0_14px_40px_-20px_rgba(0,0,0,0.12)] backdrop-blur-sm transition hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] dark:bg-[#111318] dark:shadow-[0_16px_50px_-22px_rgba(0,0,0,0.7)]`}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className={`absolute bottom-3 left-4 flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 backdrop-blur-md`}>
                      <card.icon className={`h-4.5 w-4.5 ${card.accent}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{card.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact / CTA ── */}
        <section className="px-4 pb-20 pt-10 md:px-8 md:pb-28">
          <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-amber-200/70 bg-white/90 shadow-[0_24px_70px_-28px_rgba(120,53,15,0.38)] dark:border-white/[0.08] dark:bg-[#111318] dark:shadow-[0_30px_80px_-35px_rgba(0,0,0,0.82)] lg:grid lg:grid-cols-[1fr,0.85fr]">

            {/* Info */}
            <div className="p-7 md:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 dark:text-orange-400/80">
                Encuéntranos
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-3xl dark:text-white">
                Visítanos en Santo Domingo
              </h3>

              <div className="mt-7 space-y-5">
                {contactInfo.map(({ icon: Icon, label, lines }) => (
                  <div key={label} className="flex gap-3.5">
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                      <Icon className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">{label}</p>
                      {lines.map((line, i) => (
                        <p key={i} className="mt-0.5 text-sm text-slate-700 dark:text-slate-400">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA panel */}
            <div className="relative flex flex-col justify-center overflow-hidden border-t border-amber-200/70 bg-amber-50/70 p-7 dark:border-white/[0.07] dark:bg-[#0f1117] md:p-10">
              {/* Decorative blob */}
              <div className="pointer-events-none absolute right-[-20%] top-[-20%] h-64 w-64 rounded-full bg-orange-400/10 blur-[80px] dark:bg-orange-500/8" />

              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-300/60 bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-800 dark:border-orange-500/25 dark:bg-orange-500/10 dark:text-orange-300">
                <UtensilsCrossed className="h-3 w-3" />
                Reserva rápida
              </span>

              <h4 className="relative mt-5 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Tu mesa te espera
              </h4>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Agenda tu visita en segundos y vive una experiencia gastronómica diseñada para sorprender.
              </p>

              <div className="relative mt-7 space-y-3">
                <Link
                  to="/reservar"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-black shadow-[0_8px_24px_-8px_rgba(249,115,22,0.55)] transition hover:bg-orange-400 hover:shadow-[0_8px_24px_-8px_rgba(249,115,22,0.75)]"
                >
                  Reservar mesa
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/menu"
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.07]"
                >
                  Explorar menú
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-amber-200/70 bg-white/70 px-4 py-8 text-slate-700 backdrop-blur dark:border-white/[0.07] dark:bg-[#0c0e13] dark:text-slate-500 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/15 ring-1 ring-orange-500/25">
              <UtensilsCrossed className="h-3.5 w-3.5 text-orange-400" />
            </div>
            <span className="font-black text-slate-900 dark:text-white">SIGER</span>
          </div>
          <p className="text-xs">© 2026 SIGER · Sistema de Gestión de Restaurante</p>
          <div className="flex gap-4 text-xs">
            <Link to="/menu"    className="transition hover:text-orange-500">Menú</Link>
            <Link to="/reservar" className="transition hover:text-orange-500">Reservar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;