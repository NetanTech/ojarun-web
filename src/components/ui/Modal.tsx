"use client";

import clsx from 'clsx';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Modal = ({ isOpen, onClose, children, title, className }: ModalProps) => {
  useEffect(() => {
    const handleEscClick = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscClick);
    return () => document.removeEventListener('keydown', handleEscClick);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    history.pushState({ modalOpen: true }, "");
    const onPopState = () => onClose();
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      if (window.history.state?.modalOpen) history.replaceState(null, "");
    };
  }, [isOpen, onClose]);

  const headerContent = (
    <div className="flex items-center justify-between shrink-0">
      {title && <h6 className="font-medium">{title}</h6>}
      <button onClick={onClose}>
        <X />
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30"
            onClick={onClose}
          />

          <motion.div
            key="mobile-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-2xl p-3 max-h-[90vh] flex flex-col"
          >
            {headerContent}
            <div className="overflow-y-auto flex-1 space-y-4">
              {children}
            </div>
          </motion.div>

          <motion.div
            key="desktop-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 hidden md:flex items-center justify-center pointer-events-none"
          >
            <div className={clsx(className, 'bg-white rounded-xl p-3 space-y-4 pointer-events-auto')}>
              {headerContent}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
