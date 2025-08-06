import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { chatWithAI } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, topic, difficulty, questionCount, selectedField } = body;

    switch (action) {
      case 'generate-quiz':
        return await generateQuiz(topic, difficulty, questionCount, selectedField);
      case 'generate-flashcards':
        return await generateFlashcards(topic, selectedField);
      case 'check-answer':
        return await checkAnswer(body.question, body.userAnswer, body.correctAnswer);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateQuiz(topic: string, difficulty: string, questionCount: number, selectedField: string) {
  try {
    const prompt = `
    ${selectedField} alanında ${topic} konusu için ${difficulty} seviyesinde ${questionCount} adet çoktan seçmeli soru oluştur.
    
    Her soru için:
    - Soru metni
    - 4 seçenek (A, B, C, D)
    - Doğru cevap
    - Açıklama
    
    JSON formatında döndür:
    {
      "quiz": {
        "title": "Quiz Başlığı",
        "topic": "${topic}",
        "difficulty": "${difficulty}",
        "questions": [
          {
            "id": 1,
            "question": "Soru metni",
            "options": {
              "A": "Seçenek A",
              "B": "Seçenek B", 
              "C": "Seçenek C",
              "D": "Seçenek D"
            },
            "correctAnswer": "A",
            "explanation": "Açıklama"
          }
        ]
      }
    }
    `;

    const aiResponse = await chatWithAI(prompt, 'education');
    
    let quizData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    } catch (parseError) {
      console.error('Quiz JSON parse error:', parseError);
      return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      quiz: quizData.quiz
    });

  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}

async function generateFlashcards(topic: string, selectedField: string) {
  try {
    const prompt = `
    ${selectedField} alanında ${topic} konusu için 10 adet flashcard oluştur.
    
    Her flashcard için:
    - Ön yüz: Soru/Kavram
    - Arka yüz: Cevap/Açıklama
    - Kategori: Konu kategorisi
    
    JSON formatında döndür:
    {
      "flashcards": [
        {
          "id": 1,
          "front": "Ön yüz metni",
          "back": "Arka yüz metni",
          "category": "Kategori"
        }
      ]
    }
    `;

    const aiResponse = await chatWithAI(prompt, 'education');
    
    let flashcardData;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        flashcardData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    } catch (parseError) {
      console.error('Flashcard JSON parse error:', parseError);
      return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      flashcards: flashcardData.flashcards
    });

  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
  }
}

async function checkAnswer(question: string, userAnswer: string, correctAnswer: string) {
  try {
    const prompt = `
    Soru: ${question}
    Kullanıcının cevabı: ${userAnswer}
    Doğru cevap: ${correctAnswer}
    
    Kullanıcının cevabını değerlendir ve şu bilgileri ver:
    - Doğru mu? (true/false)
    - Puan (0-100)
    - Geri bildirim mesajı
    - İyileştirme önerisi
    
    JSON formatında döndür:
    {
      "isCorrect": true,
      "score": 85,
      "feedback": "Geri bildirim mesajı",
      "suggestion": "İyileştirme önerisi"
    }
    `;

    const aiResponse = await chatWithAI(prompt, 'education');
    
    let result;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    } catch (parseError) {
      console.error('Answer check JSON parse error:', parseError);
      return NextResponse.json({ error: 'Failed to check answer' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('Error checking answer:', error);
    return NextResponse.json({ error: 'Failed to check answer' }, { status: 500 });
  }
} 