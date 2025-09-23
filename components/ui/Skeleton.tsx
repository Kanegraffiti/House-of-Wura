import { cn } from '@/lib/utils';

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'h-full w-full rounded-md bg-black/10 dark:bg-white/10 bg-[linear-gradient(110deg,rgba(255,255,255,0)_40%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0)_60%)] bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  );
}
