import { SignUp } from "@clerk/nextjs";
import { SiteHeader } from "@/components/site-header";

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-300">Join 43 Industries</p>
        <SignUp
          path="/join"
          routing="path"
          signInUrl="/login"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
