import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24',
        'max-w-6xl xl:max-w-7xl 2xl:max-w-[min(110rem,calc(100vw-6rem))]',
        className
      )}
      {...props}
    />
  );
}
