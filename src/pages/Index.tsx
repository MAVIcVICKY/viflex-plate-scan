import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { FoodResults } from '@/components/FoodResults';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AlertTriangle, Utensils } from 'lucide-react';

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AnalysisResponse {
  output: {
    status: string;
    food: FoodItem[];
    total: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setResults(null);
    setError(null);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setResults(null);
    setError(null);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('http://localhost:5678/webhook-test/Meal AI', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze meal');
      }

      const responseData = await response.json();
      const data: AnalysisResponse = Array.isArray(responseData) ? responseData[0] : responseData;
      setResults(data);
      
      toast({
        title: "Analysis Complete!",
        description: "Your meal has been successfully analyzed.",
      });
    } catch (err) {
      const errorMessage = 'Failed to analyze meal. Please try again.';
      setError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-6 bg-gradient-hero rounded-3xl shadow-red-glow pulse-red">
              <Utensils className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-6 tracking-tight">
            Viflex Calories
          </h1>
          
          <p className="text-2xl text-foreground font-bold mb-2">
            Snap a Meal. See the Macros.
          </p>
          
          <p className="text-base text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
            Revolutionary AI-powered nutrition analysis. Upload or capture any meal photo 
            and get instant macro breakdown with stunning accuracy.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Image Upload */}
          <ImageUpload
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            onRemoveImage={handleRemoveImage}
            isLoading={isLoading}
          />

          {/* Analyze Button */}
          {selectedImage && (
            <div className="text-center">
              <Button
                onClick={analyzeImage}
                disabled={isLoading || !selectedImage}
                size="lg"
                className="w-full max-w-md bg-gradient-hero hover:opacity-90 text-white font-bold py-6 px-10 text-xl shadow-red-glow hover:shadow-lg transition-all duration-300 ease-smooth pulse-red"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Meal 🔥'}
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <LoadingSpinner />}

          {/* Error Message */}
          {error && (
            <Card className="p-6 border-destructive/20 bg-destructive/5">
              <div className="flex items-center space-x-3 text-destructive">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Analysis Error</h3>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Results */}
          {results && !isLoading && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-card-foreground mb-2">
                  Nutrition Analysis
                </h2>
                <p className="text-muted-foreground">
                  Here's what we found in your meal
                </p>
              </div>
              <FoodResults data={results} />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold text-primary">Viflex AI Nutrition</span> • Privacy First
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
