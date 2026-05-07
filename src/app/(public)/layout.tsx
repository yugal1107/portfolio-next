import { SiteNav } from "@/components/site-nav";
import DotMatrixBackground from "@/components/dot-matrix-background";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DotMatrixBackground className="min-h-screen bg-surface text-on-surface selection:bg-primary selection:text-on-primary font-body">
      <div className="perspective-rail hidden lg:block"></div>
      <SiteNav />
      {children}
      <footer className="w-full py-16 px-6 md:px-12 bg-surface-container-lowest border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
          <div className="text-center md:text-left">
            <span className="text-lg font-bold text-on-surface font-headline tracking-tighter">YUGAL.LIVE</span>
            <p className="text-on-surface-variant font-body text-sm mt-2">© 2026 Yugal Burde.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="https://github.com/yugal1107">GitHub</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="https://www.linkedin.com/in/yugal-burde-58012a256/">LinkedIn</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="https://twitter.com/YugalBurde">Twitter</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">Available for Opportunities</span>
          </div>
        </div>
      </footer>
    </DotMatrixBackground>
  );
}
