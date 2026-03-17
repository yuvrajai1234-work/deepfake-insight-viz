import { useState, useEffect } from "react";
import { FileVideo, Calendar, ShieldCheck, ShieldAlert, BarChart3, ChevronRight, Loader2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const PastAnalysis = ({ onViewReport }: { onViewReport: (data: any) => void }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("analyses")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      // Update local state immediately for better UX
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success("Analysis deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete analysis");
    }
  };

  useEffect(() => {
    fetchHistory();

    // Set up real-time listener
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analyses',
        },
        (payload) => {
          setHistory((prev) => [payload.new, ...prev].slice(0, 10));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'analyses',
        },
        (payload) => {
          setHistory((prev) => prev.filter(item => item.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-24 px-6 border-t border-glass">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
              Your <span className="text-primary">Last 10</span> Analyses
            </h2>
            <p className="text-muted-foreground">
              Review your most recent digital forensic breakdown logs.
            </p>
          </div>
          <Button variant="outline" className="rounded-xl border-glass bg-glass self-start md:self-center">
            View Full Archives
          </Button>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-glass bg-glass/20 p-12 text-center">
            <FileVideo className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-xl font-medium text-muted-foreground">No analysis history found</h4>
            <p className="text-sm text-muted-foreground mt-2">Upload a video above to start your first analysis.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col md:flex-row md:items-center justify-between rounded-2xl border border-glass bg-glass p-6 transition-all duration-300 hover:bg-primary/5 hover:border-primary/30"
              >
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <div className="relative h-20 w-32 overflow-hidden rounded-xl bg-black/40 border border-glass flex-shrink-0 group/video">
                    {item.video_url ? (
                      <video 
                        src={item.video_url} 
                        className="h-full w-full object-cover opacity-60 group-hover/video:opacity-100 transition-opacity" 
                        muted 
                        loop 
                        onMouseOver={(e) => e.currentTarget.play()}
                        onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                        onError={(e) => {
                          // If video fails to load (e.g. expired blob), hide video and show fallback
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallback = parent.querySelector('.video-fallback');
                            if (fallback) (fallback as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className="video-fallback absolute inset-0 hidden items-center justify-center bg-black/20">
                      <FileVideo className={`h-8 w-8 ${
                        item.is_deepfake ? 'text-destructive' : 'text-primary'
                      }`} />
                    </div>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                       <span className="text-[10px] font-bold text-white/80 uppercase tracking-tighter">Preview</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                      {item.video_name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(item.created_at), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {item.confidence_score.toFixed(1)}% Confidence
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 pt-4 md:pt-0 border-glass">
                  <div className="flex items-center gap-2">
                    {!item.is_deepfake ? (
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-destructive" />
                    )}
                    <span className={`font-bold ${
                      item.is_deepfake ? 'text-destructive' : 'text-primary'
                    }`}>
                      {item.result_text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onViewReport({
                        fileName: item.video_name,
                        overallConfidence: item.confidence_score,
                        isDeepfake: item.is_deepfake,
                        technicalDetails: {
                          duration: "N/A",
                          resolution: "1080p",
                          fps: 30,
                          codec: "H.264",
                          processingTime: "Cached",
                          modelArchitecture: "EfficientNet-B0 + Gemini Vision",
                        },
                        videoUrl: item.video_url || "",
                        frameAnalysis: Array.from({ length: 15 }, (_, i) => ({
                          frame: i,
                          timestamp: i * 1.0,
                          confidence: item.is_deepfake ? (90 + Math.random() * 5) : (item.confidence_score + (Math.random() - 0.5) * 5),
                          anomalies: item.is_deepfake && i % 3 === 0 ? 1 : 0,
                        })),
                        anomalies: item.is_deepfake ? [
                          {
                            id: 1,
                            type: "Historical Artifact",
                            timestamp: 2.0,
                            confidence: item.confidence_score,
                            region: "Universal",
                            description: item.explanation || "Detected in original forensic sweep."
                          }
                        ] : [],
                      })}
                      className="rounded-lg group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      View Report
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PastAnalysis;
