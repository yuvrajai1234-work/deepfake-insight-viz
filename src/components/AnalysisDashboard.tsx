import { useState } from "react";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/analysis/VideoPlayer";
import ConfidenceScore from "@/components/analysis/ConfidenceScore";
import FrameTimeline from "@/components/analysis/FrameTimeline";
import AnomalyList from "@/components/analysis/AnomalyList";
import ExplainabilityPanel from "@/components/analysis/ExplainabilityPanel";

interface AnalysisDashboardProps {
  data: any;
  onReset: () => void;
}

const AnalysisDashboard = ({ data, onReset }: AnalysisDashboardProps) => {
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-[1800px]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="border-glass bg-glass backdrop-blur-xl hover:bg-card"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{data.fileName}</h2>
              <p className="text-sm text-muted-foreground">
                {data.technicalDetails.duration} • {data.technicalDetails.resolution}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-glass bg-glass backdrop-blur-xl hover:bg-card"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              size="sm"
              className="bg-gradient-primary hover:shadow-glow"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Video & Timeline */}
          <div className="space-y-6 lg:col-span-2">
            <VideoPlayer videoUrl={data.videoUrl} selectedFrame={selectedFrame} />
            <FrameTimeline
              frames={data.frameAnalysis}
              selectedFrame={selectedFrame}
              onFrameSelect={setSelectedFrame}
            />
            <AnomalyList anomalies={data.anomalies} />
          </div>

          {/* Right Column - Analysis Results */}
          <div className="space-y-6">
            <ConfidenceScore
              confidence={data.overallConfidence}
              isDeepfake={data.isDeepfake}
            />
            <ExplainabilityPanel
              anomalies={data.anomalies}
              technicalDetails={data.technicalDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
