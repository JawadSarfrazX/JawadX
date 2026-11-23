import { Sparkles } from "lucide-react";
import Card from "../../../components/ui/Card";

export default function InsightCard({ insight }) {
  const dots = Array.from({ length: 20 }, (_, i) => i < Math.round(insight.confidence / 5));
  return (
    <Card className="h-full">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold">AI Insight</h3>
        <span className="flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs"><Sparkles size={12} /> Powered by AI</span>
      </div>
      <div className="rounded-2xl bg-orange-50 p-4 ring-1 ring-orange-100">
        <h4 className="font-bold">{insight.title}</h4>
        <p className="mt-1 text-sm text-stone-600">{insight.text}</p>
        <div className="mt-4 flex items-center"><span className="text-xs font-medium">AI Confidence</span><span className="ml-auto text-sm font-bold">{insight.confidence}%</span></div>
        <div className="mt-2 flex gap-1">{dots.map((on, i) => <span key={i} className={`h-3 flex-1 rounded-full ${on ? "bg-brand" : "bg-orange-200"}`} />)}</div>
      </div>
    </Card>
  );
}
