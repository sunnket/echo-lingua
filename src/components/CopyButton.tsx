import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  disabled?: boolean;
}

const CopyButton = ({ text, disabled }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text || disabled) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      disabled={disabled}
      className={`icon-button ${copied ? 'bg-success/20 text-success border-success/30' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-5 h-5" />
      ) : (
        <Copy className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default CopyButton;
