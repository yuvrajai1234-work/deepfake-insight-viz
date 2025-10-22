import { useState, useCallback } from "react";
import { Upload, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UploadSectionProps {
  onVideoUpload: (file: File) => void;
  isAnalyzing: boolean;
}

const UploadSection = ({ onVideoUpload, isAnalyzing }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

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
            relative rounded-3xl border-2 border-dashed transition-all duration-300
            ${isDragging 
              ? "border-primary bg-primary/5 shadow-glow" 
              : "border-glass bg-glass"
            }
            ${isAnalyzing ? "opacity-50 pointer-events-none" : ""}
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="p-12 text-center backdrop-blur-xl">
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    Analyzing Video...
                  </h3>
                  <p className="text-muted-foreground">
                    Running multi-modal deepfake detection
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-primary/10 p-6">
                  {isDragging ? (
                    <Upload className="h-12 w-12 text-primary animate-bounce" />
                  ) : (
                    <Video className="h-12 w-12 text-primary" />
                  )}
                </div>
                
                <h3 className="mb-2 text-2xl font-semibold text-foreground">
                  Upload Video for Analysis
                </h3>
                <p className="mb-8 text-muted-foreground">
                  Drag and drop your video here, or click to browse
                </p>
                
                <label htmlFor="video-upload">
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    asChild
                  >
                    <span className="cursor-pointer">
                      <Upload className="mr-2 h-5 w-5" />
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
                
                <p className="mt-6 text-sm text-muted-foreground">
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
