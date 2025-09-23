import Skeleton from '@/components/ui/Skeleton';
import { Container } from '@/components/site/Container';
import { Section } from '@/components/site/Section';

export default function LoadingLookbook() {
  return (
    <Section>
      <Container className="space-y-10">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-10 w-2/3 max-w-xl rounded-full" />
          <Skeleton className="h-4 w-3/4 max-w-lg rounded-full" />
        </div>
        <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="mb-4 h-[320px] w-full rounded-3xl" />
          ))}
        </div>
      </Container>
    </Section>
  );
}
