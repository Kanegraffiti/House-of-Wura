import Skeleton from '@/components/ui/Skeleton';
import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';

export default function LoadingShop() {
  return (
    <Section className="bg-wura-black/5">
      <Container className="space-y-10">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40 rounded-full" />
          <Skeleton className="h-10 w-2/3 max-w-xl rounded-full" />
          <Skeleton className="h-4 w-3/4 max-w-2xl rounded-full" />
        </div>
        <Skeleton className="h-14 w-full rounded-full" />
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[3/4] rounded-3xl" />
          ))}
        </div>
      </Container>
    </Section>
  );
}
