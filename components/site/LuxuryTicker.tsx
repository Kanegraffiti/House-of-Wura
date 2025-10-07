import { cn } from '@/lib/utils';

interface LuxuryTickerProps extends React.HTMLAttributes<HTMLDivElement> {
  items: string[];
  tone?: 'light' | 'dark';
}

export function LuxuryTicker({ items, tone = 'dark', className, ...props }: LuxuryTickerProps) {
  if (!items.length) {
    return null;
  }

  const palette = tone === 'light'
    ? 'bg-white text-wura-black border-wura-black/10'
    : 'bg-gradient-to-r from-[#0b0b0b] via-[#1a0f12] to-[#3b0f24] text-white border-white/10';

  const accent = tone === 'light' ? 'text-wura-black/70' : 'text-white/70';

  const duplicated = [...items, ...items];

  return (
    <div
      className={cn(
        'luxury-grain relative overflow-hidden border-y',
        palette,
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,39,0.12),transparent_70%)]" aria-hidden />
      <div className="relative flex min-w-full items-center py-4">
        <div className="flex w-max items-center gap-10 whitespace-nowrap animate-[luxuryTicker_28s_linear_infinite]">
          {duplicated.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className={cn(
                'flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.55em]',
                accent
              )}
            >
              <span className="h-1 w-1 rounded-full bg-gradient-to-br from-wura-gold to-wura-wine" aria-hidden />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
