import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  // Remove the Content-Type header - let the browser set it automatically for FormData
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chartData?: string;
  toolType?: string;
  statistics?: any;
  chartMetadata?: any;
}

export interface ChatResponse {
  type: string;
  message: string;
  tool_result?: any;
  tool_type?: string;
}

export const chatAPI = {
  sendMessage: async (
    message: string,
    chatHistory: ChatMessage[],
    persona: string = 'Novice Guide',
    recipientEmail?: string,
    csvContext?: string
  ): Promise<ChatResponse> => {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('chat_history', JSON.stringify(chatHistory));
    formData.append('persona', persona);
    if (recipientEmail) formData.append('recipient_email', recipientEmail);
    if (csvContext) formData.append('csv_context', csvContext);

    const response = await api.post('/api/chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // ✅ Explicitly set for FormData
      },
    });
    return response.data;
  },

  uploadPDF: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload/pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadCSV: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/upload/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Remove the duplicate functions below - use chatAPI.sendMessage instead