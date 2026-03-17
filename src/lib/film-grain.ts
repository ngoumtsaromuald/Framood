/** Apply film grain effect to a Canvas context */
export function applyGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
): void {
  if (intensity <= 0) return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const grainAmount = intensity * 40; // Scale intensity (0-1) to pixel variation

  for (let i = 0; i < pixels.length; i += 4) {
    const noise = (Math.random() - 0.5) * grainAmount;
    pixels[i] = Math.min(255, Math.max(0, pixels[i]! + noise));       // R
    pixels[i + 1] = Math.min(255, Math.max(0, pixels[i + 1]! + noise)); // G
    pixels[i + 2] = Math.min(255, Math.max(0, pixels[i + 2]! + noise)); // B
  }

  ctx.putImageData(imageData, 0, 0);
}

/** Apply vignette effect to a Canvas context */
export function applyVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
): void {
  if (intensity <= 0) return;

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.max(width, height) * 0.7;

  const gradient = ctx.createRadialGradient(
    centerX, centerY, radius * 0.3,
    centerX, centerY, radius,
  );
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, `rgba(0,0,0,${intensity})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
