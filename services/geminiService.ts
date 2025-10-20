import { GoogleGenAI, Type } from '@google/genai';
import { Idea, RefinedIdea } from '../types';

const ideaSchema = {
    type: Type.OBJECT,
    properties: {
        ideas: {
            type: Type.ARRAY,
            description: "قائمة من 3 إلى 5 أفكار لمشاريع رقمية.",
            items: {
                type: Type.OBJECT,
                properties: {
                    concept: {
                        type: Type.STRING,
                        description: 'اسم الفكرة ووصف موجز ومبتكر لها في جملة أو جملتين.'
                    },
                    targetAudience: {
                        type: Type.STRING,
                        description: 'من هو الجمهور المستهدف الأساسي لهذه الفكرة؟'
                    },
                    monetization: {
                        type: Type.STRING,
                        description: 'استراتيجية تحقيق الربح الرئيسية (مثال: اشتراك شهري، إعلانات، بيع مباشر).'
                    },
                    profitability: {
                        type: Type.STRING,
                        description: 'تحليل موجز للربحية المحتملة وتقييمها (عالية، متوسطة، منخفضة) مع سبب التقييم.'
                    }
                },
                required: ['concept', 'targetAudience', 'monetization', 'profitability']
            }
        }
    },
    required: ['ideas']
};

const refinedIdeaSchema = {
    type: Type.OBJECT,
    properties: {
        uniqueSellingProposition: {
            type: Type.STRING,
            description: "ما هي الميزة التنافسية الفريدة التي تميز هذه الفكرة عن المنافسين؟ (جملة واحدة)."
        },
        keyFeatures: {
            type: Type.ARRAY,
            description: "قائمة من 3-4 ميزات أساسية يجب توفرها في المنتج عند الإطلاق.",
            items: {
                type: Type.STRING
            }
        },
        marketingStrategy: {
            type: Type.STRING,
            description: "وصف موجز لاستراتيجية تسويقية مقترحة للوصول إلى الجمهور المستهدف."
        },
        technicalStack: {
            type: Type.ARRAY,
            description: "اقتراح للمكدس التقني (Technologies stack) المطلوب لتنفيذ المشروع (مثال: React Native, Firebase, Node.js).",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ['uniqueSellingProposition', 'keyFeatures', 'marketingStrategy', 'technicalStack']
};


export const generateIdeas = async (userInput: string): Promise<Idea[]> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API key is not set. Please set the API_KEY environment variable.");
        }
        // Initialize the SDK instance here to avoid app crash on load.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `
        بصفتك خبيرًا في استراتيجيات الأعمال والمنتجات الرقمية، قم بتحليل طلب المستخدم التالي وقم بتوليد 3 أفكار لمشاريع رقمية أو تطبيقات مربحة.
        
        طلب المستخدم: "${userInput}"

        لكل فكرة، قدم التفاصيل التالية باللغة العربية:
        1.  **المفهوم (concept):** اسم جذاب ووصف موجز للفكرة.
        2.  **الجمهور المستهدف (targetAudience):** من هم العملاء المحتملون.
        3.  **طريقة الربح (monetization):** كيف سيجني المشروع المال.
        4.  **الربحية المحتملة (profitability):** تقييم للربحية مع تبرير بسيط.

        تأكد من أن الأفكار مبتكرة وقابلة للتنفيذ. أرجع النتائج بصيغة JSON فقط بناءً على المخطط المحدد.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: ideaSchema,
                temperature: 0.8,
                topP: 0.9,
            }
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson.ideas || [];
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate ideas from the API.");
    }
};

export const refineIdea = async (idea: Idea): Promise<RefinedIdea> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API key is not set. Please set the API_KEY environment variable.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `
        بصفتك مستشارًا لتطوير المنتجات، قم بتحليل فكرة المشروع التالية وقم بتوسيعها إلى خطة عمل أولية.

        الفكرة الحالية:
        - المفهوم: ${idea.concept}
        - الجمهور المستهدف: ${idea.targetAudience}
        - طريقة الربح: ${idea.monetization}

        المطلوب هو تقديم التفاصيل التالية باللغة العربية:
        1.  **الميزة التنافسية الفريدة (uniqueSellingProposition):** ما الذي يجعل هذا المشروع فريدًا؟
        2.  **الميزات الرئيسية (keyFeatures):** قائمة بأهم 3 أو 4 ميزات أساسية.
        3.  **استراتيجية التسويق (marketingStrategy):** كيف يمكن الوصول للعملاء.
        4.  **المكدس التقني المقترح (technicalStack):** التقنيات التي يمكن استخدامها.

        أرجع النتائج بصيغة JSON فقط بناءً على المخطط المحدد.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: refinedIdeaSchema,
                temperature: 0.7,
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API for refinement:", error);
        throw new Error("Failed to refine the idea from the API.");
    }
};
