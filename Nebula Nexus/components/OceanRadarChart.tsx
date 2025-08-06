'use client';

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale
);

interface OceanScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

interface OceanRadarChartProps {
  scores: OceanScores;
  className?: string;
}

export default function OceanRadarChart({ scores, className = '' }: OceanRadarChartProps) {
  const data = {
    labels: [
      'Açıklık (Openness)',
      'Sorumluluk (Conscientiousness)', 
      'Dışadönüklük (Extraversion)',
      'Uyumluluk (Agreeableness)',
      'Duygusal Denge (Neuroticism)'
    ],
    datasets: [
      {
        label: 'OCEAN Skorlarınız',
        data: [
          scores.openness,
          scores.conscientiousness,
          scores.extraversion,
          scores.agreeableness,
          scores.neuroticism
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Ortalama',
        data: [50, 50, 50, 50, 50],
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderColor: 'rgba(156, 163, 175, 0.5)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
                 ticks: {
           stepSize: 20,
           color: 'rgba(156, 163, 175, 0.8)',
           font: {
             size: 12,
             weight: 'normal' as const,
           },
         },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        angleLines: {
          color: 'rgba(156, 163, 175, 0.3)',
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 600 as number, // Convert string to number
          },
          color: 'rgba(156, 163, 175, 0.9)',
          padding: 20,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
            weight: 500 as number, // Convert string to number
          },
          color: '#9CA3AF',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.r;
            return `${label}: ${value}/100`;
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  // Kişilik tipi analizi
  const getPersonalityType = () => {
    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = scores;
    
    let type = '';
    let description = '';
    
    if (openness > 70 && conscientiousness > 70) {
      type = 'Yaratıcı Mükemmeliyetçi';
      description = 'Yenilikçi fikirler üretir ve bunları sistematik şekilde uygular.';
    } else if (extraversion > 70 && agreeableness > 70) {
      type = 'Sosyal Lider';
      description = 'İnsanlarla iyi iletişim kurar ve takım çalışmasında başarılıdır.';
    } else if (conscientiousness > 70 && neuroticism < 30) {
      type = 'Güvenilir Uzman';
      description = 'Detaylara önem verir ve stres altında bile performans gösterir.';
    } else if (openness > 70 && extraversion > 70) {
      type = 'Yenilikçi Maceracı';
      description = 'Yeni deneyimler arar ve yaratıcı çözümler üretir.';
    } else if (agreeableness > 70 && neuroticism < 30) {
      type = 'Dengeli İşbirlikçi';
      description = 'Çevresiyle uyumlu çalışır ve sakin bir yaklaşım sergiler.';
    } else {
      type = 'Benzersiz Profil';
      description = 'Kendine özgü bir kişilik profiline sahipsiniz.';
    }
    
    return { type, description };
  };

  const personalityInfo = getPersonalityType();

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">OCEAN Kişilik Analizi</h3>
        <p className="text-gray-600">5 faktör kişilik modeline göre analiz sonuçlarınız</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="h-96">
          <Radar data={data} options={options} />
        </div>

        {/* Kişilik Analizi */}
        <div className="space-y-6">
          {/* Kişilik Tipi */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Kişilik Tipiniz: {personalityInfo.type}
            </h4>
            <p className="text-gray-700">{personalityInfo.description}</p>
          </div>

          {/* Faktör Açıklamaları */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Faktör Açıklamaları</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">Açıklık</span>
                  <p className="text-sm text-gray-600">Yenilikçilik ve deneyim açıklığı</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  scores.openness > 70 ? 'bg-green-100 text-green-800' :
                  scores.openness > 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {scores.openness}/100
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">Sorumluluk</span>
                  <p className="text-sm text-gray-600">Disiplin ve hedef odaklılık</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  scores.conscientiousness > 70 ? 'bg-green-100 text-green-800' :
                  scores.conscientiousness > 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {scores.conscientiousness}/100
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">Dışadönüklük</span>
                  <p className="text-sm text-gray-600">Sosyallik ve enerji seviyesi</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  scores.extraversion > 70 ? 'bg-green-100 text-green-800' :
                  scores.extraversion > 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {scores.extraversion}/100
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">Uyumluluk</span>
                  <p className="text-sm text-gray-600">İşbirliği ve güven</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  scores.agreeableness > 70 ? 'bg-green-100 text-green-800' :
                  scores.agreeableness > 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {scores.agreeableness}/100
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">Duygusal Denge</span>
                  <p className="text-sm text-gray-600">Stres yönetimi ve sakinlik</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  scores.neuroticism < 30 ? 'bg-green-100 text-green-800' :
                  scores.neuroticism < 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {scores.neuroticism}/100
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 