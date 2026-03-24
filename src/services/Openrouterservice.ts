import axios, { AxiosInstance } from 'axios';

interface OpenRouterMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface OpenRouterRequest {
    model: string;
    messages: OpenRouterMessage[];
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
}

interface OpenRouterResponse {
    id: string;
    model: string;
    choices: Array<{
        message: OpenRouterMessage;
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export class OpenRouterService {
    private client: AxiosInstance;
    private apiKey: string;
    private baseURL = 'https://openrouter.ai/api/v1';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
    }

    async chat(request: OpenRouterRequest): Promise<OpenRouterResponse> {
        try {
            const response = await this.client.post<OpenRouterResponse>('/chat/completions', request);
            return response.data;
        } catch (error) {
            throw new Error(`OpenRouter API error: ${error}`);
        }
    }

    async getModels(): Promise<any> {
        try {
            const response = await this.client.get('/models');
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch models: ${error}`);
        }
    }
}