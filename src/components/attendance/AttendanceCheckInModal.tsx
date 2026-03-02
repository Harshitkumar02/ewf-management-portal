import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/use-camera";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Camera, MapPin, CheckCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { getLocalDate, getLocalTime } from "@/lib/db";

const LiveTimestamp = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="text-center text-sm text-muted-foreground">
      {getLocalDate(now)} — {getLocalTime(now)}:{String(now.getSeconds()).padStart(2, "0")}
    </div>
  );
};

interface AttendanceCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "check-in" | "check-out";
  onSubmit?: (data: { photo: string; latitude: number; longitude: number; timestamp: string; type: string }) => void;
}

const AttendanceCheckInModal = ({ open, onOpenChange, type, onSubmit }: AttendanceCheckInModalProps) => {
  const { videoRef, canvasRef, photo, error: cameraError, active, startCamera, capturePhoto, retakePhoto, stopCamera } = useCamera();
  const { latitude, longitude, accuracy, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Start camera and location on open
  useEffect(() => {
    if (open) {
      startCamera();
      requestLocation();
      setSubmitted(false);
    } else {
      stopCamera();
    }
  }, [open]);

  const handleCapture = () => {
    capturePhoto();
  };

  const handleSubmit = () => {
    if (!photo || !latitude || !longitude) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit?.({
        photo,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
        type,
      });
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const canSubmit = photo && latitude && longitude && !submitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {type === "check-in" ? "Check-In" : "Check-Out"} Attendance
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              {type === "check-in" ? "Checked In" : "Checked Out"} Successfully!
            </h3>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Camera Section */}
            <div className="relative bg-foreground/5 rounded-lg overflow-hidden aspect-[4/3]">
              {!photo ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted p-4 text-center">
                      <div>
                        <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{cameraError}</p>
                        <Button size="sm" variant="outline" className="mt-2" onClick={startCamera}>
                          <RefreshCw className="w-3 h-3 mr-1" /> Retry
                        </Button>
                      </div>
                    </div>
                  )}
                  {active && !cameraError && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                      <Button onClick={handleCapture} size="lg" className="rounded-full w-14 h-14 p-0">
                        <Camera className="w-6 h-6" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="relative">
                  <img src={photo} alt="Selfie" className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <Button onClick={retakePhoto} size="sm" variant="secondary">
                      <RefreshCw className="w-3 h-3 mr-1" /> Retake
                    </Button>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Location Section */}
            <div className="bg-card border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  Location Status
                </div>
                {!latitude && (
                  <Button size="sm" variant="ghost" onClick={requestLocation} disabled={geoLoading}>
                    <RefreshCw className={`w-3 h-3 mr-1 ${geoLoading ? "animate-spin" : ""}`} />
                    {geoLoading ? "Locating..." : "Refresh"}
                  </Button>
                )}
              </div>

              {geoError && (
                <div className="flex items-start gap-2 text-sm text-destructive">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{geoError}</span>
                </div>
              )}

              {latitude && longitude && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm rounded-md p-2 bg-success/10 text-success">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Location captured: {latitude.toFixed(6)}, {longitude.toFixed(6)} (±{accuracy?.toFixed(0)}m)</span>
                  </div>
                </div>
              )}

              {geoLoading && !latitude && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Acquiring GPS location...
                </div>
              )}
            </div>

            {/* Timestamp - live clock */}
            <LiveTimestamp />

            {/* Submit */}
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {submitting ? (
                <><RefreshCw className="w-4 h-4 mr-1.5 animate-spin" /> Submitting...</>
              ) : (
                <>{type === "check-in" ? "Confirm Check-In" : "Confirm Check-Out"}</>
              )}
            </Button>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceCheckInModal;
