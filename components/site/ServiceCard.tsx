import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/site/Magnetic';
import { TiltCard } from '@/components/site/TiltCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { waLink } from '@/lib/wa';

interface ServiceCardProps {
  title: string;
  description: string;
  items: string[];
  message: string;
}

export function ServiceCard({ title, description, items, message }: ServiceCardProps) {
  return (
    <TiltCard className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex h-full flex-col gap-6">
        <ul className="space-y-2 text-sm text-wura-black/70">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-wura-gold to-wura-wine" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <Magnetic className="w-full">
            <Button className="w-full" asChild>
              <Link href={waLink(message)} target="_blank" rel="noopener noreferrer">
                <span className="link-glint">Get Quote on WhatsApp</span>
              </Link>
            </Button>
          </Magnetic>
        </div>
        </CardContent>
      </Card>
    </TiltCard>
  );
}
