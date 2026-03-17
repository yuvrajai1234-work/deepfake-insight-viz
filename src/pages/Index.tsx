import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import UploadSection from "@/components/UploadSection";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";
import FamousCases from "@/components/FamousCases";
import PastAnalysis from "@/components/PastAnalysis";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleViewReport = async (reportData: any) => {
    setAnalysisData(reportData);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Store in Supabase as before (Persistent Forensic History)
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && reportData.fileName) {
      const { data: existing } = await supabase
        .from('analyses')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('video_name', reportData.fileName)
        .maybeSingle();

      if (!existing) {
        await supabase.from('analyses').insert([{
          user_id: session.user.id,
          video_name: reportData.fileName,
          video_url: reportData.videoUrl,
          confidence_score: reportData.overallConfidence,
          is_deepfake: reportData.isDeepfake,
          result_text: reportData.isDeepfake ? "Deepfake" : "Authentic",
          explanation: reportData.anomalies?.[0]?.description || "Historical forensic sample."
        }]);
      }
    }
  };

  const handleVideoUpload = (file: File) => {
    setIsAnalyzing(true);
    const localVideoUrl = URL.createObjectURL(file);
    
    // Simulate analysis process
    setTimeout(async () => {
      const isDeepfake = Math.random() > 0.5;
      const confidence = Math.floor(Math.random() * 40) + 60;
      
      let finalVideoUrl = localVideoUrl;

      // Save to Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Try uploading to Supabase Storage for persistence
        try {
          const fileName = `${session.user.id}/${Date.now()}-${file.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('analysis_videos')
            .upload(fileName, file);

          if (!uploadError && uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('analysis_videos')
              .getPublicUrl(uploadData.path);
            finalVideoUrl = publicUrl;
          } else if (uploadError) {
            console.warn("Storage upload failed (bucket might not exist):", uploadError.message);
          }
        } catch (err) {
          console.error("Storage error:", err);
        }

        await supabase.from('analyses').insert([{
          user_id: session.user.id,
          video_name: file.name,
          video_url: finalVideoUrl,
          confidence_score: confidence,
          is_deepfake: isDeepfake,
          result_text: isDeepfake ? "Deepfake" : "Authentic",
          explanation: isDeepfake ? "High probability of manipulation." : "Authentic footage."
        }]);
      }

      const mockResults = {
        videoUrl: finalVideoUrl,
        fileName: file.name,
        overallConfidence: confidence,
        isDeepfake: isDeepfake,
        technicalDetails: {
          duration: "15s",
          resolution: "1080p",
          fps: 30,
          codec: "H.264",
          processingTime: "4.8s",
          modelArchitecture: "EfficientNet-B0 + Gemini Vision Multimodal",
        },
        frameAnalysis: Array.from({ length: 30 }, (_, i) => ({
          frame: i,
          timestamp: i * 0.5,
          confidence: isDeepfake && i > 5 && i < 15 ? 92 + Math.random() * 5 : 60 + Math.random() * 20,
          anomalies: isDeepfake && i > 5 && i < 15 ? 3 : 0,
        })),
        anomalies: isDeepfake ? [
          {
            id: 1,
            type: "Neural Inconsistency",
            timestamp: 2.5,
            confidence: 94.2,
            region: "Left Eye",
            description: "Asymmetrical micro-expressions detected.",
          }
        ] : [],
      };
      
      setAnalysisData(mockResults);
      setIsAnalyzing(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {!analysisData ? (
        <main>
          {!isLoggedIn && <Hero />}
          <div id="upload" className={`scroll-mt-24 ${isLoggedIn ? "pt-32" : ""}`}>
            <UploadSection 
              onVideoUpload={handleVideoUpload} 
              isAnalyzing={isAnalyzing} 
              isLoggedIn={isLoggedIn}
            />
          </div>
          {isLoggedIn && <PastAnalysis onViewReport={handleViewReport} />}
          <FamousCases onViewReport={handleViewReport} />
          {!isLoggedIn && (
            <>
              <Features />
              <UseCases />
              <section id="how-it-works" className="py-24 px-6 relative">
                <div className="mx-auto max-w-7xl">
                  <div className="rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-background border border-primary/20 p-12 md:p-20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                    
                    <div className="relative z-10 grid gap-12 md:grid-cols-2 items-center">
                      <div>
                        <h2 className="mb-6 text-4xl font-bold tracking-tight text-foreground">
                          How TruthLens <span className="text-primary">Secures</span> Your Media
                        </h2>
                        <div className="space-y-8">
                          <div className="flex gap-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-glow">
                              1
                            </div>
                            <div>
                              <h4 className="mb-2 text-xl font-bold">Upload & Pre-process</h4>
                              <p className="text-muted-foreground">Upload your video. Our system automatically extracts keyframes and audio tracks for multi-modal analysis.</p>
                            </div>
                          </div>
                          <div className="flex gap-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl font-bold text-foreground border border-glass">
                              2
                            </div>
                            <div>
                              <h4 className="mb-2 text-xl font-bold">AI Detection Suite</h4>
                              <p className="text-muted-foreground">Multiple computer vision and generative AI models scan for artifacts, inconsistencies, and synthesization signatures.</p>
                            </div>
                          </div>
                          <div className="flex gap-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl font-bold text-foreground border border-glass">
                              3
                            </div>
                            <div>
                              <h4 className="mb-2 text-xl font-bold">Explainable Report</h4>
                              <p className="text-muted-foreground">Receive a detailed breakdown and visual heatmap explaining the AI's decision-making process.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="aspect-video rounded-2xl bg-background/50 border border-glass backdrop-blur-xl p-4 shadow-2xl">
                          <div className="w-full h-full rounded-lg bg-gradient-to-br from-secondary to-background animate-pulse flex items-center justify-center">
                            <span className="text-primary/40 font-mono text-sm">TRUTHLENS_ANALYSIS_VIEW.EXE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      ) : (
        <div className="pt-20">
          <AnalysisDashboard 
            data={analysisData} 
            onReset={() => setAnalysisData(null)} 
          />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Index;
