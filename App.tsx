import React, { useState, useCallback, useEffect } from 'react';
import { Idea, RefinedIdea } from './types';
import { generateIdeas, refineIdea } from './services/geminiService';
import IdeaForm from './components/IdeaForm';
import IdeaCard from './components/IdeaCard';
import LoadingSpinner from './components/LoadingSpinner';
import { SparklesIcon } from './components/icons/SparklesIcon';
import RefineModal from './components/RefineModal';

const App: React.FC = () => {
    const [userInput, setUserInput] = useState<string>('مشروع منتج رقمي او تطبيق يكون مربح');
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialState, setIsInitialState] = useState<boolean>(true);

    // State for refinement modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
    const [refinedData, setRefinedData] = useState<RefinedIdea | null>(null);
    const [isRefining, setIsRefining] = useState<boolean>(false);
    const [refineError, setRefineError] = useState<string | null>(null);

    // State for API Key readiness
    const [apiKeyReady, setApiKeyReady] = useState<boolean>(false);
    const [isCheckingApiKey, setIsCheckingApiKey] = useState<boolean>(true);

    useEffect(() => {
        const checkApiKey = async () => {
            try {
                // @ts-ignore
                if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
                    setApiKeyReady(true);
                }
            } catch (error) {
                console.error("Could not check for API key:", error);
                setApiKeyReady(false);
            } finally {
                setIsCheckingApiKey(false);
            }
        };
        checkApiKey();
    }, []);

    const handleSelectKey = async () => {
        try {
            // @ts-ignore
            await window.aistudio.openSelectKey();
            // Assume success and update UI immediately to avoid race conditions
            setApiKeyReady(true);
        } catch (error) {
            console.error("Error opening API key selector:", error);
            setError("لم نتمكن من فتح نافذة اختيار مفتاح الواجهة البرمجية.");
        }
    };

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
            if (err instanceof Error && err.message.includes('Requested entity was not found')) {
                 setError('يبدو أن مفتاح الواجهة البرمجية المحدد غير صالح. يرجى تحديد مفتاح آخر.');
                 setApiKeyReady(false);
            } else {
                 setError('حدث خطأ أثناء توليد الأفكار. الرجاء التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenRefineModal = useCallback(async (ideaToRefine: Idea) => {
        setSelectedIdea(ideaToRefine);
        setIsModalOpen(true);
        setIsRefining(true);
        setRefinedData(null);
        setRefineError(null);
        try {
            const result = await refineIdea(ideaToRefine);
            setRefinedData(result);
        } catch (err) {
            console.error(err);
            if (err instanceof Error && err.message.includes('Requested entity was not found')) {
                 setRefineError('مفتاح الواجهة البرمجية غير صالح. أغلق هذه النافذة وحدد مفتاحًا جديدًا.');
                 handleCloseRefineModal();
                 setApiKeyReady(false);
            } else {
                setRefineError('تعذر تحليل الفكرة. قد تكون هناك مشكلة في الاتصال بالواجهة البرمجية.');
            }
        } finally {
            setIsRefining(false);
        }
    }, []);

    const handleCloseRefineModal = useCallback(() => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedIdea(null);
            setRefinedData(null);
            setRefineError(null);
        }, 300);
    }, []);

    return (
        <>
            <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8">
                <header className="w-full max-w-4xl text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-2">
                        مولّد أفكار المشاريع
                    </h1>
                    <p className="text-lg text-gray-400">
                        حوّل اهتماماتك إلى مشاريع رقمية مربحة باستخدام الذكاء الاصطناعي
                    </p>
                </header>

                <main className="w-full max-w-4xl flex-grow flex flex-col justify-center">
                    {isCheckingApiKey ? (
                         <div className="text-center">
                            <LoadingSpinner />
                            <p className="text-gray-400 mt-4">... يتم التحقق من إعدادات الواجهة البرمجية</p>
                        </div>
                    ) : !apiKeyReady ? (
                        <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 border border-gray-700 rounded-xl">
                            <h2 className="text-2xl font-semibold text-gray-300 mb-2">مطلوب مفتاح الواجهة البرمجية</h2>
                            <p className="text-gray-400 mb-6 max-w-md">
                                للبدء في توليد الأفكار، يرجى تحديد مفتاح واجهة برمجية. سيتم استخدامه للوصول إلى Gemini API.
                            </p>
                            <button
                                onClick={handleSelectKey}
                                className="flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
                            >
                                تحديد مفتاح API
                            </button>
                        </div>
                    ) : (
                        <>
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
                                        <IdeaCard key={index} idea={idea} onRefine={handleOpenRefineModal} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </main>
                
                <footer className="w-full max-w-4xl text-center mt-12 text-gray-600 text-sm">
                    <p>مدعوم بواسطة Gemini API</p>
                </footer>
            </div>

            <RefineModal 
                isOpen={isModalOpen}
                onClose={handleCloseRefineModal}
                idea={selectedIdea}
                refinedData={refinedData}
                isLoading={isRefining}
                error={refineError}
            />
        </>
    );
};

export default App;