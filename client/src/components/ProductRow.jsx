import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";

export default function ProductRow({ product, onUpdate, onRowClick }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...product });

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditData({ ...product });
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditData({ ...product });
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    await onUpdate(product.id, editData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleRowClick = () => {
    if (!isEditing) {
      onRowClick(product);
    }
  };

  if (isEditing) {
    return (
      <tr className="bg-blue-50 border-l-4 border-blue-500">
        <td className="px-6 py-4">
          <img
            src={product.image || "https://via.placeholder.com/50"}
            alt={product.name}
            className="w-12 h-12 rounded object-cover"
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="text"
            value={editData.unit}
            onChange={(e) => handleChange("unit", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="text"
            value={editData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="text"
            value={editData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="number"
            value={editData.stock}
            onChange={(e) =>
              handleChange("stock", parseInt(e.target.value) || 0)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </td>
        <td className="px-6 py-4">
          <select
            value={editData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </td>
        <td className="px-6 py-4">
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      onClick={handleRowClick}
      className="hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-200"
    >
      <td className="px-6 py-4">
        <img
          src={product.image || "https://via.placeholder.com/50"}
          alt={product.name}
          className="w-12 h-12 rounded object-cover"
        />
      </td>
      <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
      <td className="px-6 py-4 text-gray-600">{product.unit}</td>
      <td className="px-6 py-4 text-gray-600">{product.category}</td>
      <td className="px-6 py-4 text-gray-600">{product.brand}</td>
      <td className="px-6 py-4 font-semibold text-gray-900">{product.stock}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
            product.stock > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={handleEdit}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
