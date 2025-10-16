import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageModal = ({ isOpen, onClose }) => {
  const { currentLanguage, changeLanguage, languageNames } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'zh', name: '简体中文' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский язык' },
    { code: 'th', name: 'ภาษาไทย' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ms', name: 'Melayu' }
  ];

  const handleLanguageSelect = (languageCode) => {
    changeLanguage(languageCode);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-right">
                <h3 className="text-lg font-medium text-gray-900">Language</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-medium text-gray-900">Choose a language and region</h2>
            </div>

            {/* Selected Language */}
            <div className="mb-6">
              <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-center">
                {languageNames[currentLanguage] || 'English'}
              </div>
            </div>

            {/* Language Grid */}
            <div className="grid grid-cols-2 gap-2">
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors ${
                    currentLanguage === language.code ? 'bg-gray-100' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {language.name}
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Language changes will be applied immediately
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LanguageModal;


