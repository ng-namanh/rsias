import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface HeatmapProps {
  data: Record<string, number>;
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

const categories = [
  'Macro', 'Geopolitical', 'Sector-Specific', 
  'Earnings/Corporate', 'Legal/Regulatory', 'Innovation/Tech'
];

const Heatmap: React.FC<HeatmapProps> = ({ data, onCategorySelect, selectedCategory }) => {
  const maxCount = Math.max(...Object.values(data), 1);

  return (
    <Card className="p-0 overflow-hidden shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
        <CardTitle className="text-primary font-mono text-xs uppercase">Global_Intelligence_Heatmap</CardTitle>
        <div className="text-[10px] text-muted-foreground font-mono uppercase">Scale: Intensity_by_Volume</div>
      </CardHeader>

      <CardContent className="p-6 pt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = data[cat] || 0;
          const intensity = count / maxCount;
          const isSelected = selectedCategory === cat;

          return (
            <div 
              key={cat}
              onClick={() => onCategorySelect(isSelected ? null : cat)}
              className={`
                cursor-pointer p-4 rounded-lg border transition-all duration-300
                ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                bg-muted/30 flex flex-col items-center justify-center text-center
              `}
            >
              <div 
                className="w-12 h-12 rounded-full mb-3 flex items-center justify-center font-bold text-xs bg-primary text-primary-foreground"
                style={{ 
                  opacity: 0.2 + intensity * 0.8,
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {count}
              </div>
              <div className={`text-[10px] font-mono uppercase tracking-tighter ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                {cat}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default Heatmap;
