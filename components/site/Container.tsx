import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Container({ className, style, ...props }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', className)}
      style={{ maxWidth: '1200px', ...style }}
      {...props}
    />
  );
}
