'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import './TiltedCard.css';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  containerHeight = '300px',
  containerWidth = '300px',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.05,
  rotateAmplitude = 12,
  showMobileWarning = false,
  showTooltip = false,
  captionText = '',
  overlayContent = null,
  displayOverlayContent = true,
  statusText = '',
  active = false,
  className = '',
  children,
  onClick,
  onKeyDown,
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className={`tilted-card-figure ${className}`}
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {showMobileWarning && (
        <div className="tilted-card-mobile-alert">This effect is not optimized for mobile. Check on desktop.</div>
      )}

      <motion.div
        className={`tilted-card-inner ${active ? 'is-active' : ''}`}
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        <div className="tilted-card-shell">
          <div className="tilted-card-shell-glow" />
          <div className="tilted-card-shell-vignette" />

          {imageSrc ? (
            <motion.img
              src={imageSrc}
              alt={altText}
              className="tilted-card-img"
              style={{ width: imageWidth, height: imageHeight }}
            />
          ) : (
            <div className="tilted-card-face">
              {displayOverlayContent && overlayContent ? (
                <div className="tilted-card-overlay">{overlayContent}</div>
              ) : (
                <div className="tilted-card-overlay">{children}</div>
              )}

              {statusText ? <div className="tilted-card-status">{statusText}</div> : null}
            </div>
          )}

          {active ? <span className="tilted-card-pulse" /> : null}
        </div>
      </motion.div>

      {showTooltip && captionText ? (
        <motion.figcaption
          className="tilted-card-caption"
          style={{ x, y, opacity, rotate: rotateFigcaption }}
        >
          {captionText}
        </motion.figcaption>
      ) : null}
    </figure>
  );
}