import React from 'react';
import { Card } from '@/components/ui/card';

interface MacroData {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface MacroResultsProps {
  data: MacroData;
}

const MacroCard: React.FC<{ 
  label: string; 
  value: number; 
  color: string; 
  icon: string;
}> = ({ label, value, color, icon }) => (
  <Card className="p-6 bg-gradient-card border-card-border shadow-sm hover:shadow-md transition-all duration-300 ease-smooth">
    <div className="flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold text-card-foreground">
          {value}g
        </p>
      </div>
    </div>
  </Card>
);

export const MacroResults: React.FC<MacroResultsProps> = ({ data }) => {
  const totalCalories = (data.protein_g * 4) + (data.carbs_g * 4) + (data.fat_g * 9);

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Total Calories Summary */}
      <Card className="p-6 bg-gradient-hero border-primary shadow-lg">
        <div className="text-center text-white">
          <h3 className="text-lg font-semibold mb-2">Total Calories</h3>
          <div className="text-4xl font-bold">
            {Math.round(totalCalories)}
          </div>
          <p className="text-primary-foreground/80 text-sm mt-1">kcal</p>
        </div>
      </Card>

      {/* Individual Macros */}
      <div className="space-y-3">
        <MacroCard
          label="Protein"
          value={data.protein_g}
          color="bg-protein"
          icon="P"
        />
        <MacroCard
          label="Carbohydrates"
          value={data.carbs_g}
          color="bg-carbs"
          icon="C"
        />
        <MacroCard
          label="Fat"
          value={data.fat_g}
          color="bg-fat"
          icon="F"
        />
      </div>

      {/* Macro Distribution */}
      <Card className="p-4 bg-gradient-card border-card-border">
        <h4 className="text-sm font-semibold text-card-foreground mb-3 text-center">
          Macro Distribution
        </h4>
        <div className="flex h-3 rounded-full overflow-hidden bg-muted">
          <div 
            className="bg-protein transition-all duration-500 ease-smooth" 
            style={{ width: `${(data.protein_g * 4 / totalCalories * 100)}%` }}
          />
          <div 
            className="bg-carbs transition-all duration-500 ease-smooth" 
            style={{ width: `${(data.carbs_g * 4 / totalCalories * 100)}%` }}
          />
          <div 
            className="bg-fat transition-all duration-500 ease-smooth" 
            style={{ width: `${(data.fat_g * 9 / totalCalories * 100)}%` }}
          />
        </div>
      </Card>
    </div>
  );
};