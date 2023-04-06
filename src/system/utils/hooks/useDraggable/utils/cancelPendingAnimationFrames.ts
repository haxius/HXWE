const cancelPendingAnimationFrames = (
  currentAnimationFrame: number | undefined
): void => {
  if (currentAnimationFrame) {
    cancelAnimationFrame(currentAnimationFrame);
  }
};

export default cancelPendingAnimationFrames;
