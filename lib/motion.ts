import { Variants, Transition, TargetAndTransition } from 'framer-motion';

export const motionDur = {
  xs: 0.15,
  sm: 0.2,
  md: 0.28,
  lg: 0.35
} as const;

export const motionEase = {
  standard: [0.2, 0.0, 0.0, 1.0],
  emphasized: [0.3, 0.0, 0.2, 1.0],
  exit: [0.4, 0.0, 0.6, 1.0]
} as const;

export const trans = (d = motionDur.md): Transition => ({
  duration: d,
  ease: motionEase.emphasized as unknown as Transition['ease']
});

const withDelay = (variant: TargetAndTransition, delay = 0): TargetAndTransition => ({
  ...variant,
  transition: {
    ...variant.transition,
    delay,
    duration: variant.transition?.duration ?? trans().duration,
    ease: variant.transition?.ease ?? trans().ease
  }
});

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: withDelay({ opacity: 1, y: 0, transition: trans() })
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: withDelay({ opacity: 1, transition: trans(motionDur.sm) })
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: withDelay({ opacity: 1, scale: 1, transition: trans(motionDur.sm) })
};

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  show: withDelay({ opacity: 1, y: 0, transition: trans(motionDur.sm) })
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: withDelay({ opacity: 1, y: 0, transition: trans(motionDur.sm) })
};

export const delayVariant = (variant: Variants, delay = 0): Variants => ({
  hidden: variant.hidden,
  show: variant.show ? withDelay(variant.show as TargetAndTransition, delay) : undefined
});
