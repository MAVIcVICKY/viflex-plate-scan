import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface FoodResultsProps {
  data: AnalysisResponse;
}

const MacroCard: React.FC<{ 
  label: string; 
  value: number; 
  color: string; 
  icon: string;
}> = ({ label, value, color, icon }) => (
  <Card className="p-4 bg-gradient-card border-card-border shadow-sm">
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold shadow-sm`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xl font-bold text-card-foreground">
          {value}g
        </p>
      </div>
    </div>
  </Card>
);

const FoodItemCard: React.FC<{ item: FoodItem }> = ({ item }) => (
  <Card className="p-4 bg-gradient-card border-card-border hover:shadow-md transition-all duration-300 ease-smooth">
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-card-foreground">{item.name}</h4>
          <p className="text-sm text-muted-foreground">{item.quantity}</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          {item.calories} kcal
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Protein</p>
          <p className="font-semibold text-card-foreground">{item.protein}g</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Carbs</p>
          <p className="font-semibold text-card-foreground">{item.carbs}g</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Fat</p>
          <p className="font-semibold text-card-foreground">{item.fat}g</p>
        </div>
      </div>
    </div>
  </Card>
);

export const FoodResults: React.FC<FoodResultsProps> = ({ data }) => {
  const { total, food } = data.output;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Total Summary */}
      <Card className="p-6 bg-gradient-hero border-primary shadow-lg">
        <div className="text-center text-white">
          <h3 className="text-lg font-semibold mb-2">Total Nutrition</h3>
          <div className="text-4xl font-bold mb-2">
            {total.calories}
          </div>
          <p className="text-primary-foreground/80 text-sm">kcal</p>
        </div>
      </Card>

      {/* Macro Summary */}
      <div className="grid grid-cols-3 gap-3">
        <MacroCard
          label="Protein"
          value={total.protein}
          color="bg-protein"
          icon="P"
        />
        <MacroCard
          label="Carbs"
          value={total.carbs}
          color="bg-carbs"
          icon="C"
        />
        <MacroCard
          label="Fat"
          value={total.fat}
          color="bg-fat"
          icon="F"
        />
      </div>

      {/* Macro Distribution Bar */}
      <Card className="p-4 bg-gradient-card border-card-border">
        <h4 className="text-sm font-semibold text-card-foreground mb-3 text-center">
          Macro Distribution
        </h4>
        <div className="flex h-3 rounded-full overflow-hidden bg-muted">
          <div 
            className="bg-protein transition-all duration-500 ease-smooth" 
            style={{ width: `${(total.protein * 4 / total.calories * 100)}%` }}
          />
          <div 
            className="bg-carbs transition-all duration-500 ease-smooth" 
            style={{ width: `${(total.carbs * 4 / total.calories * 100)}%` }}
          />
          <div 
            className="bg-fat transition-all duration-500 ease-smooth" 
            style={{ width: `${(total.fat * 9 / total.calories * 100)}%` }}
          />
        </div>
      </Card>

      {/* Individual Food Items */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-card-foreground text-center">
          Food Breakdown
        </h3>
        <div className="space-y-3">
          {food.map((item, index) => (
            <FoodItemCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};