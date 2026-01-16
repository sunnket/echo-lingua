import { motion } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '@/hooks/useTranslation';

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
  label: string;
}

const LanguageSelector = ({ value, onChange, label }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === value);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="relative" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsOpen(!isOpen)}
          className="premium-select w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <span className="text-card-foreground">
            {selectedLanguage?.name || 'Select language'}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 glass-card p-2 max-h-72 overflow-hidden"
          >
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search languages..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-input border border-border text-card-foreground text-sm focus:outline-none focus:border-primary"
              />
            </div>
            
            <div className="overflow-y-auto max-h-52 space-y-1">
              {filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChange(lang.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    value === lang.code
                      ? 'bg-primary/20 text-primary'
                      : 'text-card-foreground hover:bg-muted'
                  }`}
                >
                  <span>{lang.name}</span>
                  <span className="text-xs text-muted-foreground">{lang.code}</span>
                  {value === lang.code && <Check className="w-4 h-4 text-primary ml-2" />}
                </button>
              ))}
              
              {filteredLanguages.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No languages found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
