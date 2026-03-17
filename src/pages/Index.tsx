import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import UploadSection from "@/components/UploadSection";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";
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

  const handleVideoUpload = (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate analysis process (The 3-Step Pipeline)
    setTimeout(() => {
      // Step 1: DETECT (EfficientNet Analysis)
      // Step 2: EXPLAIN (Gemini Vision Interpretation)
      // Step 3: REPORT (Structured Generation)
      
      const mockResults = {
        videoUrl: URL.createObjectURL(file),
        fileName: file.name,
        overallConfidence: 89.4,
        isDeepfake: true,
        detectionEngine: "EfficientNet-B0 CNN",
        explanationEngine: "Google Gemini 1.5 Pro Vision",
        
        // High-level verdict for the Executive Summary
        executiveSummary: "High probability of generative manipulation detected in facial regions. EfficientNet flagged temporal inconsistencies in lip-syncing, subsequently confirmed by Gemini Vision's forensic artifact analysis.",

        frameAnalysis: Array.from({ length: 30 }, (_, i) => ({
          frame: i,
          timestamp: i * 0.5,
          confidence: i > 5 && i < 15 ? 92 + Math.random() * 5 : 60 + Math.random() * 20,
          anomalies: i > 5 && i < 15 ? 3 : 0,
        })),

        // Deep forensic artifacts found by Gemini Vision
        anomalies: [
          {
            id: 1,
            type: "Facial Symmetry (EfficientNet)",
            timestamp: 2.5,
            confidence: 94.2,
            region: "Left Eye / Brow",
            description: "Gemini Vision Analysis: Detected asymmetrical micro-expressions. The left orbicularis oculi muscle movement does not correspond with the right, indicative of GAN-based synthesis.",
          },
          {
            id: 2,
            type: "Temporal Artifacts (EfficientNet)",
            timestamp: 4.8,
            confidence: 88.7,
            region: "Mouth Area",
            description: "Gemini Vision Analysis: Frequency mismatch in lip-sync. Phoneme-to-viseme mapping shows 120ms lag, a common artifact in 'lipsync' deepfake models.",
          },
          {
            id: 3,
            type: "Skin Texture (Gemini Vision)",
            timestamp: 7.2,
            confidence: 82.4,
            region: "Cheeks / Forehead",
            description: "Lack of natural skin pore variation. The surface appears 'too smooth' under high-frequency analysis, typical of diffusion-based face swapping.",
          },
        ],

        technicalDetails: {
          resolution: "1920x1080",
          duration: "15 seconds",
          fps: 30,
          codec: "H.264",
          processingTime: "4.8s",
          modelArchitecture: "EfficientNet-B0 + Gemini Vision Multimodal",
        },

        // For the REPORTing step
        reportData: {
          methodology: "Our 3-step pipeline utilizes EfficientNet for initial binary classification and temporal artifact flagging, followed by Gemini Vision for human-readable forensic explanation, finalized by LLM-driven structured reporting.",
          recommendations: [
            "Cross-verify with original source meta-data if available.",
            "Journalistic verification required before publication.",
            "Flag as 'High Risk' in editorial management systems."
          ]
        }
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
          <Hero />
          <div id="upload" className="scroll-mt-24">
            <UploadSection 
              onVideoUpload={handleVideoUpload} 
              isAnalyzing={isAnalyzing} 
              isLoggedIn={isLoggedIn}
            />
          </div>
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
