import { Link } from "react-router-dom";

function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-5 py-10 text-center">
      <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-12 shadow-lg">
        <h1 className="text-4xl font-bold text-white sm:text-6xl">
          Welcome to CodeAndJob
        </h1>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/contest"
            className="rounded-lg bg-amber-400 px-8 py-3 text-base font-semibold text-slate-950 transition hover:bg-amber-300"
          >
            Contests
          </Link>

          <Link
            to="/jobs"
            className="rounded-lg border border-slate-700 px-8 py-3 text-base font-semibold text-slate-100 transition hover:border-amber-400 hover:text-amber-300"
          >
            Jobs
          </Link>
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
