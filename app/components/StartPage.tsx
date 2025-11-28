'use client';

import { templates } from '../data/templates';

interface StartPageProps {
  onSelectTemplate: (templateId: string) => void;
  onCreateBlank: () => void;
}

const templateIcons: Record<string, string> = {
  'invoice': '📋',
  'modern-box': '🎨',
  'resume-minimal': '📄',
};

export default function StartPage({
  onSelectTemplate,
  onCreateBlank,
}: StartPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4 md:p-8 lg:p-12 flex flex-col">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16">
        <div className="flex items-center justify-center gap-4 mb-6 flex-col md:flex-row">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2">
              Invoice Creator
            </h1>
            <p className="text-lg md:text-xl text-blue-200 font-semibold">
              Modern Minimal Design
            </p>
          </div>
        </div>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
          Create beautiful, professional invoices and documents in minutes with our intuitive editor
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full">
        {/* Blank Option */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Start Fresh
          </h2>
          <button
            onClick={onCreateBlank}
            className="w-full md:w-80 p-12 bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/40 hover:border-white/60 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl backdrop-blur-sm group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">➕</div>
            <h3 className="text-xl font-bold text-white mb-2">Blank Document</h3>
            <p className="text-blue-100">Start from scratch with a blank canvas</p>
          </button>
        </div>

        {/* Templates Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Choose a Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                className="p-10 bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50 border-2 border-orange-400 hover:border-orange-500 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl text-left group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {templateIcons[template.id] || '📝'}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600">
                  {template.id === 'invoice' && '✨ Professional invoice template'}
                  {template.id === 'modern-box' && '🎨 Modern box design with colors'}
                  {template.id === 'resume-minimal' && '📄 Clean minimalist resume'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 md:mt-16 pt-8 border-t border-white/20">
        <p className="text-blue-200 text-sm md:text-base flex items-center justify-center gap-2">
          <span>💡</span>
          <span>Tip: Choose a template to get started quickly or create your own from scratch</span>
        </p>
      </div>
    </div>
  );
}
