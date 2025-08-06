import React from 'react';
import { AlertCircle } from 'lucide-react';

interface GeneratedContentDisplayProps {
  content: any;
}

const GeneratedContentDisplay: React.FC<GeneratedContentDisplayProps> = ({ content }) => {
  return (
    <div className="max-h-96 overflow-y-auto space-y-4">
      {/* Quiz Display */}
      {content.quiz && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-white mb-1">
              {content.quiz.title}
            </h4>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
              <span>📊 Seviye: {content.quiz.difficulty}</span>
              <span>❓ {content.quiz.questions?.length || 0} Soru</span>
            </div>
          </div>
          
          {content.quiz.questions?.map((question: any, index: number) => (
            <div key={index} className="bg-black/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-white font-medium">{question.question}</p>
              </div>
              
              <div className="ml-9 space-y-2">
                {question.options?.map((option: string, optIndex: number) => (
                  <div key={optIndex} className={`p-2 rounded border ${
                    option.startsWith(question.correct) 
                      ? 'border-green-500 bg-green-500/20 text-green-300' 
                      : 'border-gray-600 bg-gray-800/50 text-gray-300'
                  }`}>
                    {option}
                  </div>
                ))}
                
                {question.explanation && (
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm text-blue-300">
                    <span className="font-medium">💡 Açıklama: </span>
                    {question.explanation}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Roadmap Display */}
      {content.roadmap && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-white mb-1">
              {content.roadmap.title}
            </h4>
            <div className="text-sm text-gray-300">
              ⏱️ Süre: {content.roadmap.duration}
            </div>
          </div>
          
          {content.roadmap.phases?.map((phase: any, index: number) => (
            <div key={index} className="bg-black/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {phase.phase}
                </div>
                <div>
                  <h5 className="text-white font-medium">{phase.title}</h5>
                  <p className="text-sm text-gray-400">⏱️ {phase.duration}</p>
                </div>
              </div>
              
              <div className="ml-11 space-y-2">
                {phase.topics && (
                  <div>
                    <span className="text-sm text-gray-300 font-medium">📚 Konular: </span>
                    <span className="text-sm text-green-300">{phase.topics.join(', ')}</span>
                  </div>
                )}
                {phase.projects && (
                  <div>
                    <span className="text-sm text-gray-300 font-medium">🚀 Projeler: </span>
                    <span className="text-sm text-blue-300">{phase.projects.join(', ')}</span>
                  </div>
                )}
                {phase.skills && (
                  <div>
                    <span className="text-sm text-gray-300 font-medium">💪 Beceriler: </span>
                    <span className="text-sm text-purple-300">{phase.skills.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {content.roadmap.personalizedTips && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h5 className="text-yellow-400 font-medium mb-2">💡 Kişiselleştirilmiş İpuçları</h5>
              <ul className="space-y-1">
                {content.roadmap.personalizedTips.map((tip: string, index: number) => (
                  <li key={index} className="text-sm text-yellow-300 list-disc ml-4">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Projects Display */}
      {content.projects && (
        <div className="space-y-4">
          {content.projects.map((project: any, index: number) => (
            <div key={index} className="bg-black/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-start justify-between mb-3">
                <h5 className="text-white font-medium">{project.title}</h5>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  project.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                  project.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {project.difficulty}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mb-3">{project.description}</p>
              
              <div className="space-y-2 text-sm">
                {project.technologies && (
                  <div>
                    <span className="text-gray-400">🔧 Teknolojiler: </span>
                    <span className="text-blue-300">{project.technologies.join(', ')}</span>
                  </div>
                )}
                {project.duration && (
                  <div>
                    <span className="text-gray-400">⏱️ Süre: </span>
                    <span className="text-green-300">{project.duration}</span>
                  </div>
                )}
                {project.learningGoals && (
                  <div>
                    <span className="text-gray-400">🎯 Hedefler: </span>
                    <span className="text-purple-300">{project.learningGoals.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Interview Questions Display */}
      {content.interview && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-white mb-1">
              🎤 {content.interview.category} Mülakat Soruları
            </h4>
            <div className="text-sm text-gray-300">
              📊 Seviye: {content.interview.level}
            </div>
          </div>
          
          {content.interview.questions?.map((q: any, index: number) => (
            <div key={index} className="bg-black/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium mb-2">{q.question}</p>
                  {q.expectedAnswer && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded p-3 mb-2">
                      <span className="text-green-400 text-sm font-medium">✅ Örnek Cevap: </span>
                      <p className="text-green-300 text-sm">{q.expectedAnswer}</p>
                    </div>
                  )}
                  {q.tips && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                      <span className="text-yellow-400 text-sm font-medium">💡 İpucu: </span>
                      <span className="text-yellow-300 text-sm">{q.tips}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {content.interview.behavioralQuestions && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h5 className="text-purple-400 font-medium mb-2">🧠 Davranışsal Sorular</h5>
              <ul className="space-y-1">
                {content.interview.behavioralQuestions.map((question: string, index: number) => (
                  <li key={index} className="text-sm text-purple-300 list-disc ml-4">
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Fallback for other content types */}
      {!content.quiz && !content.roadmap && !content.projects && !content.interview && (
        <div className="bg-black/20 rounded-lg p-4 border border-green-500/30">
          {content.message ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Bilgi</span>
              </div>
              <p className="text-gray-300">{content.message}</p>
              {content.suggestion && (
                <p className="text-sm text-gray-400 italic">{content.suggestion}</p>
              )}
            </div>
          ) : (
            <pre className="text-sm text-green-300 whitespace-pre-wrap">
              {JSON.stringify(content, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default GeneratedContentDisplay;