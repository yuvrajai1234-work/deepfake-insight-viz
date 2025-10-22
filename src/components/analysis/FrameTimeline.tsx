import { TrendingUp } from "lucide-react";

interface Frame {
  frame: number;
  timestamp: number;
  confidence: number;
  anomalies: number;
}

interface FrameTimelineProps {
  frames: Frame[];
  selectedFrame: number | null;
  onFrameSelect: (frame: number) => void;
}

const FrameTimeline = ({ frames, selectedFrame, onFrameSelect }: FrameTimelineProps) => {
  const maxConfidence = Math.max(...frames.map((f) => f.confidence));

  return (
    <div className="rounded-2xl border border-glass bg-glass p-6 backdrop-blur-xl shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Frame-by-Frame Analysis
        </h3>
        <TrendingUp className="h-5 w-5 text-primary" />
      </div>

      {/* Timeline visualization */}
      <div className="relative">
        <div className="flex gap-1 h-32 items-end">
          {frames.map((frame) => {
            const height = (frame.confidence / maxConfidence) * 100;
            const isSelected = selectedFrame === frame.frame;
            const hasAnomalies = frame.anomalies > 0;

            return (
              <button
                key={frame.frame}
                onClick={() => onFrameSelect(frame.frame)}
                className={`
                  flex-1 transition-all duration-200 rounded-t-sm
                  ${isSelected ? "ring-2 ring-primary shadow-glow" : ""}
                  ${
                    hasAnomalies
                      ? "bg-gradient-danger hover:shadow-glow-danger"
                      : "bg-gradient-primary hover:shadow-glow"
                  }
                `}
                style={{ height: `${height}%` }}
                title={`Frame ${frame.frame} - ${frame.confidence.toFixed(1)}% confidence`}
              />
            );
          })}
        </div>

        {/* Timeline labels */}
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>0s</span>
          <span>5s</span>
          <span>10s</span>
          <span>15s</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-gradient-primary" />
          <span className="text-muted-foreground">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-gradient-danger" />
          <span className="text-muted-foreground">Anomaly</span>
        </div>
      </div>
    </div>
  );
};

export default FrameTimeline;
