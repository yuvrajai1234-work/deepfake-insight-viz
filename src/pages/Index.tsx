import { useState } from "react";
import Hero from "@/components/Hero";
import UploadSection from "@/components/UploadSection";
import AnalysisDashboard from "@/components/AnalysisDashboard";

const Index = () => {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleVideoUpload = (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      // Mock analysis results
      const mockResults = {
        videoUrl: URL.createObjectURL(file),
        fileName: file.name,
        overallConfidence: 78.5,
        isDeepfake: true,
        frameAnalysis: Array.from({ length: 30 }, (_, i) => ({
          frame: i,
          timestamp: i * 0.5,
          confidence: 60 + Math.random() * 40,
          anomalies: Math.floor(Math.random() * 5),
        })),
        anomalies: [
          {
            id: 1,
            type: "Facial Manipulation",
            timestamp: 2.5,
            confidence: 85.2,
            region: "Face - Eyes",
            description: "Inconsistent eye blink patterns detected",
          },
          {
            id: 2,
            type: "Audio Mismatch",
            timestamp: 5.8,
            confidence: 72.4,
            region: "Audio Track",
            description: "Voice synthesization artifacts in frequency spectrum",
          },
          {
            id: 3,
            type: "Temporal Inconsistency",
            timestamp: 8.2,
            confidence: 91.7,
            region: "Face - Mouth",
            description: "Lip-sync misalignment with audio",
          },
        ],
        technicalDetails: {
          resolution: "1920x1080",
          duration: "15 seconds",
          fps: 30,
          codec: "H.264",
          processingTime: "3.2s",
        },
      };
      
      setAnalysisData(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {!analysisData ? (
        <>
          <Hero />
          <UploadSection onVideoUpload={handleVideoUpload} isAnalyzing={isAnalyzing} />
        </>
      ) : (
        <AnalysisDashboard 
          data={analysisData} 
          onReset={() => setAnalysisData(null)} 
        />
      )}
    </div>
  );
};

export default Index;
