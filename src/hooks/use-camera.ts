import { useRef, useState, useCallback, useEffect } from "react";

interface CameraState {
  stream: MediaStream | null;
  photo: string | null;
  error: string | null;
  active: boolean;
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<CameraState>({
    stream: null,
    photo: null,
    error: null,
    active: false,
  });

  const startCamera = useCallback(async () => {
    try {
      setState((s) => ({ ...s, error: null }));
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      setState({ stream, photo: null, error: null, active: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      const message =
        err.name === "NotAllowedError"
          ? "Camera access denied. Please enable camera permissions."
          : err.name === "NotFoundError"
          ? "No camera found on this device."
          : "Failed to access camera. Please try again.";
      setState((s) => ({ ...s, error: message, active: false }));
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Mirror the selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setState((s) => ({ ...s, photo: dataUrl }));
    return dataUrl;
  }, []);

  const retakePhoto = useCallback(() => {
    setState((s) => ({ ...s, photo: null }));
  }, []);

  const stopCamera = useCallback(() => {
    if (state.stream) {
      state.stream.getTracks().forEach((track) => track.stop());
    }
    setState({ stream: null, photo: null, error: null, active: false });
  }, [state.stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (state.stream) {
        state.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [state.stream]);

  return {
    videoRef,
    canvasRef,
    ...state,
    startCamera,
    capturePhoto,
    retakePhoto,
    stopCamera,
  };
}
