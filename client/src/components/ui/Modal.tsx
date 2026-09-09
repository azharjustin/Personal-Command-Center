import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`w-full ${sizeClasses[size]} mx-auto bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-surface-200/90 dark:border-surface-700/80 overflow-hidden flex flex-col`}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header-container">
              <h2 className="modal-header-title">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-surface-200/60 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="modal-body-container">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
