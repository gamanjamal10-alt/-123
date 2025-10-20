
import React, { useState } from 'react';
import { Idea } from './types';
import { generateIdeas } from './services/geminiService';
import IdeaForm from './components/IdeaForm';
import IdeaCard from './components/IdeaCard';
import LoadingSpinner from './components/LoadingSpinner';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
    const [userInput, setUserInput] = useState<string>('مشروع منتج رقمي او تطبيق يكون مربح');
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialState, setIsInitialState] = useState<boolean>(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setIdeas([]);
        setIsInitialState(false);

        try {
            const generatedIdeas = await generateIdeas(userInput);
            setIdeas(generatedIdeas);
        } catch (err) {
            console.error(err);
            setError('حدث خطأ أثناء توليد الأفكار. الرجاء التأكد من صحة مفتاح الواجهة البرمجية (API Key) والمحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <header className="w-full max-w-4xl text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-2">
                    مولّد أفكار المشاريع
                </h1>
                <p className="text-lg text-gray-400">
                    حوّل اهتماماتك إلى مشاريع رقمية مربحة باستخدام الذكاء الاصطناعي
                </p>
            </header>

            <main className="w-full max-w-4xl flex-grow">
                <div className="sticky top-6 z-10 bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700 mb-8">
                    <IdeaForm
                        userInput={userInput}
                        setUserInput={setUserInput}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                </div>

                <div className="results-container">
                    {isLoading && <LoadingSpinner />}
                    {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
                    
                    {!isLoading && !error && isInitialState && (
                         <div className="text-center text-gray-500 p-8 flex flex-col items-center">
                            <SparklesIcon className="w-16 h-16 mb-4 text-blue-500" />
                            <h2 className="text-2xl font-semibold text-gray-300 mb-2">أطلق العنان لإبداعك</h2>
                            <p>صف باختصار مجال اهتمامك، مهاراتك، أو مشكلة تود حلها، ودعنا نولّد لك أفكارًا مبتكرة.</p>
                        </div>
                    )}
                    
                    {!isLoading && !error && !isInitialState && ideas.length === 0 && (
                        <div className="text-center text-gray-500 p-8">
                            <h2 className="text-2xl font-semibold text-gray-300">لم يتم العثور على أفكار</h2>
                            <p>حاول تعديل بحثك أو كن أكثر تحديدًا للحصول على نتائج أفضل.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ideas.map((idea, index) => (
                            <IdeaCard key={index} idea={idea} />
                        ))}
                    </div>
                </div>
            </main>
            
            <footer className="w-full max-w-4xl text-center mt-12 text-gray-600 text-sm">
                <p>مدعوم بواسطة Gemini API</p>
            </footer>
        </div>
    );
};

export default App;
