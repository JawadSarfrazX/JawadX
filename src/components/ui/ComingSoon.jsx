import Card from "./Card";

export default function ComingSoon({ title }) {
  return (
    <Card className="p-10">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-stone-500">Yeh module abhi baaki hai. src/features mein is feature ke folder mein build karein.</p>
    </Card>
  );
}
