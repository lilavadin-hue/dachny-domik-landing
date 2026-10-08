class ChatBot {
    constructor() {
        this.currentStep = 0;
        this.userResponses = {};
        this.chatMessages = document.getElementById('chatMessages');
        this.quickReplies = document.getElementById('quickReplies');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        
        this.questions = [
            {
                id: 'purpose',
                text: '👋 Привет! Я помогу подобрать идеальную бытовку для вашей дачи. Для чего вам нужна бытовка?',
                type: 'choice',
                options: ['Для хранения инструментов и вещей', 'Для проживания (дача/гости)', 'Летняя кухня с террасой', 'Гостевой домик', 'Другое']
            },
            {
                id: 'size',
                text: 'Отлично! Какой размер вас интересует?',
                type: 'choice',
                options: ['Компактная (до 6 м²)', 'Средняя (6-12 м²)', 'Большая (12-20 м²)', 'Несколько бытовок вместе', 'Пока не знаю']
            },
            {
                id: 'insulation',
                text: 'Нужно ли утепление?',
                type: 'choice',
                options: ['Да, круглогодичное проживание', 'Да, но только сезонное', 'Нет, достаточно простой конструкции', 'Не уверен(а)']
            },
            {
                id: 'windows',
                text: 'Какие окна предпочитаете?',
                type: 'choice',
                options: ['Полноценные пластиковые окна', 'Простые деревянные окна', 'Без окон', 'Большие панорамные окна']
            },
            {
                id: 'extras',
                text: 'Нужны ли дополнительные элементы?',
                type: 'choice',
                options: ['Терраса/навес', 'Внутренняя отделка', 'Электричество', 'Водоснабжение', 'Пока ничего дополнительного']
            },
            {
                id: 'budget',
                text: 'Какой у вас примерный бюджет?',
                type: 'choice',
                options: ['До 100 000 ₽', '100 000 - 200 000 ₽', '200 000 - 350 000 ₽', 'Более 350 000 ₽', 'Хочу узнать цены']
            }
        ];
        
        this.init();
    }
    
    init() {
        this.sendButton.addEventListener('click', () => this.handleUserInput());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });
        
        setTimeout(() => {
            this.askQuestion();
        }, 500);
    }
    
    askQuestion() {
        if (this.currentStep >= this.questions.length) {
            this.showSummary();
            return;
        }
        
        const question = this.questions[this.currentStep];
        this.addMessage(question.text, 'bot');
        
        if (question.type === 'choice' && question.options) {
            this.showQuickReplies(question.options);
        } else {
            this.enableInput();
        }
    }
    
    showQuickReplies(options) {
        this.quickReplies.innerHTML = '';
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.textContent = option;
            btn.onclick = () => this.handleQuickReply(option);
            this.quickReplies.appendChild(btn);
        });
    }
    
    handleQuickReply(answer) {
        this.addMessage(answer, 'user');
        this.userResponses[this.questions[this.currentStep].id] = answer;
        this.clearQuickReplies();
        this.currentStep++;
        
        setTimeout(() => {
            this.askQuestion();
        }, 500);
    }
    
    handleUserInput() {
        const text = this.userInput.value.trim();
        if (!text) return;
        
        this.addMessage(text, 'user');
        this.userResponses[this.questions[this.currentStep].id] = text;
        this.userInput.value = '';
        this.disableInput();
        this.clearQuickReplies();
        this.currentStep++;
        
        setTimeout(() => {
            this.askQuestion();
        }, 500);
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    enableInput() {
        this.userInput.disabled = false;
        this.sendButton.disabled = false;
        this.userInput.focus();
    }
    
    disableInput() {
        this.userInput.disabled = true;
        this.sendButton.disabled = true;
    }
    
    clearQuickReplies() {
        this.quickReplies.innerHTML = '';
    }
    
    showSummary() {
        const summary = this.generateSummary();
        
        this.addMessage('✨ Отлично! Вот резюме ваших пожеланий:', 'bot');
        
        setTimeout(() => {
            this.addMessage(summary, 'bot');
        }, 500);
        
        setTimeout(() => {
            this.askForPhone();
        }, 1500);
    }
    
    generateSummary() {
        const responses = this.userResponses;
        let summary = '📋 Ваши требования:\n\n';
        
        summary += `• Назначение: ${responses.purpose || 'Не указано'}\n`;
        summary += `• Размер: ${responses.size || 'Не указано'}\n`;
        summary += `• Утепление: ${responses.insulation || 'Не указано'}\n`;
        summary += `• Окна: ${responses.windows || 'Не указано'}\n`;
        summary += `• Дополнительно: ${responses.extras || 'Не указано'}\n`;
        summary += `• Бюджет: ${responses.budget || 'Не указано'}`;
        
        return summary;
    }
    
    askForPhone() {
        this.addMessage('📱 Оставьте ваш номер телефона, и наш менеджер свяжется с вами в ближайшее время с индивидуальным коммерческим предложением!', 'bot');
        this.enableInput();
        this.userInput.placeholder = 'Введите ваш номер телефона...';
        
        this.waitForPhone();
    }
    
    waitForPhone() {
        const originalHandler = this.handleUserInput.bind(this);
        this.handleUserInput = () => {
            const phone = this.userInput.value.trim();
            if (!phone) return;
            
            this.addMessage(phone, 'user');
            this.userInput.value = '';
            
            setTimeout(() => {
                this.addMessage('✅ Спасибо! Наш менеджер свяжется с вами в течение часа. Хорошего дня! 🌞', 'bot');
                this.disableInput();
                
                console.log('Lead captured:', {
                    ...this.userResponses,
                    phone: phone,
                    timestamp: new Date().toISOString()
                });
            }, 500);
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});

document.querySelector('.cta-button').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#chat').scrollIntoView({ behavior: 'smooth' });
});