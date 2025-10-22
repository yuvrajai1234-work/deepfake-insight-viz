import { AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ConfidenceScoreProps {
  confidence: number;
  isDeepfake: boolean;
}

const ConfidenceScore = ({ confidence, isDeepfake }: ConfidenceScoreProps) => {
  return (
    <div className="rounded-2xl border border-glass bg-glass p-6 backdrop-blur-xl shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Detection Result</h3>
        <Shield className="h-5 w-5 text-primary" />
      </div>

      {/* Main Status */}
      <div
        className={`mb-6 rounded-xl p-6 ${
          isDeepfake
            ? "bg-destructive/10 border border-destructive/30"
            : "bg-success/10 border border-success/30"
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          {isDeepfake ? (
            <AlertTriangle className="h-8 w-8 text-destructive" />
          ) : (
            <CheckCircle2 className="h-8 w-8 text-success" />
          )}
          <div>
            <h4 className="text-2xl font-bold text-foreground">
              {isDeepfake ? "Deepfake Detected" : "Authentic"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {confidence}% Confidence
            </p>
          </div>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Confidence</span>
            <span className="font-semibold text-foreground">{confidence}%</span>
          </div>
          <Progress
            value={confidence}
            className="h-3 bg-secondary"
            indicatorClassName={
              isDeepfake
                ? "bg-gradient-danger shadow-glow-danger"
                : "bg-gradient-success"
            }
          />
        </div>

        {/* Breakdown */}
        <div className="space-y-3 pt-4 border-t border-glass">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Visual Analysis</span>
            <span className="font-medium text-foreground">82%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Audio Analysis</span>
            <span className="font-medium text-foreground">71%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Temporal Consistency</span>
            <span className="font-medium text-foreground">89%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceScore;
