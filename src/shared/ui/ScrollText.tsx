"use client";

import {
  type MotionValue,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import * as React from "react";
import { cn } from "@/shared/lib/utils";
 
type ScrollEffect =
  | "fadeIn"
  | "fadeUp"
  | "fadeDown"
  | "parallax"
  | "scale"
  | "scaleUp"
  | "scaleDown"
  | "rotate"
  | "blur"
  | "slideLeft"
  | "slideRight"
  | "skew"
  | "flip"
  | "reveal";
 
interface ScrollTextProps {
  children: React.ReactNode;
  effect?: ScrollEffect;
  className?: string;
  offset?: [string, string];
  speed?: number;
  spring?: boolean;
  springConfig?: { stiffness?: number; damping?: number; mass?: number };
  threshold?: [number, number];
}
 
const ScrollText = React.forwardRef<HTMLDivElement, ScrollTextProps>(
  (
    {
      children,
      effect = "fadeIn",
      className,
      offset = ["start end", "end start"],
      speed = 1,
      spring = false,
      springConfig,
      threshold = [0, 0.22],
    },
    forwardedRef,
  ) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const ref =
      (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
 
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: offset as ["start end", "end start"],
    });
 
    const [start, end] = threshold;
    const springOpts = {
      stiffness: springConfig?.stiffness ?? 100,
      damping: springConfig?.damping ?? 30,
      mass: springConfig?.mass ?? 1,
    };
 
    // Create transforms
    const rawOpacity = useTransform(scrollYProgress, [start, end], [0, 1]);
    const rawY = useTransform(scrollYProgress, [start, end], [50 * speed, 0]);
    const rawYDown = useTransform(
      scrollYProgress,
      [start, end],
      [-50 * speed, 0],
    );
    const rawYParallax = useTransform(
      scrollYProgress,
      [0, 1],
      [100 * speed, -100 * speed],
    );
    const rawScale = useTransform(scrollYProgress, [start, end], [0.5, 1]);
    const rawScaleUp = useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [0.8, 1, 1.2],
    );
    const rawScaleDown = useTransform(
      scrollYProgress,
      [0, 0.5, 1],
      [1.2, 1, 0.8],
    );
    const rawRotate = useTransform(scrollYProgress, [0, 1], [0, 360 * speed]);
    const rawBlurOpacity = useTransform(
      scrollYProgress,
      [start, end],
      [0.5, 1],
    );
    const rawX = useTransform(scrollYProgress, [start, end], [200 * speed, 0]);
    const rawXRight = useTransform(
      scrollYProgress,
      [start, end],
      [-200 * speed, 0],
    );
    const rawSkew = useTransform(
      scrollYProgress,
      [start, end],
      [20 * speed, 0],
    );
    const rawRotateX = useTransform(scrollYProgress, [start, end], [90, 0]);
 
    // Apply spring if needed
    const opacitySpring = useSpring(rawOpacity, springOpts);
    const ySpring = useSpring(rawY, springOpts);
    const yDownSpring = useSpring(rawYDown, springOpts);
    const yParallaxSpring = useSpring(rawYParallax, springOpts);
    const scaleSpring = useSpring(rawScale, springOpts);
    const scaleUpSpring = useSpring(rawScaleUp, springOpts);
    const scaleDownSpring = useSpring(rawScaleDown, springOpts);
    const rotateSpring = useSpring(rawRotate, springOpts);
    const blurOpacitySpring = useSpring(rawBlurOpacity, springOpts);
    const rotateXSpring = useSpring(rawRotateX, springOpts);
 
    const opacity = spring ? opacitySpring : rawOpacity;
    const y = spring ? ySpring : rawY;
    const yDown = spring ? yDownSpring : rawYDown;
    const yParallax = spring ? yParallaxSpring : rawYParallax;
    const scale = spring ? scaleSpring : rawScale;
    const scaleUp = spring ? scaleUpSpring : rawScaleUp;
    const scaleDown = spring ? scaleDownSpring : rawScaleDown;
    const rotate = spring ? rotateSpring : rawRotate;
    const blurOpacity = spring ? blurOpacitySpring : rawBlurOpacity;
    const rotateX = spring ? rotateXSpring : rawRotateX;
    const xSpring = useSpring(rawX, springOpts);
    const xRightSpring = useSpring(rawXRight, springOpts);
    const skewSpring = useSpring(rawSkew, springOpts);
 
    const x = spring ? xSpring : rawX;
    const xRight = spring ? xRightSpring : rawXRight;
    const skew = spring ? skewSpring : rawSkew;
 
    // Non-springable transforms
    const blur = useTransform(scrollYProgress, [start, end], [10 * speed, 0]);
    const clipPath = useTransform(scrollYProgress, [start, end], [100, 0]);
 
    const effectStyles: Record<
      ScrollEffect,
      Record<string, MotionValue<number>>
    > = {
      fadeIn: { opacity },
      fadeUp: { opacity, y },
      fadeDown: { opacity, y: yDown },
      parallax: { y: yParallax },
      scale: { scale, opacity },
      scaleUp: { scale: scaleUp },
      scaleDown: { scale: scaleDown },
      rotate: { rotate },
      blur: { opacity: blurOpacity },
      slideLeft: { x, opacity },
      slideRight: { x: xRight, opacity },
      skew: { skewX: skew, opacity },
      flip: { rotateX, opacity },
      reveal: {},
    };
 
    const filterBlur = useTransform(blur, (v) => `blur(${v}px)`);
    const clipPathValue = useTransform(clipPath, (v) => `inset(0 ${v}% 0 0)`);
 
    return (
      <motion.div
        ref={ref}
        className={cn("will-change-transform", className)}
        style={{
          ...effectStyles[effect],
          ...(effect === "blur" && { filter: filterBlur }),
          ...(effect === "reveal" && { clipPath: clipPathValue }),
          ...(effect === "flip" && { perspective: 1000 }),
        }}
      >
        {children}
      </motion.div>
    );
  },
);
 
ScrollText.displayName = "ScrollText";
 
export { ScrollText };
