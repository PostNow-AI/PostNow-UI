import { useState, useCallback, useEffect } from 'react';

export interface EditableSlideStructure {
  sequence_order: number;
  title: string;
  content: string;
  slide_type?: string;
}

export interface EditableSlideText {
  sequence: number;
  title: string;
  body: string;
  swipe_cta?: string;
  visual_emphasis?: string[];
}

export interface EditablePrompt {
  sequence: number;
  prompt: string;
  visual_elements?: string[];
}

export function useCarouselEdit<T extends Record<string, any>>(
  initialData: T[],
  savedData?: T[] | null
) {
  // Se existir savedData (dados previamente editados), use-os. Senão, use initialData
  const [editedData, setEditedData] = useState<T[]>(savedData || initialData);
  const [hasChanges, setHasChanges] = useState(!!savedData);

  // Atualizar editedData quando initialData mudar (primeira vez)
  useEffect(() => {
    if (!savedData && initialData.length > 0) {
      setEditedData(initialData);
    }
  }, [initialData, savedData]);

  // Se savedData for fornecido posteriormente, aplicar
  useEffect(() => {
    if (savedData && savedData.length > 0) {
      setEditedData(savedData);
      setHasChanges(true);
    }
  }, [savedData]);

  const updateField = useCallback((index: number, field: keyof T, value: any) => {
    setEditedData(prev => {
      const newData = [...prev];
      newData[index] = { ...newData[index], [field]: value };
      return newData;
    });
    setHasChanges(true);
  }, []);

  const resetChanges = useCallback(() => {
    setEditedData(initialData);
    setHasChanges(false);
  }, [initialData]);

  const getAdjustments = useCallback(() => {
    if (!hasChanges) return {};
    
    return editedData.reduce((acc, item, idx) => {
      const original = initialData[idx];
      const changes: Record<string, any> = {};
      
      Object.keys(item).forEach(key => {
        if (item[key] !== original?.[key]) {
          changes[key] = item[key];
        }
      });
      
      if (Object.keys(changes).length > 0) {
        acc[idx] = changes;
      }
      
      return acc;
    }, {} as Record<number, Record<string, any>>);
  }, [editedData, initialData, hasChanges]);

  return {
    editedData,
    hasChanges,
    updateField,
    resetChanges,
    getAdjustments
  };
}

