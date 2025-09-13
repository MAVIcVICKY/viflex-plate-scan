import React, { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  if (selectedImage) {
    return (
      <Card className="relative w-full max-w-md mx-auto bg-gradient-card border-card-border shadow-md">
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
    <Card
      className={`
        relative w-full max-w-md mx-auto p-8 
        bg-gradient-card border-2 border-dashed 
        cursor-pointer transition-all duration-300 ease-smooth
        ${isDragOver 
          ? 'border-primary bg-accent/50 shadow-glow' 
          : 'border-border hover:border-primary/60 hover:bg-accent/30'
        }
        ${isLoading ? 'pointer-events-none opacity-60' : ''}
      `}
      onClick={handleClick}
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
      
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            {isDragOver ? (
              <Camera className="w-8 h-8 text-primary animate-pulse" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-card-foreground">
            {isDragOver ? 'Drop your meal photo' : 'Upload meal photo'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag & drop or tap to select
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG up to 10MB
          </p>
        </div>
      </div>
    </Card>
  );
};