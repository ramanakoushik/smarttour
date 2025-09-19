// Smart Tour - Multilingual AI Chatbot

class SmartTourChatbot {
    constructor() {
        this.currentLanguage = 'en';
        this.conversationHistory = [];
        this.isTyping = false;
        this.supportedLanguages = {
            en: 'English',
            hi: 'हिन्दी',
            sat: 'ᱥᱟᱱᱛᱟᱲᱤ (Santhali)',
            ho: 'ᱦᱳ (Ho)',
            mun: 'ᱢᱩᱱᱰᱟᱨᱤ (Mundari)',
            bn: 'বাংলা (Bengali)',
            or: 'ଓଡ଼ିଆ (Odia)'
        };
        
        this.responses = this.initializeResponses();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLanguageDetection();
        this.loadChatHistory();
    }

    setupEventListeners() {
        const sendBtn = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');
        const clearBtn = document.getElementById('clear-chat');
        const quickBtns = document.querySelectorAll('.quick-btn');

        if (sendBtn) {
            sendBtn.addEventListener('click', this.sendMessage.bind(this));
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            chatInput.addEventListener('input', this.handleInputChange.bind(this));
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', this.clearChat.bind(this));
        }

        quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.dataset.message;
                if (message) {
                    this.sendQuickMessage(message);
                }
            });
        });
    }

    setupLanguageDetection() {
        // Detect user's language preference
        const browserLang = navigator.language.split('-')[0];
        if (this.supportedLanguages[browserLang]) {
            this.currentLanguage = browserLang;
        }

        // Listen for language changes from main app
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                this.updateChatLanguage();
            });
        }
    }

    initializeResponses() {
        return {
            en: {
                greetings: [
                    "Hello! I'm your Smart Tour Jharkhand assistant. How can I help you explore the beautiful state of Jharkhand?",
                    "Hi there! Ready to discover Jharkhand's rich tribal culture and natural beauty? I'm here to help!",
                    "Welcome to Smart Tour Jharkhand! I can assist you with exploring tribal heritage, wildlife, and cultural experiences."
                ],
                help: [
                    "I can help you with:",
                    "• Jharkhand's tribal attractions and cultural sites",
                    "• Planning personalized itineraries across Jharkhand",
                    "• Booking tribal homestays and eco-lodges",
                    "• Local tribal recommendations and cultural insights",
                    "• Transportation within Jharkhand",
                    "• Tribal language help (Santhali, Ho, Mundari)",
                    "• Wildlife and nature experiences",
                    "What would you like to explore in Jharkhand?"
                ],
                attractions: [
                    "Here are Jharkhand's must-visit attractions:",
                    "• Betla National Park - Wildlife safari and tiger spotting",
                    "• Hazaribagh Wildlife Sanctuary - Bird watching paradise",
                    "• Netarhat Hill Station - Queen of Chotanagpur",
                    "• Ranchi - Capital city with waterfalls and temples",
                    "• Jamshedpur - Steel city with beautiful parks",
                    "• Tribal villages - Authentic cultural experiences",
                    "• Ancient temples and archaeological sites",
                    "Tell me your interests and I'll recommend the best places to visit in Jharkhand!"
                ],
                itinerary: [
                    "I'd love to help you plan your itinerary! To create the perfect plan, I need to know:",
                    "• Your destination",
                    "• Travel dates",
                    "• Number of travelers",
                    "• Your interests (culture, nature, adventure, food, etc.)",
                    "• Budget range",
                    "• Travel style (budget, mid-range, luxury)",
                    "Once you provide these details, I'll create a personalized itinerary just for you!"
                ],
                restaurants: [
                    "I can help you find the best restaurants! Here's what I can recommend:",
                    "• Local cuisine and traditional dishes",
                    "• Fine dining and upscale restaurants",
                    "• Street food and local markets",
                    "• Vegetarian and vegan options",
                    "• Family-friendly establishments",
                    "• Restaurants with great views or atmosphere",
                    "What type of dining experience are you looking for?"
                ],
                booking: [
                    "I can help you book various services:",
                    "• Hotels and accommodations",
                    "• Tours and activities",
                    "• Transportation (flights, trains, buses)",
                    "• Restaurant reservations",
                    "• Event tickets",
                    "• Local experiences and workshops",
                    "What would you like to book? I'll guide you through the process!"
                ],
                fallback: [
                    "I'm not sure I understand that. Could you rephrase your question?",
                    "I'm here to help with travel planning, recommendations, and bookings. What specific information do you need?",
                    "Let me know how I can assist you with your travel plans!"
                ]
            },
            hi: {
                greetings: [
                    "नमस्ते! मैं आपका Smart Tour Jharkhand सहायक हूं। मैं आपको झारखंड की खोज में कैसे मदद कर सकता हूं?",
                    "हैलो! झारखंड की समृद्ध आदिवासी संस्कृति और प्राकृतिक सुंदरता की खोज के लिए तैयार हैं? मैं यहां मदद के लिए हूं!",
                    "Smart Tour Jharkhand में आपका स्वागत है! मैं आपको आदिवासी विरासत, वन्यजीव और सांस्कृतिक अनुभवों की खोज में सहायता कर सकता हूं।"
                ],
                help: [
                    "मैं आपकी इन चीजों में मदद कर सकता हूं:",
                    "• झारखंड के आदिवासी आकर्षण और सांस्कृतिक स्थल",
                    "• झारखंड भर में व्यक्तिगत यात्रा योजना",
                    "• आदिवासी होमस्टे और इको-लॉज बुकिंग",
                    "• स्थानीय आदिवासी सुझाव और सांस्कृतिक अंतर्दृष्टि",
                    "• झारखंड के भीतर परिवहन",
                    "• आदिवासी भाषा सहायता (संथाली, हो, मुंडारी)",
                    "• वन्यजीव और प्रकृति अनुभव",
                    "आप झारखंड में क्या खोजना चाहते हैं?"
                ],
                attractions: [
                    "यहां झारखंड के अवश्य देखने योग्य आकर्षण हैं:",
                    "• बेतला राष्ट्रीय उद्यान - वन्यजीव सफारी और बाघ देखना",
                    "• हजारीबाग वन्यजीव अभयारण्य - पक्षी देखने का स्वर्ग",
                    "• नेतरहाट हिल स्टेशन - छोटानागपुर की रानी",
                    "• रांची - झरनों और मंदिरों के साथ राजधानी",
                    "• जमशेदपुर - सुंदर पार्कों के साथ स्टील सिटी",
                    "• आदिवासी गांव - प्रामाणिक सांस्कृतिक अनुभव",
                    "• प्राचीन मंदिर और पुरातात्विक स्थल",
                    "मुझे अपनी रुचियां बताएं और मैं झारखंड में देखने के लिए सबसे अच्छी जगहों की सिफारिश करूंगा!"
                ],
                itinerary: [
                    "मैं आपकी यात्रा योजना बनाने में मदद करना चाहूंगा! सही योजना बनाने के लिए, मुझे जानना होगा:",
                    "• आपका गंतव्य",
                    "• यात्रा की तारीखें",
                    "• यात्रियों की संख्या",
                    "• आपकी रुचियां (संस्कृति, प्रकृति, रोमांच, भोजन, आदि)",
                    "• बजट सीमा",
                    "• यात्रा शैली (बजट, मध्यम, लक्जरी)",
                    "एक बार जब आप ये विवरण प्रदान करेंगे, मैं आपके लिए एक व्यक्तिगत यात्रा योजना बनाऊंगा!"
                ],
                restaurants: [
                    "मैं आपको सबसे अच्छे रेस्तरां खोजने में मदद कर सकता हूं! यहां मैं क्या सुझा सकता हूं:",
                    "• स्थानीय आदिवासी व्यंजन और पारंपरिक व्यंजन",
                    "• झारखंड के प्रामाणिक व्यंजन",
                    "• स्थानीय बाजार और स्ट्रीट फूड",
                    "• शाकाहारी और वीगन विकल्प",
                    "• परिवार के अनुकूल प्रतिष्ठान",
                    "• सुंदर दृश्यों वाले रेस्तरां",
                    "आप किस प्रकार का भोजन अनुभव खोज रहे हैं?"
                ],
                booking: [
                    "मैं आपको विभिन्न सेवाओं की बुकिंग में मदद कर सकता हूं:",
                    "• होटल और आवास",
                    "• टूर और गतिविधियां",
                    "• परिवहन (उड़ानें, ट्रेनें, बसें)",
                    "• रेस्तरां आरक्षण",
                    "• इवेंट टिकट",
                    "• स्थानीय अनुभव और कार्यशालाएं",
                    "आप क्या बुक करना चाहते हैं? मैं आपको प्रक्रिया के माध्यम से मार्गदर्शन करूंगा!"
                ],
                fallback: [
                    "मुझे यकीन नहीं है कि मैं इसे समझ गया हूं। क्या आप अपना प्रश्न फिर से बना सकते हैं?",
                    "मैं यात्रा योजना, सुझाव और बुकिंग में मदद के लिए यहां हूं। आपको किस विशिष्ट जानकारी की आवश्यकता है?",
                    "मुझे बताएं कि मैं आपकी यात्रा योजनाओं में कैसे मदद कर सकता हूं!"
                ]
            },
            es: {
                greetings: [
                    "¡Hola! Soy tu asistente de Smart Tour. ¿Cómo puedo ayudarte a planificar tu viaje perfecto?",
                    "¡Hola! ¿Listo para explorar destinos increíbles? ¡Estoy aquí para ayudar!",
                    "¡Bienvenido a Smart Tour! Puedo ayudarte con la planificación de viajes, recomendaciones y más."
                ],
                help: [
                    "Puedo ayudarte con:",
                    "• Encontrar atracciones y actividades",
                    "• Planificar itinerarios personalizados",
                    "• Reservar alojamientos y tours",
                    "• Recomendaciones locales y consejos",
                    "• Información de transporte",
                    "• Perspectivas culturales y ayuda con idiomas",
                    "¿Qué te gustaría saber?"
                ],
                attractions: [
                    "Aquí tienes algunas atracciones populares que puedo ayudarte a descubrir:",
                    "• Monumentos históricos y lugares emblemáticos",
                    "• Museos y centros culturales",
                    "• Parques naturales y lugares pintorescos",
                    "• Mercados locales y áreas de compras",
                    "• Restaurantes y experiencias gastronómicas",
                    "• Lugares de entretenimiento y espectáculos",
                    "¡Dime tus intereses y te recomendaré los mejores lugares para visitar!"
                ],
                itinerary: [
                    "¡Me encantaría ayudarte a planificar tu itinerario! Para crear el plan perfecto, necesito saber:",
                    "• Tu destino",
                    "• Fechas de viaje",
                    "• Número de viajeros",
                    "• Tus intereses (cultura, naturaleza, aventura, comida, etc.)",
                    "• Rango de presupuesto",
                    "• Estilo de viaje (económico, medio, lujo)",
                    "¡Una vez que proporciones estos detalles, crearé un itinerario personalizado solo para ti!"
                ],
                restaurants: [
                    "¡Puedo ayudarte a encontrar los mejores restaurantes! Aquí está lo que puedo recomendar:",
                    "• Cocina local y platos tradicionales",
                    "• Restaurantes de alta cocina y elegantes",
                    "• Comida callejera y mercados locales",
                    "• Opciones vegetarianas y veganas",
                    "• Establecimientos familiares",
                    "• Restaurantes con excelentes vistas o ambiente",
                    "¿Qué tipo de experiencia gastronómica estás buscando?"
                ],
                booking: [
                    "Puedo ayudarte a reservar varios servicios:",
                    "• Hoteles y alojamientos",
                    "• Tours y actividades",
                    "• Transporte (vuelos, trenes, autobuses)",
                    "• Reservas de restaurantes",
                    "• Entradas para eventos",
                    "• Experiencias locales y talleres",
                    "¿Qué te gustaría reservar? ¡Te guiaré a través del proceso!"
                ],
                fallback: [
                    "No estoy seguro de entender eso. ¿Podrías reformular tu pregunta?",
                    "Estoy aquí para ayudar con la planificación de viajes, recomendaciones y reservas. ¿Qué información específica necesitas?",
                    "¡Déjame saber cómo puedo ayudarte con tus planes de viaje!"
                ]
            },
            fr: {
                greetings: [
                    "Bonjour! Je suis votre assistant Smart Tour. Comment puis-je vous aider à planifier votre voyage parfait?",
                    "Salut! Prêt à explorer des destinations incroyables? Je suis là pour vous aider!",
                    "Bienvenue sur Smart Tour! Je peux vous aider avec la planification de voyages, les recommandations et plus encore."
                ],
                help: [
                    "Je peux vous aider avec:",
                    "• Trouver des attractions et activités",
                    "• Planifier des itinéraires personnalisés",
                    "• Réserver des hébergements et visites",
                    "• Recommandations locales et conseils",
                    "• Informations de transport",
                    "• Perspectives culturelles et aide linguistique",
                    "Que souhaitez-vous savoir?"
                ],
                attractions: [
                    "Voici quelques attractions populaires que je peux vous aider à découvrir:",
                    "• Monuments historiques et sites emblématiques",
                    "• Musées et centres culturels",
                    "• Parcs naturels et sites pittoresques",
                    "• Marchés locaux et zones de shopping",
                    "• Restaurants et expériences gastronomiques",
                    "• Lieux de divertissement et spectacles",
                    "Dites-moi vos intérêts et je vous recommanderai les meilleurs endroits à visiter!"
                ],
                itinerary: [
                    "J'aimerais vous aider à planifier votre itinéraire! Pour créer le plan parfait, j'ai besoin de savoir:",
                    "• Votre destination",
                    "• Dates de voyage",
                    "• Nombre de voyageurs",
                    "• Vos intérêts (culture, nature, aventure, nourriture, etc.)",
                    "• Fourchette de budget",
                    "• Style de voyage (budget, milieu de gamme, luxe)",
                    "Une fois que vous fournirez ces détails, je créerai un itinéraire personnalisé juste pour vous!"
                ],
                restaurants: [
                    "Je peux vous aider à trouver les meilleurs restaurants! Voici ce que je peux recommander:",
                    "• Cuisine locale et plats traditionnels",
                    "• Restaurants gastronomiques et haut de gamme",
                    "• Nourriture de rue et marchés locaux",
                    "• Options végétariennes et véganes",
                    "• Établissements familiaux",
                    "• Restaurants avec de belles vues ou atmosphère",
                    "Quel type d'expérience culinaire recherchez-vous?"
                ],
                booking: [
                    "Je peux vous aider à réserver divers services:",
                    "• Hôtels et hébergements",
                    "• Visites et activités",
                    "• Transport (vols, trains, bus)",
                    "• Réservations de restaurants",
                    "• Billets d'événements",
                    "• Expériences locales et ateliers",
                    "Que souhaitez-vous réserver? Je vous guiderai à travers le processus!"
                ],
                fallback: [
                    "Je ne suis pas sûr de comprendre cela. Pourriez-vous reformuler votre question?",
                    "Je suis là pour aider avec la planification de voyages, les recommandations et les réservations. De quelle information spécifique avez-vous besoin?",
                    "Laissez-moi savoir comment je peux vous aider avec vos plans de voyage!"
                ]
            }
        };
    }

    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Process message and get response
            const response = await this.processMessage(message);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage(response, 'bot');
            
            // Save to conversation history
            this.conversationHistory.push({
                user: message,
                bot: response,
                timestamp: new Date(),
                language: this.currentLanguage
            });
            
            this.saveChatHistory();
            
        } catch (error) {
            console.error('Error processing message:', error);
            this.hideTypingIndicator();
            this.addMessage("I'm sorry, I encountered an error. Please try again.", 'bot');
        }
    }

    sendQuickMessage(message) {
        const chatInput = document.getElementById('chat-input');
        chatInput.value = message;
        this.sendMessage();
    }

    async processMessage(message) {
        const lowerMessage = message.toLowerCase();
        const responses = this.responses[this.currentLanguage] || this.responses.en;
        
        // Simple intent detection
        if (this.containsKeywords(lowerMessage, ['hello', 'hi', 'hey', 'greetings'])) {
            return this.getRandomResponse(responses.greetings);
        }
        
        if (this.containsKeywords(lowerMessage, ['help', 'assist', 'support', 'what can you do'])) {
            return responses.help.join('\n');
        }
        
        if (this.containsKeywords(lowerMessage, ['attraction', 'place', 'visit', 'see', 'sightseeing'])) {
            return responses.attractions.join('\n');
        }
        
        if (this.containsKeywords(lowerMessage, ['itinerary', 'plan', 'schedule', 'trip plan'])) {
            return responses.itinerary.join('\n');
        }
        
        if (this.containsKeywords(lowerMessage, ['restaurant', 'food', 'eat', 'dining', 'meal'])) {
            return responses.restaurants.join('\n');
        }
        
        if (this.containsKeywords(lowerMessage, ['book', 'reserve', 'booking', 'reservation'])) {
            return responses.booking.join('\n');
        }
        
        // If no specific intent detected, use AI-like response
        return this.generateContextualResponse(message, responses);
    }

    containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateContextualResponse(message, responses) {
        // Simple contextual response generation
        const contextualResponses = [
            `I understand you're asking about "${message}". Let me help you with that!`,
            `That's an interesting question about "${message}". Here's what I can tell you:`,
            `Regarding "${message}", I'd be happy to provide some information.`,
            `I see you're interested in "${message}". Let me share some insights with you.`
        ];
        
        const baseResponse = contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
        
        // Add some general helpful information
        const additionalInfo = [
            "I can help you find detailed information about this topic.",
            "Would you like me to provide more specific recommendations?",
            "Feel free to ask me more questions about this!",
            "I'm here to help you with any travel-related questions."
        ];
        
        return `${baseResponse}\n\n${additionalInfo[Math.floor(Math.random() * additionalInfo.length)]}`;
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Format message content
        const formattedContent = this.formatMessageContent(content);
        messageContent.innerHTML = formattedContent;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }

    formatMessageContent(content) {
        // Convert line breaks to HTML
        return content.replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer || this.isTyping) return;
        
        this.isTyping = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(messageContent);
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            // Keep only the initial bot message
            const initialMessage = messagesContainer.querySelector('.bot-message');
            messagesContainer.innerHTML = '';
            if (initialMessage) {
                messagesContainer.appendChild(initialMessage);
            }
        }
        
        this.conversationHistory = [];
        this.saveChatHistory();
        
        // Show confirmation
        if (window.smartTourApp) {
            window.smartTourApp.showNotification('Chat history cleared', 'success');
        }
    }

    handleInputChange(event) {
        const input = event.target;
        const sendBtn = document.getElementById('send-message');
        
        // Enable/disable send button based on input
        if (sendBtn) {
            sendBtn.disabled = !input.value.trim();
        }
        
        // Auto-resize textarea if needed
        if (input.tagName === 'TEXTAREA') {
            input.style.height = 'auto';
            input.style.height = input.scrollHeight + 'px';
        }
    }

    updateChatLanguage() {
        // Update chat interface language
        const chatHeader = document.querySelector('.chat-info h4');
        if (chatHeader) {
            const languageNames = {
                en: 'Smart Tour Assistant',
                es: 'Asistente Smart Tour',
                fr: 'Assistant Smart Tour',
                de: 'Smart Tour Assistent',
                zh: '智能旅游助手',
                ja: 'スマートツアーアシスタント',
                hi: 'स्मार्ट टूर असिस्टेंट',
                ar: 'مساعد سمارت تور'
            };
            
            chatHeader.textContent = languageNames[this.currentLanguage] || 'Smart Tour Assistant';
        }
        
        // Update placeholder text
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            const placeholders = {
                en: 'Ask me anything about your trip...',
                es: 'Pregúntame cualquier cosa sobre tu viaje...',
                fr: 'Demandez-moi n\'importe quoi sur votre voyage...',
                de: 'Fragen Sie mich alles über Ihre Reise...',
                zh: '问我任何关于您旅行的问题...',
                ja: '旅行について何でも聞いてください...',
                hi: 'अपनी यात्रा के बारे में कुछ भी पूछें...',
                ar: 'اسألني أي شيء عن رحلتك...'
            };
            
            chatInput.placeholder = placeholders[this.currentLanguage] || 'Ask me anything about your trip...';
        }
    }

    saveChatHistory() {
        try {
            localStorage.setItem('smartTourChatHistory', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('smartTourChatHistory');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }

    // Advanced AI Features
    async analyzeSentiment(message) {
        // Simple sentiment analysis
        const positiveWords = ['good', 'great', 'amazing', 'wonderful', 'excellent', 'love', 'like', 'happy'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'sad', 'disappointed'];
        
        const lowerMessage = message.toLowerCase();
        const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    async getPersonalizedRecommendations(userPreferences) {
        // Generate personalized recommendations based on user preferences
        const recommendations = {
            attractions: [],
            restaurants: [],
            activities: [],
            accommodations: []
        };
        
        // This would integrate with actual recommendation algorithms
        return recommendations;
    }

    async translateMessage(message, targetLanguage) {
        // Simple translation (in a real app, this would use a translation API)
        const translations = {
            'hello': {
                es: 'hola',
                fr: 'bonjour',
                de: 'hallo',
                zh: '你好',
                ja: 'こんにちは',
                hi: 'नमस्ते',
                ar: 'مرحبا'
            }
        };
        
        const lowerMessage = message.toLowerCase();
        if (translations[lowerMessage] && translations[lowerMessage][targetLanguage]) {
            return translations[lowerMessage][targetLanguage];
        }
        
        return message; // Return original if no translation found
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smartTourChatbot = new SmartTourChatbot();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartTourChatbot;
}
