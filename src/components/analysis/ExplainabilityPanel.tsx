import { Brain, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ExplainabilityPanelProps {
  anomalies: any[];
  technicalDetails: any;
}

const ExplainabilityPanel = ({ anomalies, technicalDetails }: ExplainabilityPanelProps) => {
  return (
    <div className="rounded-2xl border border-glass bg-glass backdrop-blur-xl shadow-card">
      <div className="border-b border-glass p-6">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            AI Explainability
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Understanding the detection reasoning
        </p>
      </div>

      <div className="p-6 space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="detection-methods" className="border-glass">
            <AccordionTrigger className="text-foreground hover:text-primary">
              Detection Methods
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <div className="rounded-lg bg-secondary/50 p-3">
                <h5 className="font-medium text-foreground mb-1">CNN Analysis</h5>
                <p>Convolutional neural networks analyzing facial features, textures, and artifacts</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <h5 className="font-medium text-foreground mb-1">RNN Audio Processing</h5>
                <p>Recurrent networks detecting voice synthesis and audio-visual mismatches</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <h5 className="font-medium text-foreground mb-1">Temporal Analysis</h5>
                <p>Frame sequence analysis for consistency and natural motion patterns</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="key-indicators" className="border-glass">
            <AccordionTrigger className="text-foreground hover:text-primary">
              Key Indicators
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              {anomalies.map((anomaly) => (
                <div key={anomaly.id} className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-foreground">{anomaly.type}</h5>
                    <span className="text-xs text-destructive">{anomaly.confidence}%</span>
                  </div>
                  <p>{anomaly.description}</p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="technical-details" className="border-glass">
            <AccordionTrigger className="text-foreground hover:text-primary">
              Technical Details
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              <div className="space-y-2">
                {Object.entries(technicalDetails).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="font-medium text-foreground">{value as string}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h5 className="font-medium text-foreground mb-1">About XAI</h5>
              <p className="text-muted-foreground">
                Our explainable AI (XAI) approach uses LIME and SHAP techniques to visualize 
                which features influenced the detection, making the AI's decision-making transparent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainabilityPanel;
