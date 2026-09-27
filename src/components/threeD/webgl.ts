let cachedWebGLAvailability: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (cachedWebGLAvailability !== null) {
    return cachedWebGLAvailability;
  }
  if (typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const context =
      canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl');
    cachedWebGLAvailability = Boolean(context);
    if (context) {
      const loseContext = (
        context as WebGLRenderingContext
      ).getExtension('WEBGL_lose_context');
      loseContext?.loseContext();
    }
  } catch {
    cachedWebGLAvailability = false;
  }

  return cachedWebGLAvailability;
}
