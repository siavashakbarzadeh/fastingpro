import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-white">
      <div className="text-center space-y-6 max-w-md w-full">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
          Fasting Pro
        </h1>
        <p className="text-slate-400 text-lg">
          Track your fasts, monitor your progress, and reach your goals.
        </p>
        
        <div className="grid gap-4 w-full">
          <Link 
            href="/login" 
            className="w-full py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
          >
            Log In
          </Link>
          <Link 
            href="/register" 
            className="w-full py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium transition-colors shadow-lg shadow-orange-900/20"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
