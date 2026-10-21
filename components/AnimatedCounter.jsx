"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedCounter({ value }) {
  const spring = useSpring(value, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });

  const display = useTransform(spring, (current) =>
    Math.round(current).toString().padStart(3, "0")
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}
