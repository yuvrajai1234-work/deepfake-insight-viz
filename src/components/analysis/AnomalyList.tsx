import { AlertCircle, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Anomaly {
  id: number;
  type: string;
  timestamp: number;
  confidence: number;
  region: string;
  description: string;
}

interface AnomalyListProps {
  anomalies: Anomaly[];
}

const AnomalyList = ({ anomalies }: AnomalyListProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-destructive text-destructive-foreground";
    if (confidence >= 60) return "bg-warning text-warning-foreground";
    return "bg-primary text-primary-foreground";
  };

  return (
    <div className="rounded-2xl border border-glass bg-glass p-6 backdrop-blur-xl shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Detected Anomalies
        </h3>
        <Badge variant="destructive" className="bg-destructive/20">
          {anomalies.length} Found
        </Badge>
      </div>

      <div className="space-y-3">
        {anomalies.map((anomaly) => (
          <div
            key={anomaly.id}
            className="group rounded-xl border border-glass bg-secondary/50 p-4 hover:bg-secondary/70 hover:shadow-glow-danger transition-all duration-300"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <h4 className="font-semibold text-foreground">{anomaly.type}</h4>
              </div>
              <Badge className={getConfidenceColor(anomaly.confidence)}>
                {anomaly.confidence}%
              </Badge>
            </div>

            <p className="mb-3 text-sm text-muted-foreground">
              {anomaly.description}
            </p>

            <div className="flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {anomaly.timestamp.toFixed(1)}s
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {anomaly.region}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnomalyList;
