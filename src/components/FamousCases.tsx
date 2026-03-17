import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play, ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";
import { useCallback, useEffect } from "react";

const FamousCases = ({ onViewReport }: { onViewReport: (data: any) => void }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    if (emblaApi) {
      const intervalId = setInterval(() => {
        emblaApi.scrollNext();
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(intervalId);
    }
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const cases = [
    {
      title: "Trump-Anwar Investment Scam",
      description: "A 2025 deepfake featuring U.S. President Trump and Malaysia's PM Anwar Ibrahim pitching a scam. TruthLens detected neural audio synthesization artifacts and lip-sync viseme mismatches.",
      image: "/famous_deepfake_trump_anwar.png",
      tag: "Diplomatic Security",
      report: {
        fileName: "trump.mp4",
        overallConfidence: 98.2,
        isDeepfake: true,
        technicalDetails: { duration: "45s", resolution: "4K", fps: 60, codec: "HEVC", processingTime: "12s", modelArchitecture: "Gemini Vision + AudioForensics" },
        videoUrl: "https://qnctsgxidyvdxekvvugz.supabase.co/storage/v1/object/public/analysis_videos/c0c60d11-7ab2-4aa0-814c-0c76792ae3a0/1773745416305-trump.mp4",
        frameAnalysis: Array.from({ length: 30 }, (_, i) => ({ frame: i, timestamp: i * 1.5, confidence: 98 + Math.random(), anomalies: 2 })),
        anomalies: [{ id: 1, type: "Audio-Visual Mismatch", timestamp: 12.4, confidence: 99.1, region: "Mouth", description: "Audio frequencies do not match lip motor patterns." }]
      }
    },
    {
      title: "India's 2024 Polls",
      description: "AI-generated multilingual campaign speeches and holograms. TruthLens distinguished official AI campaign tools from malicious election interference.",
      image: "/famous_deepfake_modi.png",
      tag: "Election Integrity",
      report: {
        fileName: "modi.mp4",
        overallConfidence: 85.5,
        isDeepfake: true,
        technicalDetails: { duration: "2m 15s", resolution: "1080p", fps: 24, codec: "H.264", processingTime: "30s", modelArchitecture: "MultilingualSync + EfficientNet" },
        videoUrl: "https://qnctsgxidyvdxekvvugz.supabase.co/storage/v1/object/public/analysis_videos/c0c60d11-7ab2-4aa0-814c-0c76792ae3a0/1773747257177-modi.mp4",
        frameAnalysis: Array.from({ length: 30 }, (_, i) => ({ frame: i, timestamp: i * 4.5, confidence: 85 + Math.random() * 5, anomalies: 1 })),
        anomalies: [{ id: 1, type: "Language Pattern Blur", timestamp: 45.2, confidence: 88.4, region: "Jawline", description: "Edge blending artifacts in Marathi translation layer." }]
      }
    },
    {
      title: "The Cruise Glitch",
      description: "A viral AI-generated video of Tom Cruise that bypassed traditional detection. TruthLens identified pixel-level blending artifacts.",
      image: "/famous_deepfake_tom_cruise.png",
      tag: "Viral Meta-AI",
      report: {
        fileName: "tom.mp4",
        overallConfidence: 94.2,
        isDeepfake: true,
        technicalDetails: { duration: "12s", resolution: "1080p", fps: 30, codec: "H.264", processingTime: "5s", modelArchitecture: "EfficientNet-B7" },
        videoUrl: "https://qnctsgxidyvdxekvvugz.supabase.co/storage/v1/object/public/analysis_videos/c0c60d11-7ab2-4aa0-814c-0c76792ae3a0/1773747511779-tom.mp4",
        frameAnalysis: Array.from({ length: 30 }, (_, i) => ({ frame: i, timestamp: i * 0.4, confidence: 94 + Math.random() * 2, anomalies: 1 })),
        anomalies: [{ id: 1, type: "Edge Haloing", timestamp: 3.2, confidence: 96.5, region: "Hairline", description: "Alpha channel inconsistencies detected during movement." }]
      }
    },
    {
      title: "The Obama PSA",
      description: "Jordan Peele's famous warning about deepfakes. Our Gemini Vision model explains the lip-sync viseme mismatch in detail.",
      image: "/famous_deepfake_obama.png",
      tag: "Public Awareness",
      report: {
        fileName: "obama.mp4",
        overallConfidence: 88.7,
        isDeepfake: true,
        technicalDetails: { duration: "1m 30s", resolution: "720p", fps: 30, codec: "AAC", processingTime: "15s", modelArchitecture: "VisemeAnalyzer-V2" },
        videoUrl: "https://qnctsgxidyvdxekvvugz.supabase.co/storage/v1/object/public/analysis_videos/c0c60d11-7ab2-4aa0-814c-0c76792ae3a0/1773747724344-obama.mp4",
        frameAnalysis: Array.from({ length: 30 }, (_, i) => ({ frame: i, timestamp: i * 3.0, confidence: 88 + Math.random() * 4, anomalies: 3 })),
        anomalies: [{ id: 1, type: "Viseme Lag", timestamp: 15.8, confidence: 91.2, region: "Mouth", description: "Lip shapes do not correspond to 'P' and 'B' phonemes." }]
      }
    },
    {
      title: "Spectral Specter",
      description: "Synthesized corporate footage used in phishing attempts. EfficientNet detected the lack of natural skin micro-fluctuations.",
      image: "/famous_deepfake_zuckerberg.png",
      tag: "Corporate Security",
      report: {
        fileName: "zucksucks.mp4",
        overallConfidence: 91.5,
        isDeepfake: true,
        technicalDetails: { duration: "30s", resolution: "1080p", fps: 24, codec: "H.264", processingTime: "8s", modelArchitecture: "MicroExpressionDetector" },
        videoUrl: "https://qnctsgxidyvdxekvvugz.supabase.co/storage/v1/object/public/analysis_videos/c0c60d11-7ab2-4aa0-814c-0c76792ae3a0/1773747958711-zucksucks.mp4",
        frameAnalysis: Array.from({ length: 30 }, (_, i) => ({ frame: i, timestamp: i * 1.0, confidence: 91 + Math.random() * 3, anomalies: 1 })),
        anomalies: [{ id: 1, type: "Static Micro-vibration", timestamp: 8.5, confidence: 93.1, region: "Face", description: "Lack of blood-flow induced skin color fluctuations (rPPG)." }]
      }
    },
  ];

  return (
    <section className="py-24 px-6 bg-secondary/30">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
              Famous <span className="text-primary">Detected</span> Cases
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Explore how TruthLens AI breaks down the world's most sophisticated deepfakes using our 3-step forensic pipeline.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="rounded-full border-glass bg-glass"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="rounded-full border-glass bg-glass"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {cases.map((item, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_40%] lg:flex-[0_0_30%]"
              >
                <div className="group relative h-[450px] overflow-hidden rounded-3xl border border-glass bg-glass transition-all duration-300 hover:border-primary/50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-0 p-8 w-full">
                    <div className="flex items-center gap-2 text-destructive mb-2">
                      <ShieldAlert className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-tighter">Deepfake Confirmed</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                      {item.description}
                    </p>
                    <Button 
                      onClick={() => onViewReport(item.report)}
                      className="w-full bg-glass border-glass hover:bg-primary hover:text-primary-foreground group transition-all"
                    >
                      <Play className="mr-2 h-4 w-4 fill-current" />
                      View Analysis
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FamousCases;
