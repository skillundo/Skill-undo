import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] animate-fade-in relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-violet/10 blur-[100px] rounded-full -z-10" />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Become a <span className="text-neon-violet text-transparent bg-clip-text bg-gradient-to-r from-neon-violet to-neon-cyan">Legend.</span></h1>
        <p className="text-gray-400 mt-2">Join the elite network of campus creators.</p>
      </div>
      <SignUp
        appearance={{
          elements: {
            card: "bg-[#020617]/50 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.15)] rounded-2xl",
            headerTitle: "text-white hidden",
            headerSubtitle: "text-gray-400 hidden",
            socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 text-white",
            socialButtonsBlockButtonText: "text-white",
            dividerLine: "bg-white/10",
            dividerText: "text-gray-500",
            formFieldLabel: "text-gray-300 font-medium",
            formFieldInput: "bg-black/40 border border-white/10 text-white focus:ring-neon-violet focus:border-neon-violet",
            formButtonPrimary: "bg-neon-cyan hover:bg-white text-black font-extrabold transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]",
            footerActionText: "text-gray-400",
            footerActionLink: "text-neon-violet hover:text-white transition-colors"
          }
        }}
        fallbackRedirectUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  );
}
