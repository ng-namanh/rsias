import { create } from 'zustand';

interface IntelligenceState {
  heatmapData: Record<string, number>;
  selectedCategory: string | null;
  selectedSymbol: string | null;
  
  setHeatmapData: (data: Record<string, number>) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedSymbol: (symbol: string | null) => void;
}

export const useIntelligenceStore = create<IntelligenceState>((set) => ({
  heatmapData: {},
  selectedCategory: null,
  selectedSymbol: null,

  setHeatmapData: (data) => set({ heatmapData: data }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
}));
