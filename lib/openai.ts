import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the structure for chat messages
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Function to generate a chat completion
export async function generateChatCompletion(
  messages: ChatMessage[],
  model: string = 'gpt-4o-mini',
  temperature: number = 0.7
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw error;
  }
}

// Function to generate an image
export async function generateImage(
  prompt: string,
  size: '256x256' | '512x512' | '1024x1024' = '512x512',
  n: number = 1
): Promise<string[]> {
  try {
    const response = await openai.images.generate({
      prompt,
      n,
      size,
    });

    return response.data.map(image => image.url || '');
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

// Export the OpenAI instance for direct access if needed
export { openai };