import { ChatMessage } from './openai';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateGroqChatCompletion(
  messages: ChatMessage[],
  model: string = 'llama3-8b-8192',
  temperature: number = 0.7
): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating GROQ chat completion:', error);
    throw error;
  }
}
