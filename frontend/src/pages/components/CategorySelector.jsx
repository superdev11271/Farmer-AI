import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import categories from "../../data/categories.json"; // Import your JSON directly

function formatCategoryName(name) {
  return name.replace(/\(.*?\)/g, "").trim().toLowerCase();
}

export default function CategorySelector({ setCurrentCategoryIdentifier }) {
  const [selectedCategory, setSelectedCategory] = useState({
    level1: null,
    level2: null,
    level3: null,
  });

  // Initialize default selection
  useEffect(() => {
    const l1 = categories[0];
    const l2 = l1.sub_items.length > 0 ? l1.sub_items[0] : null;
    const l3 = l2?.items?.length > 0 ? l2.items[0] : null;
    setSelectedCategory({ level1: l1, level2: l2, level3: l3 });
  }, []);

  // Update parent whenever selection changes
  useEffect(() => {
    if (selectedCategory.level3) {
      setCurrentCategoryIdentifier(selectedCategory.level3.identifier);
    } else if (selectedCategory.level2) {
      setCurrentCategoryIdentifier(selectedCategory.level2.identifier);
    } else if (selectedCategory.level1) {
      setCurrentCategoryIdentifier(selectedCategory.level1.identifier);
    } else {
      setCurrentCategoryIdentifier(null);
    }
  }, [selectedCategory, setCurrentCategoryIdentifier]);

  const handleSelect = (level, item) => {
    setSelectedCategory((prev) => {
      const newSelection = { ...prev, [level]: item };
      if (level === "level1") {
        newSelection.level2 = item.sub_items.length > 0 ? item.sub_items[0] : null;
        newSelection.level3 =
          item.sub_items.length > 0 && item.sub_items[0].items.length > 0
            ? item.sub_items[0].items[0]
            : null;
      } else if (level === "level2") {
        newSelection.level3 = item.items.length > 0 ? item.items[0] : null;
      }
      return newSelection;
    });
    toast.success(`Selected: ${formatCategoryName(item.name)}`);
  };

  return (
    <div className="card p-6 shadow-md rounded-lg bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Select Category</h3>
      </div>

      {/* Three selects in one row */}
      <div className="flex gap-4 flex-wrap">
        {/* Level 1 */}
        <div className="flex-1 min-w-[150px]">
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring focus:ring-blue-200"
            value={selectedCategory.level1?.identifier || ""}
            onChange={(e) => {
              const selected = categories.find((cat) => cat.identifier === e.target.value);
              handleSelect("level1", selected);
            }}
          >
            {categories.map((cat, idx) => (
              <option key={cat.identifier || idx} value={cat.identifier}>
                {cat.identifier}: {formatCategoryName(cat.name)}
              </option>
            ))}
          </select>
        </div>

        {/* Level 2 */}
        <div className="flex-1 min-w-[150px]">
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring focus:ring-green-200"
            value={selectedCategory.level2?.identifier || ""}
            onChange={(e) => {
              const selected = selectedCategory.level1?.sub_items?.find(
                (sub) => sub.identifier === e.target.value
              );
              handleSelect("level2", selected);
            }}
            disabled={!selectedCategory.level1}
          >
            {selectedCategory.level1?.sub_items?.map((sub, idx) => (
              <option key={sub.identifier || idx} value={sub.identifier}>
                {formatCategoryName(sub.name)}
              </option>
            ))}
          </select>
        </div>

        {/* Level 3 */}
        <div className="flex-1 min-w-[150px]">
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring focus:ring-purple-200"
            value={selectedCategory.level3?.identifier || ""}
            onChange={(e) => {
              const selected = selectedCategory.level2?.items?.find(
                (subsub) => subsub.identifier === e.target.value
              );
              handleSelect("level3", selected);
            }}
            disabled={!selectedCategory.level2 || !selectedCategory.level2.items?.length}
          >
            {selectedCategory.level2?.items?.map((subsub, idx) => (
              <option key={subsub.identifier || idx} value={subsub.identifier}>
                {formatCategoryName(subsub.name)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
