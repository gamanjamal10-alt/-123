import React from 'react';
import { Idea, RefinedIdea } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface RefineModalProps {
    isOpen: boolean;
    onClose: () => void;
    idea: Idea | null;
    refinedData: RefinedIdea | null;
    isLoading: boolean;
    error: string | null;
}

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const MegaphoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
);

const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);

const RefineModal: React.FC<RefineModalProps> = ({ isOpen, onClose, idea, refinedData, isLoading, error }) => {
    if (!isOpen || !idea) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
                style={{animationFillMode: 'forwards', animationDuration: '0.3s'}}
            >
                <header className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                        تحليل معمق للفكرة
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="p-6 overflow-y-auto">
                    <div className="mb-6 pb-4 border-b border-gray-700/50">
                        <h3 className="text-lg font-semibold text-gray-200 mb-2">الفكرة الأساسية</h3>
                        <p className="text-gray-400">{idea.concept}</p>
                    </div>

                    {isLoading && <div className="flex flex-col items-center justify-center p-8"><LoadingSpinner /> <p className="mt-4 text-gray-400">... يتم تحليل الفكرة وتوسيعها</p></div>}
                    {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}

                    {refinedData && (
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                <div className="flex-shrink-0 bg-gray-700 p-2 rounded-lg"><SparklesIcon className="w-6 h-6 text-yellow-400" /></div>
                                <div>
                                    <h4 className="text-md font-semibold text-gray-200">الميزة التنافسية الفريدة</h4>
                                    <p className="text-gray-400 mt-1">{refinedData.uniqueSellingProposition}</p>
                                </div>
                            </div>

                             <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                <div className="flex-shrink-0 bg-gray-700 p-2 rounded-lg"><LightbulbIcon className="w-6 h-6 text-blue-400" /></div>
                                <div>
                                    <h4 className="text-md font-semibold text-gray-200">الميزات الرئيسية</h4>
                                    <ul className="list-disc list-inside text-gray-400 mt-1 space-y-1 marker:text-blue-400">
                                        {refinedData.keyFeatures.map((feature, i) => <li key={i}>{feature}</li>)}
                                    </ul>
                                </div>
                            </div>

                             <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                <div className="flex-shrink-0 bg-gray-700 p-2 rounded-lg"><MegaphoneIcon className="w-6 h-6 text-teal-400" /></div>
                                <div>
                                    <h4 className="text-md font-semibold text-gray-200">استراتيجية التسويق</h4>
                                    <p className="text-gray-400 mt-1">{refinedData.marketingStrategy}</p>
                                </div>
                            </div>

                             <div className="flex items-start space-x-4 rtl:space-x-reverse">
                                <div className="flex-shrink-0 bg-gray-700 p-2 rounded-lg"><CodeIcon className="w-6 h-6 text-green-400" /></div>
                                <div>
                                    <h4 className="text-md font-semibold text-gray-200">المكدس التقني المقترح</h4>
                                     <div className="flex flex-wrap gap-2 mt-2">
                                        {refinedData.technicalStack.map((tech, i) => (
                                            <span key={i} className="px-3 py-1 text-sm font-medium bg-gray-700 text-gray-300 rounded-full">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: scale(0.95) translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-fade-in {
                    animation-name: fade-in;
                }
                .animate-fade-in-up {
                    animation-name: fade-in-up;
                }
            `}</style>
        </div>
    );
};

export default RefineModal;
