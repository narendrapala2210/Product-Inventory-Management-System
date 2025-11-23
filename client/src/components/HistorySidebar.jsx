import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { API } from "../utils/api";

export default function HistorySidebar({ product, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/products/${product.id}/history`);
      console.log(response.data);
      setHistory(response.data.data.history);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  // get history from server
  useEffect(() => {
    if (product) {
      fetchHistory();
    }
  }, []);

  if (!product) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 animate-slide-in-right flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">{product.name}</h2>
              <p className="text-blue-100 text-sm">Product History</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-500 rounded-lg p-1 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Clock className="w-12 h-12 mb-3" />
              <p>No history available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      Stock Update
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-red-600 font-semibold">
                      {entry.oldStock}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-600 font-semibold">
                      {entry.newStock}
                    </span>
                  </div>
                  {entry.changedBy && (
                    <p className="text-xs text-gray-500 mt-2">
                      Changed by:{" "}
                      <span className="font-medium">{entry.changedBy}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
