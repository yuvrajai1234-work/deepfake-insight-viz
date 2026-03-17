import { useState, useCallback, useEffect } from "react";
import { Upload, Video, Loader2, Lock, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UploadSectionProps {
  onVideoUpload: (file: File) => void;
  isAnalyzing: boolean;
  isLoggedIn?: boolean;
}

const UploadSection = ({ onVideoUpload, isAnalyzing, isLoggedIn = false }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps = [
    { label: "Step 1: DETECT", sub: "Running EfficientNet CNN Analysis..." },
    { label: "Step 2: EXPLAIN", sub: "Google Gemini 1.5 Vision Reasoning..." },
    { label: "Step 3: REPORT", sub: "Generating Automated Forensic Report..." },
  ];

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setAnalysisStep(0);
      interval = setInterval(() => {
        setAnalysisStep((prev) => (prev + 1) % 3);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("video/")) {
        onVideoUpload(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file",
          variant: "destructive",
        });
      }
    },
    [onVideoUpload, toast]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoUpload(file);
    }
  };

  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-4xl">
        <div
          className={`
            relative rounded-[32px] border-2 border-dashed transition-all duration-300
            ${isDragging 
              ? "border-primary bg-primary/5 shadow-glow" 
              : "border-glass bg-[#0F1721]"
            }
            ${isAnalyzing ? "border-primary shadow-glow" : ""}
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="p-16 text-center backdrop-blur-xl">
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="h-20 w-20 text-primary animate-spin relative z-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tighter text-foreground bg-gradient-primary bg-clip-text text-transparent">
                    {steps[analysisStep].label}
                  </h3>
                  <p className="text-muted-foreground font-medium animate-pulse">
                    {steps[analysisStep].sub}
                  </p>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
                        i <= analysisStep ? "bg-primary shadow-glow" : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : !isLoggedIn ? (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="mb-8 inline-flex items-center justify-center rounded-[24px] bg-[#1A2533] p-8 shadow-2xl border border-glass/50">
                  <Lock className="h-10 w-10 text-primary" />
                </div>
                
                <h3 className="mb-2 text-3xl font-bold text-white">
                  Authentication Required
                </h3>
                <p className="mb-10 text-muted-foreground mx-auto max-w-sm">
                  Please sign in or create an account to access our advanced deepfake detection suite.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={() => navigate("/auth")}
                    className="w-full sm:w-auto bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-xl px-8"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/auth?mode=signup")}
                    className="w-full sm:w-auto border-glass bg-glass hover:bg-card rounded-xl px-8"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Sign Up
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8 inline-flex items-center justify-center rounded-[24px] bg-[#1A2533] p-8 shadow-2xl border border-glass/50">
                  {isDragging ? (
                    <Upload className="h-10 w-10 text-primary animate-bounce" />
                  ) : (
                    <Video className="h-10 w-10 text-primary" />
                  )}
                </div>
                
                <h3 className="mb-2 text-3xl font-bold text-white">
                  Upload Video for Analysis
                </h3>
                <p className="mb-10 text-muted-foreground font-medium">
                  Drag and drop your video here, or click to browse
                </p>
                
                <label htmlFor="video-upload">
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-2xl h-14 px-10 font-bold"
                    asChild
                  >
                    <span className="cursor-pointer">
                      <Upload className="mr-3 h-5 w-5" />
                      Select Video File
                    </span>
                  </Button>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
                
                <p className="mt-10 text-sm font-medium text-muted-foreground">
                  Supported formats: MP4, MOV, AVI, WebM • Max size: 500MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
