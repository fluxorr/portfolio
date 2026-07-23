"use client";

import {
  AnimatePresence,
  type DOMMotionComponents,
  type MotionProps,
  motion,
  type Variants,
} from "motion/react";
import { Children, isValidElement, memo, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type StaggerType = "children" | "self";
type AnimationVariant =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "blurInDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown";

const motionElements = {
  article: motion.article,
  aside: motion.aside,
  button: motion.button,
  div: motion.div,
  figure: motion.figure,
  footer: motion.footer,
  header: motion.header,
  li: motion.li,
  main: motion.main,
  nav: motion.nav,
  p: motion.p,
  section: motion.section,
  span: motion.span,
  ul: motion.ul,
} as const;

type MotionElementType = Extract<
  keyof DOMMotionComponents,
  keyof typeof motionElements
>;

interface AnimateElementProps extends Omit<MotionProps, "children"> {
  /**
   * The element(s) to animate — divs, buttons, cards, list items, anything.
   */
  children: ReactNode;
  /**
   * The class name applied to the wrapping container.
   */
  className?: string;
  /**
   * The class name applied to each animated item's wrapper (only used when by="children").
   */
  itemClassName?: string;
  /**
   * The delay before the animation starts.
   */
  delay?: number;
  /**
   * The total duration used to derive the per-item stagger interval.
   */
  duration?: number;
  /**
   * The delay, in seconds, between each child's animation. Overrides the
   * value derived from `duration` when provided.
   */
  staggerDelay?: number;
  /**
   * Custom motion variants for the animation, overrides `animation`.
   */
  variants?: Variants;
  /**
   * The element type to render as the outer wrapper.
   */
  as?: MotionElementType;
  /**
   * The element type to render for each staggered item (by="children" only).
   */
  itemAs?: MotionElementType;
  /**
   * "children" staggers each direct child in; "self" animates the whole
   * block as a single unit (no stagger, no extra wrapper per item).
   */
  by?: StaggerType;
  /**
   * Whether to start the animation when the component enters the viewport.
   */
  startOnView?: boolean;
  /**
   * Whether to animate only once, or every time it (re)enters the viewport.
   */
  once?: boolean;
  /**
   * The animation preset to use.
   */
  animation?: AnimationVariant;
}

const defaultContainerVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0,
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
};

const _defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const defaultItemAnimationVariants: Record<
  AnimationVariant,
  { container: Variants; item: Variants }
> = {
  fadeIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
    },
  },
  blurIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.3 } },
      exit: { opacity: 0, filter: "blur(10px)", transition: { duration: 0.3 } },
    },
  },
  blurInUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
    },
  },
  blurInDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        y: -20,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
    },
  },
  slideUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: 24, opacity: 0 },
      show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
      exit: { y: -24, opacity: 0, transition: { duration: 0.3 } },
    },
  },
  slideDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: -24, opacity: 0 },
      show: { y: 0, opacity: 1, transition: { duration: 0.3 } },
      exit: { y: 24, opacity: 0, transition: { duration: 0.3 } },
    },
  },
  slideLeft: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 24, opacity: 0 },
      show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
      exit: { x: -24, opacity: 0, transition: { duration: 0.3 } },
    },
  },
  slideRight: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: -24, opacity: 0 },
      show: { x: 0, opacity: 1, transition: { duration: 0.3 } },
      exit: { x: 24, opacity: 0, transition: { duration: 0.3 } },
    },
  },
  scaleUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 0.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: { type: "spring", damping: 15, stiffness: 300 },
        },
      },
      exit: { scale: 0.5, opacity: 0, transition: { duration: 0.3 } },
    },
  },
  scaleDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 1.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: { type: "spring", damping: 15, stiffness: 300 },
        },
      },
      exit: { scale: 1.5, opacity: 0, transition: { duration: 0.3 } },
    },
  },
};

const AnimateElementBase = ({
  children,
  delay = 0,
  duration = 0.4,
  staggerDelay,
  variants,
  className,
  itemClassName,
  as: Component = "div",
  itemAs: ItemComponent = "div",
  startOnView = true,
  once = false,
  by = "children",
  animation = "fadeIn",
  ...props
}: AnimateElementProps) => {
  const MotionComponent = motionElements[Component];
  const MotionItemComponent = motionElements[ItemComponent];

  const items = Children.toArray(children).filter(
    (child) =>
      isValidElement(child) ||
      (typeof child === "string" && child.trim() !== ""),
  );

  const itemCount = by === "children" ? Math.max(items.length, 1) : 1;
  const stagger = staggerDelay ?? duration / itemCount;

  const baseVariants = variants
    ? { container: defaultContainerVariants, item: variants }
    : defaultItemAnimationVariants[animation];

  const finalVariants = {
    container: {
      ...baseVariants.container,
      show: {
        ...baseVariants.container.show,
        transition: { delayChildren: delay, staggerChildren: stagger },
      },
      exit: {
        ...baseVariants.container.exit,
        transition: { staggerChildren: stagger, staggerDirection: -1 },
      },
    } as Variants,
    item: baseVariants.item,
  };

  // by="self" — animate the whole block as one unit, no per-child wrapping.
  if (by === "self") {
    return (
      <AnimatePresence mode="popLayout">
        <MotionComponent
          variants={finalVariants.item}
          initial="hidden"
          whileInView={startOnView ? "show" : undefined}
          animate={startOnView ? undefined : "show"}
          exit="exit"
          className={className}
          viewport={{ once }}
          transition={{
            delay,
            ...(finalVariants.item as any)?.show?.transition,
          }}
          {...props}
        >
          {children}
        </MotionComponent>
      </AnimatePresence>
    );
  }

  // by="children" — stagger each direct child in.
  return (
    <AnimatePresence mode="popLayout">
      <MotionComponent
        variants={finalVariants.container}
        initial="hidden"
        whileInView={startOnView ? "show" : undefined}
        animate={startOnView ? undefined : "show"}
        exit="exit"
        className={className}
        viewport={{ once }}
        {...props}
      >
        {items.map((child, i) => {
          const key =
            isValidElement(child) && child.key != null ? child.key : i;
          return (
            <MotionItemComponent
              key={key}
              variants={finalVariants.item}
              className={cn(itemClassName)}
            >
              {child}
            </MotionItemComponent>
          );
        })}
      </MotionComponent>
    </AnimatePresence>
  );
};

// Export the memoized version
export const AnimateElement = memo(AnimateElementBase);
