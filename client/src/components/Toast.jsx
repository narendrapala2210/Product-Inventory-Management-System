import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />
    }
  };

  const style = styles[type] || styles.success;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${style.bg} border rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px]`}>
        {style.icon}
        <p className={`${style.text} flex-1 font-medium`}>{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
