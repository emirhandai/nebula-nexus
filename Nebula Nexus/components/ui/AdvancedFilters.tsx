'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  Calendar, 
  Tag, 
  Star, 
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Sliders,
  RefreshCw
} from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'search';
  options?: FilterOption[];
  value?: any;
  placeholder?: string;
}

export interface FilterState {
  [key: string]: any;
}

interface AdvancedFiltersProps {
  filters: FilterGroup[];
  onFiltersChange: (filters: FilterState) => void;
  onReset?: () => void;
  className?: string;
}

export default function AdvancedFilters({ 
  filters, 
  onFiltersChange, 
  onReset,
  className = '' 
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({});
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (filterId: string, value: any) => {
    const newState = { ...filterState, [filterId]: value };
    setFilterState(newState);
    
    // Active filters'i güncelle
    const newActiveFilters = Object.entries(newState)
      .filter(([_, val]) => {
        if (Array.isArray(val)) return val.length > 0;
        if (typeof val === 'string') return val.trim() !== '';
        return val !== null && val !== undefined;
      })
      .map(([key]) => key);
    
    setActiveFilters(newActiveFilters);
    onFiltersChange(newState);
  };

  const handleReset = () => {
    setFilterState({});
    setActiveFilters([]);
    onFiltersChange({});
    onReset?.();
  };

  const getActiveFiltersCount = () => {
    return activeFilters.length;
  };

  const renderFilterInput = (filter: FilterGroup) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            value={filterState[filter.id] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">{filter.placeholder || 'Seçiniz'}</option>
            {filter.options?.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label} {option.count && `(${option.count})`}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {filter.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterState[filter.id]?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = filterState[filter.id] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleFilterChange(filter.id, newValues);
                  }}
                  className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">
                  {option.label} {option.count && `(${option.count})`}
                </span>
              </label>
            ))}
          </div>
        );

      case 'search':
        return (
          <input
            type="text"
            value={filterState[filter.id] || ''}
            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            placeholder={filter.placeholder || 'Ara...'}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        );

      case 'date':
        return (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filterState[filter.id]?.start || ''}
              onChange={(e) => {
                const current = filterState[filter.id] || {};
                handleFilterChange(filter.id, { ...current, start: e.target.value });
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="date"
              value={filterState[filter.id]?.end || ''}
              onChange={(e) => {
                const current = filterState[filter.id] || {};
                handleFilterChange(filter.id, { ...current, end: e.target.value });
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filterState[filter.id]?.min || ''}
                onChange={(e) => {
                  const current = filterState[filter.id] || {};
                  handleFilterChange(filter.id, { ...current, min: e.target.value });
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filterState[filter.id]?.max || ''}
                onChange={(e) => {
                  const current = filterState[filter.id] || {};
                  handleFilterChange(filter.id, { ...current, max: e.target.value });
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Filter Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          getActiveFiltersCount() > 0
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            : 'bg-gray-800/50 text-gray-300 hover:text-white border border-gray-700'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filtreler</span>
        {getActiveFiltersCount() > 0 && (
          <span className="w-5 h-5 bg-cyan-500 text-white text-xs rounded-full flex items-center justify-center">
            {getActiveFiltersCount()}
          </span>
        )}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full mt-2 right-0 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl z-50"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filtreler</h3>
                <div className="flex items-center space-x-2">
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={handleReset}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Temizle</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {getActiveFiltersCount() > 0 && (
                <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                  <h4 className="text-sm font-medium text-white mb-2">Aktif Filtreler</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filterId) => {
                      const filter = filters.find(f => f.id === filterId);
                      const value = filterState[filterId];
                      
                      if (!filter) return null;

                      let displayValue = '';
                      if (Array.isArray(value)) {
                        displayValue = value.join(', ');
                      } else if (typeof value === 'object' && value !== null) {
                        displayValue = Object.values(value).filter(v => v).join(' - ');
                      } else {
                        displayValue = String(value);
                      }

                      return (
                        <span
                          key={filterId}
                          className="inline-flex items-center space-x-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full"
                        >
                          <span>{filter.label}: {displayValue}</span>
                          <button
                            onClick={() => handleFilterChange(filterId, null)}
                            className="hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Filter Groups */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filters.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      {filter.label}
                    </label>
                    {renderFilterInput(filter)}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{getActiveFiltersCount()} aktif filtre</span>
                  <button
                    onClick={handleReset}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Tümünü Temizle
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 