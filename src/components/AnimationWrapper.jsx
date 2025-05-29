import React, { useEffect, useState } from "react";

// Fade-in animation wrapper
export const FadeIn = ({
  children,
  delay = 0,
  duration = "duration-200",
  className = "",
  direction = "up", // up, down, left, right, none
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const applyTransform = direction !== "none";

  const getAnimationStateClasses = () => {
    if (!isVisible) {
      if (applyTransform) {
        switch (direction) {
          case "up":
            return "translate-y-8 opacity-0";
          case "down":
            return "-translate-y-8 opacity-0";
          case "left":
            return "translate-x-8 opacity-0";
          case "right":
            return "-translate-x-8 opacity-0";
          // No default needed as applyTransform handles "none" through the outer if
        }
      }
      return "opacity-0"; // For direction "none" or if applyTransform is false
    }
    // Visible state
    if (applyTransform) {
      return "translate-y-0 translate-x-0 opacity-100";
    }
    return "opacity-100";
  };

  return (
    <div
      className={`${
        applyTransform ? "transform" : ""
      } transition-all ${duration} ease-out ${getAnimationStateClasses()} ${className}`}
    >
      {children}
    </div>
  );
};

// Stagger animation for lists
export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 25, // Adjusted from 100ms for faster stagger
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn delay={index * staggerDelay} key={index}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
};

// Scale animation on hover
export const ScaleOnHover = ({
  children,
  className = "",
  scale = "hover:scale-105",
}) => (
  <div
    className={`transform transition-transform duration-200 ease-out ${scale} ${className}`}
  >
    {children}
  </div>
);

// Slide in from side animation
export const SlideIn = ({
  children,
  direction = "left",
  delay = 0,
  duration = "duration-500",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getSlideClasses = () => {
    if (!isVisible) {
      switch (direction) {
        case "left":
          return "-translate-x-full opacity-0";
        case "right":
          return "translate-x-full opacity-0";
        case "top":
          return "-translate-y-full opacity-0";
        case "bottom":
          return "translate-y-full opacity-0";
        default:
          return "-translate-x-full opacity-0";
      }
    }
    return "translate-x-0 translate-y-0 opacity-100";
  };

  return (
    <div
      className={`transform transition-all ${duration} ease-out ${getSlideClasses()} ${className}`}
    >
      {children}
    </div>
  );
};

// Page transition wrapper
export const PageTransition = ({ children, className = "" }) => (
  <FadeIn
    duration="duration-150"
    className={`min-h-screen ${className}`}
    direction="none"
  >
    {children}
  </FadeIn>
);

// Modal animation wrapper
export const ModalAnimation = ({ isOpen, children, onClose }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose && onClose();
    }, 200); // Match duration
  };

  if (!isOpen && !showModal) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        showModal
          ? "bg-black/30 backdrop-blur-sm"
          : "bg-transparent pointer-events-none"
      }`}
      onClick={handleClose}
    >
      <div
        className={`transform transition-all duration-200 ease-out ${
          showModal
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Button press animation
export const ButtonPress = ({ children, className = "" }) => (
  <div
    className={`transform transition-transform duration-75 active:scale-95 ${className}`}
  >
    {children}
  </div>
);

// Bounce animation
export const Bounce = ({ children, delay = 0, className = "" }) => {
  const [shouldBounce, setShouldBounce] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldBounce(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-transform duration-500 ease-out ${
        shouldBounce ? "animate-bounce" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Loading spinner with fade
export const LoadingSpinner = ({
  size = "w-8 h-8",
  color = "text-blue-600",
}) => (
  <FadeIn className="flex justify-center items-center">
    <div className={`${size} ${color} animate-spin`}>
      <svg
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </div>
  </FadeIn>
);

// Progressive loading wrapper
export const ProgressiveLoad = ({
  isLoading,
  skeleton,
  children,
  className = "",
}) => (
  <div className={className}>
    {isLoading ? (
      // FadeIn for skeleton with no delay, it should appear immediately
      <FadeIn delay={0} direction="none">
        {skeleton}
      </FadeIn>
    ) : (
      // FadeIn for content with a small delay
      <FadeIn delay={25} direction="none">
        {children}
      </FadeIn>
    )}
  </div>
);
