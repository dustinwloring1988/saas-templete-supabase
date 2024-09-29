import axios from 'axios';

interface Message {
  content: string;
  role: 'system' | 'user' | 'assistant';
}

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
  }[];
}

interface DeepSeekOptions {
  frequency_penalty?: number;
  max_tokens?: number;
  presence_penalty?: number;
  temperature?: number;
  top_p?: number;
}

export class DeepSeek {
  private apiKey: string;
  private baseUrl: string = 'https://api.deepseek.com/chat/completions';

  constructor(apiKey: string = process.env.DEEPSEEK_API_KEY || '') {
    this.apiKey = apiKey;
  }

  async chat(messages: Message[], options: DeepSeekOptions = {}): Promise<string> {
    try {
      const response = await axios.post<DeepSeekResponse>(
        this.baseUrl,
        {
          messages,
          model: 'deepseek-chat',
          frequency_penalty: options.frequency_penalty || 0,
          max_tokens: options.max_tokens || 2048,
          presence_penalty: options.presence_penalty || 0,
          response_format: { type: 'text' },
          stop: null,
          stream: false,
          stream_options: null,
          temperature: options.temperature || 1,
          top_p: options.top_p || 1,
          tools: null,
          tool_choice: 'none',
          logprobs: false,
          top_logprobs: null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      throw error;
    }
  }
}
