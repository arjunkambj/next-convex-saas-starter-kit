"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { m, LazyMotion, domAnimation } from "framer-motion";

const ONBOARDING_STEPS = [
  { path: "/onboarding/create-organization", step: 1 },
  { path: "/onboarding/invite-team", step: 2 },
  { path: "/onboarding/overview", step: 3 },
];

export default function OnboardingProgress() {
  const pathname = usePathname();
  
  const currentStepData = ONBOARDING_STEPS.find(step => pathname === step.path);
  const currentStep = currentStepData?.step || 1;

  return (
    <LazyMotion features={domAnimation}>
      <m.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-4"
      >
        {ONBOARDING_STEPS.map((step, index) => {
          const isActive = step.step === currentStep;
          const isCompleted = step.step < currentStep;
          
          return (
            <React.Fragment key={step.step}>
              <m.div
                initial={false}
                animate={{
                  width: isActive ? 40 : 12,
                  height: 12,
                  backgroundColor: isActive || isCompleted 
                    ? "rgb(99, 102, 241)"
                    : "rgb(229, 229, 229)",
                }}
                transition={{ 
                  duration: 0.4, 
                  ease: "easeInOut",
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                className="rounded-full relative overflow-hidden"
              >
                {/* Shimmer effect for active step */}
                {isActive && (
                  <m.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: [-40, 40],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                )}
              </m.div>
              
              {/* Connector line */}
              {index < ONBOARDING_STEPS.length - 1 && (
                <div 
                  className={`h-[2px] w-12 transition-all duration-500 ${
                    isCompleted ? "bg-primary" : "bg-default-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </m.div>
    </LazyMotion>
  );
}