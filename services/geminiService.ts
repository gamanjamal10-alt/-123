
import { GoogleGenAI, Type } from '@google/genai';
import { Idea } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const generateIdeas = async (userInput: string): Promise<Idea[]> => {
    try {
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
