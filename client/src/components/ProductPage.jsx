import { useState, useEffect, useRef } from "react";
import { Search, Upload, Download, Filter } from "lucide-react";
import { API } from "../utils/api";
import ProductTable from "./ProductTable";
import HistorySidebar from "./HistorySidebar";
import Toast from "./Toast";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // get all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/products");
      const data = await response.data;
      if (data.status === "success") {
        setProducts(data.data.products);
        setAllProducts(data.data.products);
        setFilteredProducts(data.data.products);
        const uniqueCategories = [
          "All",
          ...new Set(data.data.products.map((p) => p.category).filter(Boolean)),
        ];
        showToast(data.message, "success");
        setCategories(uniqueCategories);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // get search products
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setProducts(allProducts);
      return;
    }

    try {
      const response = await API.get(`/api/products/search?name=${query}`);

      if (response.data.status === "success") {
        setProducts(response.data.data.products);
      } else {
        showToast("Search Fetch failed", "error");
      }
      console.log(response);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  // filter by category
  const filterProducts = () => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category === selectedCategory)
      );
    }
  };

  //update product
  const handleUpdate = async (id, updatedData) => {
    try {
      await API.put(`/api/products/${id}`, updatedData);

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
      );
      setAllProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
      );

      showToast("Product updated successfully", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  // import products from csv file
  const handleImportCSV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      await API.post("/api/products/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showToast("CSV imported successfully", "success");
      fetchProducts();
    } catch (error) {
      showToast("Failed to import CSV", error.message);
    }

    event.target.value = "";
  };

  // export all products as csv file
  const handleExportCSV = async () => {
    try {
      const response = await API.get("/api/products/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast("CSV exported successfully", "success");
    } catch (error) {
      showToast("Failed to export CSV", error.message);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
  };

  // get products from server
  useEffect(() => {
    fetchProducts();
  }, []);

  // get searched products
  useEffect(() => {
    filterProducts();
  }, [selectedCategory, products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[180px]"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleImportCSV}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Upload className="w-5 h-5" />
          Import CSV
        </button>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <ProductTable
        products={filteredProducts}
        onUpdate={handleUpdate}
        onRowClick={handleRowClick}
      />

      {selectedProduct && (
        <HistorySidebar
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
