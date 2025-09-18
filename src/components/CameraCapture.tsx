import React, { useRef, useCallback, useState } from 'react';
import { Camera, X, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface CameraCaptureProps {
  onImageCapture: (file: File) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onImageCapture,
  onClose,
  isLoading = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use rear camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreamActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file input on error
      onClose();
    }
  }, [onClose]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreamActive(false);
    }
  }, []);

  const takePicture = useCallback(async () => {
    setIsCapturing(true);
    
    try {
      // Check if we're running on a mobile device with Capacitor
      if (Capacitor.isNativePlatform()) {
        // Stop current stream first
        stopCamera();
        
        // Use native camera
        const image = await CapacitorCamera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          width: 1280,
          height: 1280
        });

        if (image.dataUrl) {
          // Convert data URL to File
          const response = await fetch(image.dataUrl);
          const blob = await response.blob();
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          onImageCapture(file);
        }
      } else {
        // Use web camera capture
        captureFromWebCamera();
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      // Fallback to web camera if native camera fails
      captureFromWebCamera();
    } finally {
      setIsCapturing(false);
    }
  }, [onImageCapture, stopCamera]);

  const captureFromWebCamera = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageUrl);
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  }, [stopCamera]);

  const confirmCapture = useCallback(() => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        onImageCapture(file);
      }
    }, 'image/jpeg', 0.8);
  }, [onImageCapture]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  // Start camera when component mounts
  React.useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      startCamera();
    }
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  if (capturedImage) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="relative max-w-md w-full bg-gradient-card border-card-border shadow-red-glow">
            <div className="aspect-square w-full overflow-hidden rounded-lg">
              <img
                src={capturedImage}
                alt="Captured meal"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              <Button
                onClick={retakePhoto}
                disabled={isLoading}
                size="lg"
                variant="secondary"
                className="bg-surface hover:bg-surface-elevated border border-border"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake
              </Button>
              
              <Button
                onClick={confirmCapture}
                disabled={isLoading}
                size="lg"
                className="bg-gradient-hero hover:opacity-90 text-white font-semibold shadow-glow"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Use Photo
              </Button>
            </div>

            <Button
              onClick={onClose}
              disabled={isLoading}
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 bg-surface/90 hover:bg-surface"
            >
              <X className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="relative max-w-md w-full bg-gradient-card border-card-border shadow-red-glow">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-surface">
            {Capacitor.isNativePlatform() ? (
              // Native mobile - just show button to launch camera
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <Camera className="w-16 h-16 text-primary mx-auto" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-card-foreground">
                      Ready to Capture
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tap the button below to open your camera
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Web - show camera stream
              <>
                {isStreamActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto animate-pulse" />
                      <p className="text-muted-foreground">Starting camera...</p>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </>
            )}
          </div>
          
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={takePicture}
              disabled={isCapturing || isLoading || (!isStreamActive && !Capacitor.isNativePlatform())}
              size="lg"
              className="bg-gradient-hero hover:opacity-90 text-white font-semibold w-16 h-16 rounded-full shadow-glow pulse-red"
            >
              {isCapturing ? (
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-8 h-8" />
              )}
            </Button>
          </div>

          <Button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            disabled={isCapturing || isLoading}
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 bg-surface/90 hover:bg-surface"
          >
            <X className="w-4 h-4" />
          </Button>
        </Card>
      </div>
    </div>
  );
};