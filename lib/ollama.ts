import axios from 'axios';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export class Ollama {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string = 'http://localhost:11434', model: string = 'llama3.2') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async chat(messages: Message[], stream: boolean = false): Promise<string> {
    try {
      const response = await axios.post<OllamaResponse>(`${this.baseUrl}/api/chat`, {
        model: this.model,
        messages,
        stream,
      });

      return response.data.message.content;
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      throw error;
    }
  }
}

// Example usage:
// const ollama = new Ollama();
// const response = await ollama.chat([{ role: 'user', content: 'Why is the sky blue?' }]);
// console.log(response);
