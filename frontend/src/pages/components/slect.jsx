import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import categories from "../data/categories.json";

// Utility function: lowercase and remove parentheses
function formatCategoryName(name) {
  return name.replace(/\(.*?\)/g, "").trim().toLowerCase();
}

export default function CategorySelector() {
  const [selectedCategory, setSelectedCategory] = useState({
    level1: null,
    level2: null,
    level3: null,
  });



  const handleSelect = (level, item) => {
    setSelectedCategory((prev) => {
      const newSelection = { ...prev, [level]: item };
      if (level === "level1") {
        newSelection.level2 = null;
        newSelection.level3 = null;
      } else if (level === "level2") {
        newSelection.level3 = null;
      }
      toast.success(`Selected: ${formatCategoryName(item.name)}`);
      return newSelection;
    });
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 shadow-md rounded-lg bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Select Category
        </h3>

        {/* Level 1 */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Level 1</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleSelect("level1", cat)}
                className={`px-3 py-1 border rounded-full flex items-center gap-1 transition-colors ${
                  selectedCategory.level1?.name === cat.name
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                }`}
              >
                {formatCategoryName(cat.name)}
                {selectedCategory.level1?.name === cat.name && (
                  <Check className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Level 2 */}
        {selectedCategory.level1?.sub_items?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Level 2</p>
            <div className="flex flex-wrap gap-2">
              {selectedCategory.level1.sub_items.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => handleSelect("level2", sub)}
                  className={`px-3 py-1 border rounded-full flex items-center gap-1 transition-colors ${
                    selectedCategory.level2?.name === sub.name
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
                >
                  {formatCategoryName(sub.name)}
                  {selectedCategory.level2?.name === sub.name && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Level 3 */}
        {selectedCategory.level2?.items?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Level 3</p>
            <div className="flex flex-wrap gap-2">
              {selectedCategory.level2.items.map((subsub) => (
                <button
                  key={subsub.name}
                  onClick={() => handleSelect("level3", subsub)}
                  className={`px-3 py-1 border rounded-full flex items-center gap-1 transition-colors ${
                    selectedCategory.level3?.name === subsub.name
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
                >
                  {formatCategoryName(subsub.name)}
                  {selectedCategory.level3?.name === subsub.name && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected summary */}
        <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
          <p className="text-sm text-gray-600">Selected Category:</p>
          <p className="text-gray-900 font-medium">
            {formatCategoryName(selectedCategory.level1?.name || "-")} {" > "}{" "}
            {formatCategoryName(selectedCategory.level2?.name || "-")} {" > "}{" "}
            {formatCategoryName(selectedCategory.level3?.name || "-")}
          </p>
        </div>
      </div>
    </div>
  );
}
