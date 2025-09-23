import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] focus-ring transition-transform duration-200 ease-std will-change-transform hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-wura-black bg-wura-black text-wura-white shadow-[0_14px_36px_rgba(11,11,11,0.25)] hover:border-wura-gold hover:text-wura-gold',
        secondary:
          'border-transparent bg-wura-wine text-wura-white shadow-[0_10px_26px_rgba(123,0,44,0.24)] hover:bg-wura-black',
        outline:
          'border-wura-gold text-wura-black hover:bg-wura-gold/10 hover:text-wura-black',
        ghost:
          'border-transparent text-wura-black hover:bg-wura-black/5 hover:text-wura-black',
        link:
          'border-none bg-transparent px-0 py-0 text-sm font-semibold uppercase tracking-[0.3em] hover:no-underline'
      },
      size: {
        default: 'h-12',
        sm: 'h-10 px-5 text-xs tracking-[0.25em]',
        lg: 'h-14 px-8 text-base tracking-[0.18em]',
        icon: 'h-10 w-10 gap-0 p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
