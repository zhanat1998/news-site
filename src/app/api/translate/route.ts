import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Тил аттары
const languageNames: Record<string, string> = {
  ky: 'Kyrgyz',
  ru: 'Russian',
  en: 'English',
  tr: 'Turkish'
};

// OpenAI менен которуу
async function translateWithOpenAI(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text from ${languageNames[sourceLang]} to ${languageNames[targetLang]}.
          Keep the same tone and style. Only return the translated text, nothing else.
          If the text contains proper nouns or names, keep them as is or transliterate appropriately.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Демо которуу (API ключу жок болсо)
function mockTranslate(text: string, targetLang: string): string {
  // Демо режимде тил белгисин кошуу
  const langLabels: Record<string, string> = {
    ru: '🇷🇺',
    en: '🇬🇧',
    tr: '🇹🇷'
  };

  const label = langLabels[targetLang] || '';

  // Кыска демо котормо (чыныгы котормо эмес, жөн гана демонстрация)
  // OpenAI ключун кошкондо чыныгы котормо болот
  return `${label} [${targetLang.toUpperCase()}] ${text}`;
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang = 'ky' } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'text and targetLang are required' },
        { status: 400 }
      );
    }

    // Эгер оригинал тилде болсо
    if (targetLang === sourceLang) {
      return NextResponse.json({ translatedText: text });
    }

    let translatedText: string;

    // OpenAI ключу бар болсо - чыныгы котормо
    if (OPENAI_API_KEY) {
      translatedText = await translateWithOpenAI(text, targetLang, sourceLang);
    } else {
      // Демо режим - ключ жок
      translatedText = mockTranslate(text, targetLang);
      console.log('⚠️ DEMO MODE: Add OPENAI_API_KEY to .env.local for real translations');
    }

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}