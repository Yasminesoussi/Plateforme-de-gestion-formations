import { AfterViewChecked, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked, OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  isChatOpen = false;
  userInput = '';
  isLoading = false;
  apiUrl = 'http://localhost:3000';

  messages: ChatMessage[] = [];
  sessionId: string = '';

  private shouldScroll = false; // Contrôle du scroll automatique

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Récupérer ou générer un sessionId persistant
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
      this.sessionId = storedSessionId;
    } else {
      this.sessionId = this.generateSessionId();
      localStorage.setItem('chatSessionId', this.sessionId);
    }

    this.initializeChat();
  }

  private generateSessionId(): string {
    return 'sess-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private initializeChat(): void {
    const chatHistory = this.getChatHistory();
    if (chatHistory.length > 0) {
      this.messages = chatHistory;
    } else {
      this.getBotResponse('__welcome__');
    }
  }

  private scrollToBottom(): void {
    try {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(input?: string): void {
    const message = (input || this.userInput).trim();
    if (!message) return;

    this.addUserMessage(message);
    this.getBotResponse(message);
    this.userInput = '';
  }

  private addUserMessage(message: string): void {
    this.messages.push({
      text: message,
      sender: 'user',
      timestamp: new Date()
    });
    this.shouldScroll = true;
  }

  private addBotMessage(message: string, suggestions?: string[]): void {
    this.messages.push({
      text: message,
      sender: 'bot',
      timestamp: new Date(),
      suggestions: suggestions || []
    });
    this.shouldScroll = true;
  }

  private getBotResponse(message: string): void {
    this.isLoading = true;
  
    this.http.post(`${this.apiUrl}/chat/chat`, { message, sessionId: this.sessionId }).subscribe({
      next: (response: any) => {
        const botMessage = response.response || '';
        const suggestions = response.suggestions || [];
  
        // On ajoute toujours la réponse du bot sans filtrage
        this.messages.push({
          text: botMessage,
          sender: 'bot',
          timestamp: new Date(),
          suggestions: suggestions
        });
  
        this.shouldScroll = true;
      },
      error: (error) => {
        console.error('API error:', error);
        this.addBotMessage("Désolé, je rencontre un problème technique.");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  

  private getChatHistory(): ChatMessage[] {
    try {
      const history = sessionStorage.getItem('chatHistory');
      if (history) {
        return JSON.parse(history).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
    return [];
  }
}
