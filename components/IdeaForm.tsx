
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface IdeaFormProps {
  userInput: string;
  setUserInput: (input: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const IdeaForm: React.FC<IdeaFormProps> = ({ userInput, setUserInput, onSubmit, isLoading }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label htmlFor="idea-prompt" className="block text-md font-medium text-gray-300">
        صف فكرتك أو اهتمامك هنا...
      </label>
      <textarea
        id="idea-prompt"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="مثال: تطبيق لتعليم الطبخ للمبتدئين باستخدام وصفات فيديو قصيرة"
        className="w-full h-24 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-none"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            جاري التفكير...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            ولّد الأفكار
          </>
        )}
      </button>
    </form>
  );
};

export default IdeaForm;
