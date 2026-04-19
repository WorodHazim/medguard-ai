export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[270px] shrink-0 border-r border-cyan-500/10 bg-[#050d18] px-5 py-6 lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-2xl shadow-[0_0_30px_rgba(34,211,238,0.18)]">
              🛡️
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">MedGuard</h1>
              <p className="mt-1 text-sm text-slate-400">
                AI Emergency Decision Agent
              </p>
            </div>
          </div>

          <button className="mb-6 flex items-center gap-3 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 text-left text-lg font-semibold shadow-[0_0_30px_rgba(59,130,246,0.28)] transition hover:scale-[1.01]">
            <span className="text-2xl">＋</span>
            <span>New Case</span>
          </button>

          <nav className="space-y-2">
            {[
              "Dashboard",
              "Hospitals",
              "Analytics",
              "Alerts",
              "History",
              "Settings",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl px-4 py-3 text-base text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {item}
              </div>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-cyan-400/10 bg-[#091424] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              System Status
            </p>
            <div className="mt-4 flex items-center gap-2 text-emerald-400">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.8)]" />
              <span className="text-sm font-medium">All Systems Online</span>
            </div>

            <div className="mt-6 flex h-40 items-center justify-center rounded-2xl border border-cyan-500/10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),rgba(0,0,0,0)_55%)]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5 text-4xl text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                ✓
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-slate-400">
              <p>• Live Network</p>
              <p>• Active Monitoring</p>
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-white/5 bg-[#091424] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-[#07111f]">
                W
              </div>
              <div>
                <p className="font-medium">Worod Hazem</p>
                <p className="text-sm text-slate-400">Emergency Unit</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1 px-4 py-4 md:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="mb-5 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <div className="rounded-3xl border border-cyan-500/10 bg-[#081321] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-xl font-semibold text-cyan-300">
                    Good evening, Paramedic 👋
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Let&apos;s get the best care for your patient.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="rounded-2xl border border-cyan-400/15 bg-[#091728] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      AI Status
                    </p>
                    <p className="mt-1 text-sm font-medium text-cyan-300">
                      Analyzing hospitals...
                    </p>
                  </div>

                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-red-300/70">
                      Emergency Mode
                    </p>
                    <p className="mt-1 text-sm font-semibold text-red-300">ON</p>
                  </div>
                </div>
              </div>

              {/* ECG line */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-500/10 bg-[#06101d] px-4 py-4">
                <div className="relative h-10">
                  <div className="absolute inset-0 top-1/2 h-px -translate-y-1/2 bg-cyan-400/15" />
                  <svg
                    viewBox="0 0 600 60"
                    className="absolute inset-0 h-full w-full"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 35 L60 35 L85 35 L95 15 L110 50 L125 25 L145 35 L200 35 L225 35 L235 18 L245 52 L260 22 L280 35 L335 35 L360 35 L370 17 L382 50 L395 20 L420 35 L600 35"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-4">
              <StatCard title="Hospitals Analyzed" value="27" sub="Live" />
              <StatCard title="Accuracy" value="96%" sub="High" />
              <StatCard title="Time Saved" value="21 min" sub="vs. manual search" />
              <StatCard title="Confidence" value="96%" sub="Very High" />
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid gap-5 xl:grid-cols-[1.05fr_1.35fr]">
            {/* Left */}
            <div className="space-y-5">
              <Card>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl">
                    🚑
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                      New Emergency Case
                    </h2>
                    <p className="mt-1 text-slate-400">
                      Enter patient information to get AI recommendation
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/10 bg-[#07111e] p-4">
                  <h3 className="mb-5 text-xl font-semibold text-cyan-300">
                    Patient Input
                  </h3>

                  <Label>Patient Condition / Symptoms</Label>
                  <textarea
                    className="min-h-[120px] w-full rounded-2xl border border-cyan-500/15 bg-[#081523] px-4 py-4 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
                    placeholder="65 year old male, severe chest pain, breathing difficulty, sweating, high blood pressure."
                    defaultValue="65 year old male, severe chest pain, breathing difficulty, sweating, high blood pressure."
                  />

                  <div className="mt-6">
                    <Label>Urgency Level</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <UrgencyCard
                        title="LOW"
                        subtitle="Stable"
                        active={false}
                        color="emerald"
                      />
                      <UrgencyCard
                        title="MEDIUM"
                        subtitle="Moderate"
                        active={false}
                        color="yellow"
                      />
                      <UrgencyCard
                        title="CRITICAL"
                        subtitle="High Risk"
                        active
                        color="red"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Label>Case Type</Label>
                    <div className="grid grid-cols-4 gap-3">
                      <CaseType title="Cardiac" active />
                      <CaseType title="Trauma" />
                      <CaseType title="Stroke" />
                      <CaseType title="Other" />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Patient Age</Label>
                      <input
                        className="w-full rounded-2xl border border-cyan-500/15 bg-[#081523] px-4 py-3 outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
                        defaultValue="58"
                      />
                    </div>

                    <div>
                      <Label>Location / Pickup Point</Label>
                      <input
                        className="w-full rounded-2xl border border-cyan-500/15 bg-[#081523] px-4 py-3 outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
                        defaultValue="Abu Dhabi, Corniche St"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <Label>Additional Notes (Optional)</Label>
                    <input
                      className="w-full rounded-2xl border border-cyan-500/15 bg-[#081523] px-4 py-3 outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
                      placeholder="Eg: allergies, medical history, etc."
                    />
                  </div>

                  <button className="mt-7 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 via-blue-600 to-cyan-400 px-5 py-4 text-lg font-semibold text-white shadow-[0_0_35px_rgba(34,211,238,0.18)] transition hover:scale-[1.01]">
                    Find Best Hospital
                  </button>
                </div>
              </Card>

              <Card>
                <h3 className="mb-5 text-2xl font-semibold">How MedGuard Works</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <StepCard
                    step="Step 1"
                    title="Enter Patient Data"
                    text="Provide condition, urgency, and location."
                  />
                  <StepCard
                    step="Step 2"
                    title="AI Evaluates Options"
                    text="Hospitals, traffic, capacity, and specialty are checked."
                  />
                  <StepCard
                    step="Step 3"
                    title="Get Recommendation"
                    text="Receive the best hospital and fastest route."
                  />
                </div>
              </Card>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <Card className="border-emerald-400/15">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-400">
                      AI Recommendation
                    </p>
                    <p className="mt-1 text-slate-400">
                      Real-time decision based on condition, availability, and location
                    </p>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                    Best Match
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="overflow-hidden rounded-3xl border border-cyan-500/10 bg-[#07111e]">
                    <div className="h-64 bg-[linear-gradient(135deg,#0a1830,#0d2545_45%,#112b52)] p-5">
                      <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        Best Match
                      </div>

                      <div className="mt-8 flex h-[170px] items-end justify-center rounded-2xl border border-white/5 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),rgba(0,0,0,0)_60%)]">
                        <div className="mb-3 rounded-2xl border border-cyan-400/10 bg-[#0a1426]/90 px-8 py-10 text-center shadow-[0_0_30px_rgba(0,0,0,0.25)]">
                          <p className="text-2xl font-bold">MAX</p>
                          <p className="text-sm text-slate-400">Healthcare</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-3xl font-bold tracking-tight">
                        Max Super Speciality Hospital
                      </h3>
                      <p className="mt-2 text-lg text-cyan-300">
                        Cardiac Care Excellence
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <MetricPill label="Distance" value="1.8 km" />
                        <MetricPill label="Travel Time" value="8 min" />
                        <MetricPill label="Availability" value="High" highlight />
                      </div>

                      <div className="mt-6 rounded-2xl border border-cyan-500/10 bg-[#081523] p-5">
                        <h4 className="mb-4 text-xl font-semibold">Why this hospital?</h4>
                        <div className="grid gap-3 text-slate-300 md:grid-cols-2">
                          <Reason text="Specialized Cardiac ICU" />
                          <Reason text="Advanced Cath Lab" />
                          <Reason text="24/7 Cardiac Emergency" />
                          <Reason text="Expert Cardiologists" />
                          <Reason text="Shortest Travel Time" />
                          <Reason text="High Success Rate" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-5 py-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
                        Priority: Critical
                      </p>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-cyan-500/10 bg-[#07111e]">
                      <div className="relative h-72 bg-[linear-gradient(135deg,#0a1628,#08101d)] p-4">
                        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] [background-size:32px_32px]" />
                        <div className="absolute left-[18%] top-[72%] h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.9)]" />
                        <div className="absolute right-[16%] top-[16%] h-6 w-6 rounded-full bg-red-500 shadow-[0_0_24px_rgba(239,68,68,0.9)]" />

                        <svg
                          viewBox="0 0 400 260"
                          className="absolute inset-0 h-full w-full"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M80 190 C110 180,120 160,145 150 C180 135,170 120,210 110 C250 100,260 75,300 65"
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </svg>

                        <div className="absolute left-[56%] top-[48%] rounded-2xl border border-cyan-400/15 bg-[#081523]/95 px-4 py-3 text-sm shadow-xl">
                          <p className="font-semibold">8 min</p>
                          <p className="text-slate-400">1.8 km</p>
                        </div>

                        <button className="absolute bottom-4 right-4 rounded-2xl border border-cyan-400/15 bg-[#0a1830] px-4 py-3 text-sm font-medium text-cyan-300">
                          View Full Route
                        </button>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-cyan-500/10 bg-[#07111e] p-5">
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                        AI Insights
                      </p>
                      <div className="mt-4 flex items-start gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-2xl">
                          🧠
                        </div>
                        <p className="text-sm leading-7 text-slate-300">
                          Our AI analyzed <span className="font-semibold text-white">27 hospitals</span>{" "}
                          based on <span className="font-semibold text-white">25+ critical factors</span>{" "}
                          including patient condition, real-time traffic, availability,
                          and specialty match.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-cyan-500/10 bg-[#07111e] p-5">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
                    Alternative Option
                  </p>
                  <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-2xl font-semibold">Apollo Hospital</h4>
                      <p className="mt-1 text-slate-400">Multi-speciality Hospital</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <MetricPill label="Distance" value="2.7 km" />
                      <MetricPill label="Travel Time" value="12 min" />
                      <MetricPill label="Availability" value="Medium" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-500/20 to-red-600/10 px-5 py-5">
                  <p className="text-2xl font-bold text-red-300">
                    Priority Level: HIGH (Critical Case)
                  </p>
                  <p className="mt-2 text-red-100/80">
                    Immediate medical attention required. Recommended hospital has the best chance for optimal outcome.
                  </p>
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-5">
                <BottomStat title="Time Saved" value="21 min" sub="vs. manual search" />
                <BottomStat title="Accuracy" value="96%" sub="AI prediction" />
                <BottomStat title="Hospitals Analyzed" value="27" sub="Real-time" />
                <BottomStat title="Data Sources" value="12+" sub="Live sources" />
                <BottomStat title="Confidence Score" value="96%" sub="Very high confidence" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] border border-cyan-500/10 bg-[#081321] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] ${className}`}
    >
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-3xl border border-cyan-500/10 bg-[#081321] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{sub}</p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-sm font-medium text-slate-300">
      {children}
    </label>
  );
}

function UrgencyCard({
  title,
  subtitle,
  active,
  color,
}: {
  title: string;
  subtitle: string;
  active?: boolean;
  color: "emerald" | "yellow" | "red";
}) {
  const styles = {
    emerald: active
      ? "border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
      : "border-emerald-400/15 bg-emerald-400/[0.04]",
    yellow: active
      ? "border-yellow-400/40 bg-yellow-400/10 shadow-[0_0_25px_rgba(250,204,21,0.12)]"
      : "border-yellow-400/15 bg-yellow-400/[0.04]",
    red: active
      ? "border-red-400/45 bg-red-400/10 shadow-[0_0_28px_rgba(248,113,113,0.18)]"
      : "border-red-400/15 bg-red-400/[0.04]",
  };

  const dot = {
    emerald: "bg-emerald-400",
    yellow: "bg-yellow-400",
    red: "bg-red-400",
  };

  return (
    <div
      className={`rounded-2xl border p-4 ${styles[color]} transition hover:scale-[1.01]`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot[color]}`} />
        <p className="font-semibold">{title}</p>
      </div>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}

function CaseType({
  title,
  active = false,
}: {
  title: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-5 text-center transition ${
        active
          ? "border-red-400/40 bg-red-400/10 shadow-[0_0_24px_rgba(248,113,113,0.14)]"
          : "border-cyan-500/10 bg-[#081523] hover:border-cyan-400/20"
      }`}
    >
      <p className="font-medium">{title}</p>
    </div>
  );
}

function MetricPill({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        highlight
          ? "border-emerald-400/20 bg-emerald-400/10"
          : "border-cyan-500/10 bg-[#081523]"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Reason({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-300">
        ✓
      </span>
      <span>{text}</span>
    </div>
  );
}

function StepCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-500/10 bg-[#07111e] p-4">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
        {step}
      </p>
      <h4 className="mt-3 text-lg font-semibold">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function BottomStat({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-3xl border border-cyan-500/10 bg-[#081321] p-5 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{sub}</p>
    </div>
  );
}