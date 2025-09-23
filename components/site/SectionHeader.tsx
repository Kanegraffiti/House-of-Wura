import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mx-auto flex max-w-3xl flex-col items-center gap-4 text-center',
        align === 'left' && 'items-start text-left',
        className
      )}
      {...props}
    >
      {eyebrow ? (
        <Badge variant="subtle" className="bg-wura-gold/20 text-[0.65rem] text-wura-black">
          {eyebrow}
        </Badge>
      ) : null}
      <h2 className="font-display text-3xl sm:text-4xl text-wura-black">{title}</h2>
      {description ? (
        <p className="text-base text-wura-black/70 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
