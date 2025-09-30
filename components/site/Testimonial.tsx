import { Card, CardContent } from '@/components/ui/card';

interface TestimonialProps {
  quote: string;
  name: string;
  detail: string;
}

export function Testimonial({ quote, name, detail }: TestimonialProps) {
  return (
    <Card className="h-full bg-white/70">
      <CardContent className="flex h-full flex-col gap-6 p-8">
        <p className="lead text-wura-black/80">“{quote}”</p>
        <div>
          <p className="font-display text-wura-black">{name}</p>
          <p className="text-sm text-wura-black/60">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}
