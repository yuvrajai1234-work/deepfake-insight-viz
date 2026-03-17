import { Shield, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-glass bg-background px-6 py-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              TruthLens<span className="text-primary">AI</span>
            </span>
          </div>
          <p className="mb-8 max-w-lg text-muted-foreground">
            Fighting digital deception with advanced Generative AI analysis. 
            Making deepfake detection accessible, transparent, and explainable 
            for everyone.
          </p>
          <div className="flex gap-4">
            <a href="#" className="rounded-full bg-secondary p-3 text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="rounded-full bg-secondary p-3 text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="rounded-full bg-secondary p-3 text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-glass pt-8 text-center text-sm text-muted-foreground md:mt-20">
          <p>© {new Date().getFullYear()} TruthLens AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
