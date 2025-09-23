import Skeleton from '@/components/ui/Skeleton';
import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';

export default function Loading() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden bg-wura-black/90 py-28 text-wura-white">
        <Container className="space-y-6">
          <Skeleton className="h-4 w-48 rounded-full bg-white/20" />
          <Skeleton className="h-12 w-2/3 max-w-xl rounded-full bg-white/10" />
          <Skeleton className="h-4 w-1/2 max-w-md rounded-full bg-white/10" />
          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </Container>
      </section>

      <Section>
        <Container className="space-y-8">
          <Skeleton className="h-4 w-56 rounded-full" />
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-3xl" />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-wura-black/5">
        <Container className="space-y-8">
          <Skeleton className="h-4 w-56 rounded-full" />
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-3xl" />
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
