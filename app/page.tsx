import Link from "next/link";
import { ArrowRight, Timer, TrendingUp, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-white selection:bg-orange-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="w-6 h-6 text-orange-500" />
            <span className="font-bold text-xl tracking-tight">Fasting<span className="text-orange-500">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-bold rounded-full bg-white text-slate-950 hover:bg-slate-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-600/20 rounded-full blur-[100px] -z-10 opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-orange-400 mb-4 animate-slide-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            #1 Intermittent Fasting App
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent pb-2">
            Master your health through <br className="hidden md:block" />
            <span className="text-orange-500">conscious fasting.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Join millions of users achieving their weight goals, improving mental clarity, and extending their longevity with Fasting Pro.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 group"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-lg transition-all border border-slate-700"
            >
              I have an account
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-3 gap-8 border-t border-white/5 max-w-2xl mx-auto mt-12">
            <div>
              <div className="text-3xl font-bold text-white">2M+</div>
              <div className="text-sm text-slate-500">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">4.9</div>
              <div className="text-sm text-slate-500">App Store Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">10M+</div>
              <div className="text-sm text-slate-500">Fasting Hours</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-slate-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-slate-400">Powerful features designed to keep you consistent and motivated.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Timer className="w-8 h-8 text-blue-500" />}
              title="Smart Timer"
              description="Customizable fasting windows with real-time progress tracking and notifications."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-green-500" />}
              title="Advanced Analytics"
              description="Visualize your progress with beautiful charts and deep insights into your habits."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-500" />}
              title="Body Status"
              description="Understand what's happening inside your body during different fasting stages."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-600 text-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Timer className="w-5 h-5 opacity-50" />
            <span className="font-semibold text-slate-500">FastingPro</span>
          </div>
          <p>© {new Date().getFullYear()} Fasting Pro. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-slate-950 border border-white/5 hover:border-orange-500/30 hover:bg-white/[0.02] transition-colors group">
      <div className="mb-4 p-3 rounded-2xl bg-slate-900 w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-slate-200">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
