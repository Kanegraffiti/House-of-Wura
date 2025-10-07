import { cn } from '@/lib/utils';

interface OpulentPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'light' | 'dark';
}

export function OpulentPanel({ tone = 'dark', className, children, ...props }: OpulentPanelProps) {
  const paletteClass = tone === 'light' ? 'opulent-panel--light' : 'opulent-panel--dark';

  return (
    <div className={cn('opulent-panel', paletteClass, className)} {...props}>
      <span className="opulent-panel__glow" aria-hidden />
      <span className="opulent-panel__sheen" aria-hidden />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
