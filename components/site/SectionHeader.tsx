import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  className,
  ...props
}: SectionHeaderProps) {
  const isDark = tone === 'dark';
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
        <Badge
          variant="subtle"
          className={cn(
            'text-[0.65rem] uppercase tracking-[0.35em]',
            isDark
              ? 'bg-[#f6e7c6] text-wura-black shadow-[0_10px_30px_rgba(246,231,198,0.25)]'
              : 'bg-wura-gold/20 text-wura-black'
          )}
        >
          {eyebrow}
        </Badge>
      ) : null}
      <h2
        className={cn(
          'font-display',
          isDark ? 'text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]' : 'text-wura-black'
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'lead',
            isDark ? 'text-wura-white/75' : 'text-wura-black/70'
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
