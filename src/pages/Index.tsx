import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { FoodResults } from '@/components/FoodResults';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ThreeBackground } from '@/components/ThreeBackground';
import { AlertTriangle, Utensils } from 'lucide-react';

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ApiResponse {
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

      const response = await fetch('http://localhost:5678/webhook/Meal AI', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: ApiResponse = await response.json();
      console.log('Raw API Response:', responseData);
      
      // Extract the actual data from the response structure
      const data: AnalysisResponse = responseData;
      console.log('Final data for display:', data);
      
      setResults(data);
      
      toast({
        title: "Analysis Complete!",
        description: "Your meal has been successfully analyzed.",
      });
    } catch (err) {
      console.error('API Error:', err);
      let errorMessage = 'Failed to analyze meal. Please try again.';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to API. Make sure the webhook server is running on localhost:5678';
      } else if (err instanceof Error) {
        errorMessage = `API Error: ${err.message}`;
      }
      
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
    <div className="min-h-screen bg-gradient-surface relative">
      <ThreeBackground />
      <div className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-8">
            <div className="p-8 bg-gradient-hero rounded-full shadow-red-glow pulse-red hover:scale-110 transition-all duration-500 ease-smooth">
              <Utensils className="w-20 h-20 text-white" />
            </div>
          </div>
          
          <h1 className="text-7xl font-black bg-gradient-hero bg-clip-text text-transparent mb-8 tracking-tight hover:scale-105 transition-transform duration-300 cursor-default">
            Viflex Calories
          </h1>
          
          <p className="text-3xl text-foreground font-bold mb-4 animate-fade-in" style={{animationDelay: '0.3s'}}>
            🍕 Snap a Meal. See the Macros. 🍔
          </p>
          
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.6s'}}>
            Revolutionary AI-powered nutrition analysis with stunning 3D food visualization. 
            Upload or capture any meal photo and get instant macro breakdown with incredible accuracy! 🔥
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

          {/* Test Button */}
          <div className="text-center space-y-4">
            <Button
              onClick={() => {
                const testData: AnalysisResponse = {
                  output: {
                    status: "success",
                    food: [
                      {
                        name: "Hard-boiled egg",
                        quantity: "6 large eggs",
                        calories: 468,
                        protein: 37.8,
                        carbs: 3.6,
                        fat: 31.8
                      }
                    ],
                    total: {
                      calories: 468,
                      protein: 37.8,
                      carbs: 3.6,
                      fat: 31.8
                    }
                  }
                };
                setResults(testData);
                setError(null);
              }}
              size="lg"
              className="w-full max-w-md bg-gradient-hero hover:opacity-90 text-white font-bold py-6 px-10 text-xl shadow-red-glow hover:shadow-lg transition-all duration-300 ease-smooth pulse-red"
            >
              Show Test Data 🥚
            </Button>
          </div>

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
            <div className="space-y-6 relative z-20">
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
        <footer className="text-center mt-16 pt-8 border-t border-border relative z-20">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-semibold text-primary">Viflex AI Nutrition</span> • Privacy First
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
