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
  <Card className="p-6 bg-gradient-card border-card-border shadow-sm hover:shadow-md transition-all duration-300 ease-smooth">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white font-bold shadow-sm text-lg`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-card-foreground">
            {value}g
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-card-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {value * (label === 'Fat' ? 9 : 4)} calories from {label.toLowerCase()}
        </p>
      </div>
    </div>
  </Card>
);

const FoodItemCard: React.FC<{ item: FoodItem }> = ({ item }) => (
  <Card className="p-6 bg-gradient-card border-card-border hover:shadow-md transition-all duration-300 ease-smooth hover:scale-[1.02]">
    <div className="space-y-4">
      {/* Header with name and calories */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-card-foreground">{item.name}</h4>
          <p className="text-sm font-medium text-muted-foreground mt-1">{item.quantity}</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-lg px-3 py-1">
          {item.calories} kcal
        </Badge>
      </div>
      
      {/* Detailed nutritional breakdown */}
      <div className="space-y-3">
        {/* Macro nutrients */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-protein/10 rounded-lg border border-protein/20">
            <p className="text-xs font-medium text-protein uppercase tracking-wide">Protein</p>
            <p className="text-xl font-bold text-card-foreground">{item.protein}g</p>
            <p className="text-xs text-muted-foreground">{item.protein * 4} kcal</p>
          </div>
          <div className="text-center p-3 bg-carbs/10 rounded-lg border border-carbs/20">
            <p className="text-xs font-medium text-carbs uppercase tracking-wide">Carbs</p>
            <p className="text-xl font-bold text-card-foreground">{item.carbs}g</p>
            <p className="text-xs text-muted-foreground">{item.carbs * 4} kcal</p>
          </div>
          <div className="text-center p-3 bg-fat/10 rounded-lg border border-fat/20">
            <p className="text-xs font-medium text-fat uppercase tracking-wide">Fat</p>
            <p className="text-xl font-bold text-card-foreground">{item.fat}g</p>
            <p className="text-xs text-muted-foreground">{item.fat * 9} kcal</p>
          </div>
        </div>

        {/* Percentage breakdown for this item */}
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2 text-center">Caloric Distribution</p>
          <div className="flex h-4 rounded-full overflow-hidden bg-muted">
            <div 
              className="bg-protein transition-all duration-700 ease-smooth" 
              style={{ width: `${(item.protein * 4 / item.calories * 100)}%` }}
              title={`Protein: ${Math.round((item.protein * 4 / item.calories) * 100)}%`}
            />
            <div 
              className="bg-carbs transition-all duration-700 ease-smooth" 
              style={{ width: `${(item.carbs * 4 / item.calories * 100)}%` }}
              title={`Carbs: ${Math.round((item.carbs * 4 / item.calories) * 100)}%`}
            />
            <div 
              className="bg-fat transition-all duration-700 ease-smooth" 
              style={{ width: `${(item.fat * 9 / item.calories * 100)}%` }}
              title={`Fat: ${Math.round((item.fat * 9 / item.calories) * 100)}%`}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>P: {Math.round((item.protein * 4 / item.calories) * 100)}%</span>
            <span>C: {Math.round((item.carbs * 4 / item.calories) * 100)}%</span>
            <span>F: {Math.round((item.fat * 9 / item.calories) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

export const FoodResults: React.FC<FoodResultsProps> = ({ data }) => {
  const { total, food, status } = data.output;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* API Response Status */}
      <Card className="p-4 bg-gradient-card border-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-card-foreground">API Status</span>
          </div>
          <span className="text-sm text-green-600 font-semibold capitalize">{status}</span>
        </div>
      </Card>

      {/* Total Summary - Enhanced */}
      <Card className="p-8 bg-gradient-hero border-primary shadow-red-glow">
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Complete Nutrition Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-4xl font-bold">{total.calories}</div>
              <p className="text-primary-foreground/80 text-sm font-medium">Total Calories</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-protein">{total.protein}g</div>
              <p className="text-primary-foreground/80 text-sm font-medium">Protein</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-carbs">{total.carbs}g</div>
              <p className="text-primary-foreground/80 text-sm font-medium">Carbohydrates</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-fat">{total.fat}g</div>
              <p className="text-primary-foreground/80 text-sm font-medium">Fat</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Macro Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Macro Percentages */}
      <Card className="p-6 bg-gradient-card border-card-border">
        <h4 className="text-lg font-bold text-card-foreground mb-4 text-center">
          Caloric Distribution
        </h4>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-protein">
              {Math.round((total.protein * 4 / total.calories) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground">Protein</p>
            <p className="text-xs text-muted-foreground">{total.protein * 4} kcal</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-carbs">
              {Math.round((total.carbs * 4 / total.calories) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground">Carbs</p>
            <p className="text-xs text-muted-foreground">{total.carbs * 4} kcal</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-fat">
              {Math.round((total.fat * 9 / total.calories) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground">Fat</p>
            <p className="text-xs text-muted-foreground">{total.fat * 9} kcal</p>
          </div>
        </div>

        {/* Visual Distribution Bar */}
        <div className="flex h-6 rounded-full overflow-hidden bg-muted shadow-inner">
          <div 
            className="bg-protein transition-all duration-1000 ease-smooth flex items-center justify-center text-xs font-bold text-white" 
            style={{ width: `${(total.protein * 4 / total.calories * 100)}%` }}
          >
            P
          </div>
          <div 
            className="bg-carbs transition-all duration-1000 ease-smooth flex items-center justify-center text-xs font-bold text-white" 
            style={{ width: `${(total.carbs * 4 / total.calories * 100)}%` }}
          >
            C
          </div>
          <div 
            className="bg-fat transition-all duration-1000 ease-smooth flex items-center justify-center text-xs font-bold text-white" 
            style={{ width: `${(total.fat * 9 / total.calories * 100)}%` }}
          >
            F
          </div>
        </div>
      </Card>

      {/* Comprehensive Food Analysis */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-card-foreground mb-2">
            Detailed Food Analysis
          </h3>
          <p className="text-muted-foreground">
            {food.length} food item{food.length !== 1 ? 's' : ''} identified • Complete nutritional breakdown
          </p>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {food.map((item, index) => (
            <FoodItemCard key={index} item={item} />
          ))}
        </div>

        {/* Summary Statistics */}
        <Card className="p-6 bg-gradient-card border-card-border">
          <h4 className="text-lg font-semibold text-card-foreground mb-4 text-center">
            Meal Statistics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{food.length}</div>
              <p className="text-xs text-muted-foreground">Food Items</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-protein">
                {Math.round(total.calories / total.protein * 100) / 100}
              </div>
              <p className="text-xs text-muted-foreground">Cal/g Protein</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-carbs">
                {Math.round((total.protein / total.carbs) * 100) / 100 || 0}
              </div>
              <p className="text-xs text-muted-foreground">P:C Ratio</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-fat">
                {Math.round((total.protein / total.fat) * 100) / 100 || 0}
              </div>
              <p className="text-xs text-muted-foreground">P:F Ratio</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};