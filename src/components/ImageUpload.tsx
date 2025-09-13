import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CameraCapture } from './CameraCapture';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onRemoveImage: () => void;
  isLoading?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  onRemoveImage,
  isLoading = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile && imageFile.size <= 10 * 1024 * 1024) {
      onImageSelect(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      onImageSelect(file);
    }
  };

  const openFileDialog = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleCameraCapture = (file: File) => {
    onImageSelect(file);
    setShowCamera(false);
  };

  if (selectedImage) {
    return (
      <Card className="relative w-full max-w-md mx-auto bg-gradient-card border-card-border shadow-glow">
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected meal"
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={onRemoveImage}
          disabled={isLoading}
          className="absolute top-2 right-2 bg-surface/90 hover:bg-surface shadow-sm"
        >
          <X className="w-4 h-4" />
        </Button>
      </Card>
    );
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Upload Options */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            className={`
              relative p-6 bg-gradient-card border-2 border-dashed 
              cursor-pointer transition-all duration-300 ease-smooth
              ${isDragOver 
                ? 'border-primary bg-accent/50 shadow-red-glow' 
                : 'border-border hover:border-primary/60 hover:bg-accent/30 hover:shadow-glow'
              }
              ${isLoading ? 'pointer-events-none opacity-60' : ''}
            `}
            onClick={openFileDialog}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />
            
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-primary/20 rounded-full">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-card-foreground">
                  Upload Photo
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  From gallery
                </p>
              </div>
            </div>
          </Card>

          <Card
            className={`
              relative p-6 bg-gradient-card border-2 border-dashed 
              cursor-pointer transition-all duration-300 ease-smooth
              border-border hover:border-primary/60 hover:bg-accent/30 hover:shadow-glow
              ${isLoading ? 'pointer-events-none opacity-60' : ''}
            `}
            onClick={() => setShowCamera(true)}
          >
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-card-foreground">
                  Take Photo
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Use camera
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Drop Zone */}
        <Card
          className={`
            relative p-8 bg-gradient-card border-2 border-dashed 
            cursor-pointer transition-all duration-300 ease-smooth
            ${isDragOver 
              ? 'border-primary bg-accent/50 shadow-red-glow' 
              : 'border-border hover:border-primary/60 hover:bg-accent/30'
            }
            ${isLoading ? 'pointer-events-none opacity-60' : ''}
          `}
          onClick={openFileDialog}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-card-foreground">
                {isDragOver ? 'Drop your meal photo' : 'Or drag & drop here'}
              </h3>
              <p className="text-sm text-muted-foreground">
                JPG, PNG up to 10MB
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onImageCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
          isLoading={isLoading}
        />
      )}
    </>
  );
};