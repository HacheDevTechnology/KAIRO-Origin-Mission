
export enum AppStep {
  X_MIRROR = 'X_MIRROR',
  Y_SAMPLES_LOADING = 'Y_SAMPLES_LOADING',
  Y_SELECTION = 'Y_SELECTION',
  P_GENERATING = 'P_GENERATING',
  P_RESULT = 'P_RESULT'
}

export interface EnvironmentSample {
  id: string;
  imageUrl: string;
  vibeDescription: string;
  category: 'Futurista' | 'Clásico' | 'Energético';
}

export interface PhysiognomyData {
  description: string;
  imageUrl?: string;
}

export interface WorldCard {
  id: string;
  name: string;
  image: string;
  promptVibe: string;
  category: 'Futurista' | 'Clásico' | 'Energético';
}
