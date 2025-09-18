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
  const [isCapturing, setIsCapturing] = useState(false);

  const takePicture = useCallback(async () => {
    setIsCapturing(true);
    
    try {
      // Check if we're running on a mobile device with Capacitor
      if (Capacitor.isNativePlatform()) {
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
        // Fallback to web camera for desktop/browser
        await startWebCamera();
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      // Fallback to web camera if native camera fails
      await startWebCamera();
    } finally {
      setIsCapturing(false);
    }
  }, [onImageCapture]);

  const startWebCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      // Create a video element to capture the frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(true);
        };
      });

      // Wait a bit for the camera to stabilize
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create canvas and capture frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            onImageCapture(file);
          }
        }, 'image/jpeg', 0.8);
      }

      // Stop the stream
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.error('Web camera error:', error);
      onClose();
    }
  }, [onImageCapture, onClose]);

  // Automatically trigger camera when component mounts
  React.useEffect(() => {
    takePicture();
  }, [takePicture]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="relative max-w-md w-full bg-gradient-card border-card-border shadow-red-glow">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-surface">
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="relative">
                  <Camera className="w-16 h-16 text-primary mx-auto animate-pulse" />
                  {isCapturing && (
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-card-foreground">
                    {isCapturing ? 'Opening Camera...' : 'Camera Loading'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Capacitor.isNativePlatform() 
                      ? 'Using native camera for best quality' 
                      : 'Using web camera'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            <Button
              onClick={takePicture}
              disabled={isCapturing || isLoading}
              size="lg"
              className="bg-gradient-hero hover:opacity-90 text-white font-semibold shadow-glow pulse-red"
            >
              <Camera className="w-5 h-5 mr-2" />
              {isCapturing ? 'Opening...' : 'Take Photo'}
            </Button>
          </div>

          <Button
            onClick={onClose}
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