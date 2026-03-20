import { toPng } from 'html-to-image';
import { applyGrain, applyVignette } from '@/lib/film-grain';
import type { ExportFormat } from '@/types/frame';

/** Dimensions for each export format */
const FORMAT_DIMS: Record<ExportFormat, { width: number; height: number }> = {
  story:     { width: 1080, height: 1920 },
  wallpaper: { width: 1080, height: 1920 },
  square:    { width: 1080, height: 1080 },
  desktop:   { width: 1920, height: 1080 },
};

interface ExportOptions {
  grain: number;     // 0-1 intensity
  vignette: number;  // 0-1 intensity
}

/** Render the watermark onto the canvas */
function drawWatermark(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const fontSize = Math.round(width * 0.035); // 3.5% of width ~ 38px on 1080
  ctx.save();
  ctx.font = `500 ${fontSize}px 'DM Sans', sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 8;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('Créé avec Framood', width / 2, height - fontSize * 1.5);
  ctx.restore();
}

/**
 * Export a DOM element to a PNG Blob with Canvas post-processing.
 * Applies grain, vignette, and the Framood watermark.
 */
export async function exportToPng(
  element: HTMLElement,
  format: ExportFormat,
  options: ExportOptions = { grain: 0, vignette: 0 },
): Promise<Blob> {
  const dims = FORMAT_DIMS[format];
  const pixelRatio = 3;

  // Capture the DOM element to a data URL via html-to-image
  // We don't force width/height here so it captures natural dimensions
  const dataUrl = await toPng(element, {
    pixelRatio,
    cacheBust: true,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
    },
  });

  // Load into Canvas for post-processing
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load exported image'));
    img.src = dataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = dims.width;
  canvas.height = dims.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // 1. Draw solid premium background (instead of huge grey area)
  ctx.fillStyle = '#0A0906'; // match --bg
  ctx.fillRect(0, 0, dims.width, dims.height);

  // 2. Calculate aspect ratio to perfectly center the phone (object-fit: contain)
  const scale = Math.min(dims.width / img.width, dims.height / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;
  const drawX = (dims.width - drawW) / 2;
  const drawY = (dims.height - drawH) / 2;

  // 3. Draw the captured image perfectly centered
  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  // Apply effects
  if (options.grain > 0) {
    applyGrain(ctx, dims.width, dims.height, options.grain);
  }
  if (options.vignette > 0) {
    applyVignette(ctx, dims.width, dims.height, options.vignette);
  }

  // Always add watermark clearly
  drawWatermark(ctx, dims.width, dims.height);

  // Convert to Blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      'image/png',
      1.0,
    );
  });
}

/**
 * Share an image using the best available method:
 * 1. navigator.share() if available (mobile)
 * 2. navigator.clipboard.write() if available (desktop)
 * 3. Direct download as fallback
 */
export async function shareImage(blob: Blob, filename: string): Promise<'shared' | 'copied' | 'downloaded'> {
  const file = new File([blob], filename, { type: 'image/png' });

  // 1. Try navigator.share()
  if (typeof navigator.share === 'function') {
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Framood',
          text: 'Ton humeur, encadrée.',
        });
        return 'shared';
      }
    } catch (err) {
      // User cancelled or share failed — fall through to next method
      if ((err as DOMException)?.name === 'AbortError') return 'shared';
    }
  }

  // 2. Try clipboard
  if (typeof navigator.clipboard?.write === 'function') {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return 'copied';
    } catch {
      // Clipboard failed — fall through to download
    }
  }

  // 3. Direct download fallback
  downloadImage(blob, filename);
  return 'downloaded';
}

/** Force-download a Blob as a file */
export function downloadImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
