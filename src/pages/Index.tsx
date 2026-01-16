import { motion } from 'framer-motion';
import { Languages, Mic, Volume2, ArrowRightLeft } from 'lucide-react';
import TranslatorCard from '@/components/TranslatorCard';

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="floating-orb w-[600px] h-[600px] -top-40 -left-40 opacity-20"
          style={{ 
            background: 'radial-gradient(circle, hsl(265 85% 60% / 0.4), transparent 70%)',
            animationDelay: '0s'
          }}
        />
        <div 
          className="floating-orb w-[500px] h-[500px] top-1/2 -right-40 opacity-15"
          style={{ 
            background: 'radial-gradient(circle, hsl(220 90% 56% / 0.4), transparent 70%)',
            animationDelay: '-7s'
          }}
        />
        <div 
          className="floating-orb w-[400px] h-[400px] -bottom-20 left-1/3 opacity-10"
          style={{ 
            background: 'radial-gradient(circle, hsl(280 80% 55% / 0.4), transparent 70%)',
            animationDelay: '-14s'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-glass-border mb-6"
          >
            <Languages className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-card-foreground">AI-Powered Translation</span>
          </motion.div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-foreground">Translate </span>
            <span className="gradient-text">Anything</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Speak or type in any language. We'll detect it automatically and translate to your chosen language instantly.
          </p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-glass-border shadow-sm"
            >
              <Mic className="w-4 h-4 text-primary" />
              <span className="text-sm text-card-foreground">Voice Input</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-glass-border shadow-sm"
            >
              <Languages className="w-4 h-4 text-primary" />
              <span className="text-sm text-card-foreground">Auto-Detect</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-glass-border shadow-sm"
            >
              <ArrowRightLeft className="w-4 h-4 text-primary" />
              <span className="text-sm text-card-foreground">50+ Languages</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-glass-border shadow-sm"
            >
              <Volume2 className="w-4 h-4 text-primary" />
              <span className="text-sm text-card-foreground">Audio Output</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Translator Card */}
        <TranslatorCard />

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          Powered by advanced language detection and neural machine translation
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
