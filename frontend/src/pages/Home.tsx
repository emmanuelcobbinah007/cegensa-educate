import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FilePen,
  ScrollText,
  HeartHandshake,
  ChevronRight,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Scale,
  Landmark,
  UserCheck,
  Phone,
  Lock,
  Users2,
  Building2,
  Pin,
} from "lucide-react";
import Navbar from "../components/Navbar";

function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in-view");
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref as React.RefObject<HTMLElement>;
}

export default function Home() {
  const s1 = useReveal(),
    s2 = useReveal(),
    s3 = useReveal();
  const s4 = useReveal(),
    s5 = useReveal(),
    s6 = useReveal();

  return (
    <div className="min-h-screen bg-sand-100">
      <Navbar role="public" />

      {/* ── Hero ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-ocean-800"
        style={{ height: "100vh" }}
      >
        {/* Background blobs */}
        <div className="blob-1 absolute top-[-80px] right-[-80px] w-[520px] h-[520px] rounded-full bg-ocean-600/25 blur-[90px] pointer-events-none" />
        <div className="blob-2 absolute bottom-[-60px] left-[20%] w-[380px] h-[380px] rounded-full bg-terra-600/20 blur-[80px] pointer-events-none" />
        <div className="blob-3 absolute top-[40%] left-[-60px] w-[280px] h-[280px] rounded-full bg-ocean-500/15 blur-[70px] pointer-events-none" />

        {/* Content — centered; pb-[28vh] on desktop nudges center into the upper portion, leaving clean room for bubbles below */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 z-10 md:pb-[14vh]">
          <div className="max-w-2xl w-full text-center">
            <div className="hero-item hero-item-1 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-terra-400 animate-pulse" />
              <span className="text-xs text-ocean-200 font-medium font-sans tracking-wide">
                University of Ghana · Confidential Reporting
              </span>
            </div>

            <h1 className="hero-item hero-item-2 font-display text-4xl sm:text-5xl md:text-[5rem] font-bold text-white leading-[1.1] mb-5">
              You deserve
              <br />
              <span className="text-terra-300">to be heard.</span>
            </h1>

            <p className="hero-item hero-item-3 text-ocean-200 text-base sm:text-lg leading-relaxed mb-7 font-sans font-light max-w-xl mx-auto">
              What happened to you is not your fault — and you don't have to
              carry it alone. Kasa is your confidential space to speak, find
              support, and seek justice.
            </p>

            <div className="hero-item hero-item-4 flex flex-wrap justify-center gap-3 mb-6">
              <Link
                to="/report"
                className="group inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 bg-terra-500 hover:bg-terra-400 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-sans shadow-lg shadow-terra-900/30 text-sm sm:text-base"
              >
                Tell Us What Happened
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a
                href="#rights"
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 bg-white/10 hover:bg-white/[0.18] text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 font-sans hover:scale-[1.02] text-sm sm:text-base"
              >
                Know Your Rights
              </a>
            </div>

            <div className="hero-item hero-item-5 flex flex-wrap justify-center items-center gap-3 text-xs text-ocean-400 font-sans">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Fully confidential
              </span>
              <span className="hidden sm:block w-px h-3 bg-ocean-700" />
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Anonymous reporting
              </span>
              <span className="hidden sm:block w-px h-3 bg-ocean-700" />
              <span className="hidden sm:flex items-center gap-1.5">
                <Scale className="w-3 h-3" /> Independent review
              </span>
            </div>
          </div>
        </div>

        {/* Bubbles — bottom 1/3 of section, desktop only */}
        <div className="hidden md:block">
          {(
            [
              {
                cls: "bubble-a",
                Icon: Lock,
                text: "Your story is safe with us",
                style: { top: "68%", left: "6%" },
              },
              {
                cls: "bubble-b",
                Icon: ShieldCheck,
                text: "Speaking up cannot hurt you here",
                style: { top: "73%", right: "5%" },
              },
              {
                cls: "bubble-c",
                Icon: HeartHandshake,
                text: "You won't face this alone",
                style: { top: "80%", left: "22%" },
              },
              {
                cls: "bubble-d",
                Icon: Phone,
                text: "Heard by people who genuinely care",
                style: { top: "83%", right: "19%" },
              },
              {
                cls: "bubble-e",
                Icon: Scale,
                text: "Your voice matters here",
                style: { top: "89%", left: "42%" },
              },
            ] as {
              cls: string;
              Icon: React.ElementType;
              text: string;
              style: React.CSSProperties;
            }[]
          ).map(({ cls, Icon, text, style }) => (
            <div
              key={text}
              className={`${cls} absolute pointer-events-none`}
              style={style}
            >
              <div className="flex items-center gap-2.5 bg-white/[0.07] backdrop-blur-sm border border-white/[0.12] rounded-full px-4 py-2.5">
                <Icon
                  className="w-3.5 h-3.5 text-ocean-400/80 flex-shrink-0"
                  strokeWidth={1.5}
                />
                <span className="text-xs text-ocean-300/75 font-sans font-light whitespace-nowrap">
                  {text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust bar ──────────────────────────────────── */}
      <section
        ref={s1 as React.RefObject<HTMLElement>}
        className="reveal bg-white border-b border-sand-200"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-x-8 gap-y-3 items-center justify-center">
          {[
            { Icon: Lock, label: "Fully Confidential" },
            { Icon: Scale, label: "60-Day Investigation Window" },
            { Icon: Users2, label: "Anti-Sexual Harassment Committee" },
            { Icon: ShieldCheck, label: "Zero Retaliation Policy" },
          ].map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-xs font-medium text-gray-500 font-sans"
            >
              <Icon className="w-3.5 h-3.5 text-ocean-500" strokeWidth={2} />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* ── How We Help — Bento ─────────────────────────── */}
      <section
        ref={s2 as React.RefObject<HTMLElement>}
        className="reveal max-w-6xl mx-auto px-6 py-24"
        id="learn"
      >
        <div className="mb-12">
          <span className="text-xs font-bold text-terra-500 tracking-widest uppercase font-sans">
            However You Need Us
          </span>
          <h2 className="font-display text-4xl font-bold text-ocean-800 mt-2 mb-3">
            We're Here For You
          </h2>
          <p className="text-gray-400 font-sans text-sm leading-relaxed max-w-md">
            There's no wrong way to reach out. Choose where you'd like to start.
          </p>
        </div>

        {/* Bento: 2-col, report card spans 2 rows */}
        <div className="grid md:grid-cols-2 md:grid-rows-2 gap-4">
          {/* Report — large, spans 2 rows */}
          <div className="md:row-span-2 group relative overflow-hidden rounded-3xl bg-ocean-800 p-9 flex flex-col justify-between min-h-[400px] hover:shadow-2xl hover:shadow-ocean-900/30 transition-all duration-500">
            <div className="blob-1 absolute top-0 right-0 w-72 h-72 bg-terra-600/20 rounded-full blur-3xl translate-x-24 -translate-y-24 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
            <div className="blob-2 absolute bottom-0 left-0 w-56 h-56 bg-ocean-500/20 rounded-full blur-3xl -translate-x-16 translate-y-16 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-1.5 bg-terra-500/20 border border-terra-400/30 text-terra-300 text-[11px] font-bold px-3 py-1 rounded-full font-sans tracking-wider uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-terra-400 animate-pulse" />
                Safe &amp; Anonymous
              </div>
              <div className="w-14 h-14 bg-terra-500/20 border border-terra-400/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <FilePen
                  className="w-6 h-6 text-terra-300"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="font-display text-3xl font-bold text-white mb-4">
                File a Report
              </h3>
              <p className="text-ocean-200 leading-relaxed font-sans max-w-xs">
                Ready to speak up? Submit a confidential complaint in minutes.
                You can stay fully anonymous — no one will know who you are
                unless you choose to share.
              </p>
            </div>

            <div className="relative mt-8">
              <Link
                to="/report"
                className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-terra-500 hover:bg-terra-400 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-sans"
              >
                Start Your Report
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* Know the Policy */}
          <div className="group relative overflow-hidden rounded-3xl bg-white border border-sand-200 p-7 flex flex-col justify-between hover:-translate-y-1 hover:shadow-elevated hover:border-ocean-200 transition-all duration-300">
            <div>
              <div className="w-12 h-12 bg-ocean-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-ocean-100 transition-all duration-300">
                <ScrollText
                  className="w-5 h-5 text-ocean-600"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-800 mb-2">
                Know the Policy
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Understand what counts as misconduct, your rights during the
                process, and what to expect from first report to final decision.
              </p>
            </div>
            <a
              href="#definitions"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-600 hover:text-ocean-800 transition-colors font-sans group-hover:gap-3"
            >
              Read the Policy <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Get Support */}
          <div className="group relative overflow-hidden rounded-3xl bg-terra-50 border border-terra-100 p-7 flex flex-col justify-between hover:-translate-y-1 hover:shadow-elevated hover:border-terra-200 transition-all duration-300">
            <div>
              <div className="w-12 h-12 bg-terra-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-terra-200 transition-all duration-300">
                <HeartHandshake
                  className="w-5 h-5 text-terra-600"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-800 mb-2">
                Get Support
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-sans">
                CEGENSA offers free, confidential counselling. You don't need to
                file a report to access support — just reach out whenever you're
                ready.
              </p>
            </div>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-terra-600 hover:text-terra-800 transition-colors font-sans group-hover:gap-3"
            >
              Talk to Someone <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Definitions — Bento ─────────────────────────── */}
      <section
        ref={s3 as React.RefObject<HTMLElement>}
        className="reveal bg-white py-24"
        id="definitions"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-xs font-bold text-terra-500 tracking-widest uppercase font-sans">
              Policy Definitions
            </span>
            <h2 className="font-display text-4xl font-bold text-ocean-800 mt-2 mb-3">
              Understanding What Happened
            </h2>
            <p className="text-gray-400 font-sans text-sm max-w-md">
              The Policy names and recognises these experiences. What you went
              through has a name — and it matters.
            </p>
          </div>

          {/* Bento: alternating sizes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-ocean-50 border border-ocean-100 p-8 hover:bg-ocean-100/60 hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300">
              <h4 className="font-display text-xl font-semibold text-ocean-800 mb-3">
                Sexual Harassment
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                Unwelcome conduct of a sexual nature — verbal, non-verbal,
                written, electronic, graphic, or physical — when submission or
                rejection affects employment, academic standing, or creates a
                hostile environment.
              </p>
              <Pin className="absolute bottom-4 right-4 w-10 h-10 text-ocean-200 group-hover:text-ocean-300 transition-colors duration-300" strokeWidth={1.25} />
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-red-50 border border-red-100 p-8 hover:bg-red-100/60 hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300">
              <h4 className="font-display text-xl font-semibold text-red-800 mb-3">
                Sexual Abuse
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                Forceful sexual contact that humiliates or degrades, or violates
                another's sexual integrity — including contact by someone aware
                of being HIV-positive without prior disclosure.
              </p>
              <Pin className="absolute bottom-4 right-4 w-10 h-10 text-red-200 group-hover:text-red-300 transition-colors duration-300" strokeWidth={1.25} />
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-orange-50 border border-orange-100 p-8 hover:bg-orange-100/60 hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300">
              <h4 className="font-display text-xl font-semibold text-orange-800 mb-3">
                Sexual Assault
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                Any sexual intercourse or contact without consent. Consent
                obtained through force, coercion, or incapacitation does not
                qualify — ever.
              </p>
              <Pin className="absolute bottom-4 right-4 w-10 h-10 text-orange-200 group-hover:text-orange-300 transition-colors duration-300" strokeWidth={1.25} />
            </div>

            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-terra-50 border border-terra-100 p-8 hover:bg-terra-100/60 hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300">
              <h4 className="font-display text-xl font-semibold text-terra-800 mb-3">
                Sexual Intimidation
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                Threatening to assault someone, indecent exposure, and stalking
                — following a person, sending harassing messages, making
                unwanted calls, or vandalising property to cause fear. All are
                recognised misconduct.
              </p>
              <Pin className="absolute bottom-4 right-4 w-10 h-10 text-terra-200 group-hover:text-terra-300 transition-colors duration-300" strokeWidth={1.25} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Examples — pill cloud ───────────────────────── */}
      <section
        ref={s4 as React.RefObject<HTMLElement>}
        className="reveal py-24 max-w-6xl mx-auto px-6"
      >
        <div className="mb-10">
          <span className="text-xs font-bold text-terra-500 tracking-widest uppercase font-sans">
            Examples of Misconduct
          </span>
          <h2 className="font-display text-4xl font-bold text-ocean-800 mt-2 mb-3">
            You Are Not Imagining It
          </h2>
          <p className="text-gray-400 font-sans text-sm max-w-lg">
            These behaviours are recognised under UG Policy. If any of these
            have happened to you, you have the right to report.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            "Unwelcome sexual advances or propositions",
            "Inappropriate touching without consent",
            "Sharing pornographic material digitally",
            '"Quid pro quo" — grades linked to sexual compliance',
            "Persistent unwanted requests for dates",
            "Sexual jokes, innuendos, or gossip",
            "Leering, whistling, or sexual name-calling",
            "Stalking or repeated unwanted messages",
            "Using authority to coerce sexual contact",
            "Displaying sexually degrading content",
            "Retaliation for reporting misconduct",
            "Penalising someone for ending a relationship",
          ].map((item, i) => (
            <div
              key={i}
              className="group flex items-center gap-2.5 pl-4 pr-5 py-3 bg-white border border-sand-200 rounded-2xl hover:border-terra-300 hover:bg-terra-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              <div className="w-2 h-2 rounded-full bg-terra-400 flex-shrink-0 group-hover:scale-125 transition-transform" />
              <span className="text-sm text-gray-600 font-sans">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rights — dark bento ─────────────────────────── */}
      <section
        ref={s5 as React.RefObject<HTMLElement>}
        className="reveal bg-ocean-800 py-24"
        id="rights"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <span className="text-xs font-bold text-terra-300 tracking-widest uppercase font-sans">
              Your Rights
            </span>
            <h2 className="font-display text-4xl font-bold text-white mt-2 mb-3">
              These Are Your Guarantees.
            </h2>
            <p className="text-ocean-300 font-sans text-sm max-w-md">
              Not suggestions. Not guidelines. These are non-negotiable rights
              under University policy — for every person involved.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Featured full-width */}
            <div className="md:col-span-2 group flex items-start gap-6 p-8 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/25 rounded-3xl transition-all duration-300 hover:-translate-y-0.5">
              <div className="w-14 h-14 bg-terra-500/20 border border-terra-400/30 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <ShieldCheck
                  className="w-7 h-7 text-terra-300"
                  strokeWidth={1.75}
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-terra-400 tracking-widest uppercase font-sans">
                  Most Important
                </span>
                <h4 className="font-display text-2xl font-bold text-white mt-1 mb-2">
                  Non-Retaliation
                </h4>
                <p className="text-ocean-200 leading-relaxed font-sans max-w-2xl">
                  You shall not be reprimanded, discriminated against, or
                  punished for filing a complaint in good faith. Any retaliation
                  is itself treated as new misconduct — and the University takes
                  this seriously.
                </p>
              </div>
            </div>

            {[
              {
                Icon: Scale,
                title: "Right to Representation",
                desc: "Both complainant and respondent have the right to legal counsel during all proceedings.",
              },
              {
                Icon: KeyRound,
                title: "Strict Confidentiality",
                desc: "All matters are strictly confidential to protect your dignity and the integrity of the investigation.",
              },
              {
                Icon: Landmark,
                title: "Right to Appeal",
                desc: "Either party may appeal to the UG Appeals Board if dissatisfied with the Committee's decision.",
              },
              {
                Icon: UserCheck,
                title: "Presumption of Innocence",
                desc: "The respondent is presumed innocent until the Committee makes a final finding of culpability.",
              },
              {
                Icon: HeartHandshake,
                title: "Psycho-Social Support",
                desc: "The Committee may refer either party to CEGENSA for counselling and support at any stage.",
              },
              {
                Icon: Users2,
                title: "Fair Process",
                desc: "The 14-member Committee ensures gender parity and independence at every step of the investigation.",
              },
            ].map((r) => (
              <div
                key={r.title}
                className="group flex items-start gap-4 p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-3xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 group-hover:bg-white/15 transition-all duration-300">
                  <r.Icon
                    className="w-5 h-5 text-terra-300"
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-white mb-1">
                    {r.title}
                  </h4>
                  <p className="text-sm text-ocean-300 leading-relaxed font-sans">
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Institutions — bento ────────────────────────── */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <span className="text-xs font-bold text-terra-500 tracking-widest uppercase font-sans">
            Institutional Framework
          </span>
          <h2 className="font-display text-4xl font-bold text-ocean-800 mt-2">
            Who Handles Reports?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 group card border border-sand-200 hover:-translate-y-1 hover:shadow-elevated hover:border-ocean-200 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ocean-50 rounded-xl flex items-center justify-center group-hover:bg-ocean-100 group-hover:scale-110 transition-all duration-300">
                  <Users2
                    className="w-5 h-5 text-ocean-600"
                    strokeWidth={1.75}
                  />
                </div>
                <h4 className="font-sans font-semibold text-gray-800">
                  Anti-Sexual Harassment Committee
                </h4>
              </div>
              <span className="badge bg-ocean-50 text-ocean-700 font-semibold flex-shrink-0 ml-3">
                Primary Body
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              A 14-member body with gender parity responsible for receiving
              complaints, conducting investigations, and recommending sanctions
              to the Vice-Chancellor.
            </p>
          </div>

          <div className="group card border border-sand-200 hover:-translate-y-1 hover:shadow-elevated hover:border-terra-200 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-terra-50 rounded-xl flex items-center justify-center group-hover:bg-terra-100 group-hover:scale-110 transition-all duration-300">
                  <HeartHandshake
                    className="w-5 h-5 text-terra-600"
                    strokeWidth={1.75}
                  />
                </div>
                <h4 className="font-sans font-semibold text-gray-800">
                  CEGENSA
                </h4>
              </div>
              <span className="badge bg-terra-50 text-terra-700 font-semibold flex-shrink-0 ml-3">
                Support
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              The Centre for Gender Studies and Advocacy operates a crisis
              counselling unit and supports the Committee process.
            </p>
          </div>

          <div className="group card border border-sand-200 hover:-translate-y-1 hover:shadow-elevated transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ocean-50 rounded-xl flex items-center justify-center group-hover:bg-ocean-100 group-hover:scale-110 transition-all duration-300">
                  <Building2
                    className="w-5 h-5 text-ocean-600"
                    strokeWidth={1.75}
                  />
                </div>
                <h4 className="font-sans font-semibold text-gray-800">
                  The Vice-Chancellor
                </h4>
              </div>
              <span className="badge bg-ocean-50 text-ocean-700 font-semibold flex-shrink-0 ml-3">
                Executive
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              As Chief Disciplinary Officer, the VC constitutes the Committee,
              receives final reports, and ensures recommendations are acted on
              promptly.
            </p>
          </div>

          <div className="md:col-span-2 group card border border-sand-200 hover:-translate-y-1 hover:shadow-elevated hover:border-indigo-200 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-110 transition-all duration-300">
                  <Landmark
                    className="w-5 h-5 text-indigo-600"
                    strokeWidth={1.75}
                  />
                </div>
                <h4 className="font-sans font-semibold text-gray-800">
                  UG Appeals Board
                </h4>
              </div>
              <span className="badge bg-indigo-50 text-indigo-700 font-semibold flex-shrink-0 ml-3">
                Appeals
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              Hears and determines appeals from parties dissatisfied with the
              Committee's findings, in accordance with the Statutes of the
              University of Ghana.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section
        ref={s6 as React.RefObject<HTMLElement>}
        className="reveal bg-sand-200 py-20"
        id="contact"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-ocean-800 rounded-3xl p-12 relative overflow-hidden">
            <div className="blob-1 absolute top-0 right-0 w-64 h-64 bg-terra-600/20 rounded-full blur-3xl translate-x-16 -translate-y-16 pointer-events-none" />
            <div className="blob-2 absolute bottom-0 left-0 w-48 h-48 bg-ocean-600/30 rounded-full blur-2xl -translate-x-12 translate-y-12 pointer-events-none" />

            <div className="relative text-center max-w-xl mx-auto mb-10">
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Ready whenever you are.
              </h2>
              <p className="text-ocean-200 leading-relaxed font-sans">
                There's no perfect moment to speak up. The moment you decide to
                reach out — Kasa is here, and so is every resource this
                University has to offer you.
              </p>
            </div>

            <div className="relative flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-3 px-5 py-3.5 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/15 transition-colors">
                <HeartHandshake
                  className="w-4 h-4 text-terra-300"
                  strokeWidth={1.75}
                />
                <div className="text-left">
                  <div className="text-[10px] text-ocean-400 uppercase tracking-wider font-semibold font-sans">
                    CEGENSA Crisis Line
                  </div>
                  <div className="text-sm font-semibold text-white font-sans">
                    +233 (0) 302 XXX XXX
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-3.5 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/15 transition-colors">
                <Phone className="w-4 h-4 text-red-400" strokeWidth={1.75} />
                <div className="text-left">
                  <div className="text-[10px] text-ocean-400 uppercase tracking-wider font-semibold font-sans">
                    Ghana Police Service
                  </div>
                  <div className="text-sm font-semibold text-white font-sans">
                    191 / 18555
                  </div>
                </div>
              </div>

              <Link
                to="/report"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-terra-500 hover:bg-terra-400 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-sans shadow-lg shadow-terra-900/20"
              >
                File a Report Online
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="bg-ocean-900 text-ocean-400 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-0.5 mb-1">
              <span className="font-display font-bold text-white text-xl">
                Kasa
              </span>
              <span className="text-[10px] font-bold text-terra-400 font-sans ml-0.5 mb-1">
                UG
              </span>
            </div>
            <p className="text-xs text-ocean-500 font-sans">
              Sexual Harassment &amp; Misconduct Policy (2017)
            </p>
          </div>
          <p className="text-xs text-ocean-600 text-center md:text-right font-sans">
            © {new Date().getFullYear()} University of Ghana · All reports are
            strictly confidential.
          </p>
        </div>
      </footer>
    </div>
  );
}
