import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

// Crop names (fixed order)
const cropNames = [
  "Snijmais",
  "Snijmais verkoop",
  "CCM eigen gebruik",
  "CCM verkoop",
  "MKS eigen gebruik",
  "Energiemais",
  "Tussenteelt gras",
  "Grasland",
  "Luzerne",
  "Andere voedergewassen",
  "Suikerbieten",
  "Aardappelen",
  "Trticale",
  "Tarwe",
  "Gerst",
  "Rogge",
  "Braak"
];

// Convert array to object with area=0
const initialData = cropNames.reduce((acc, crop) => {
  acc[crop] = 0;
  return acc;
}, {});

export default function CropTable({ categoryIdentifier }) {
  const [data, setData] = useState(initialData);
  const [baseline, setBaseline] = useState(initialData);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`);
      if (res.data && res.data.data && res.data.data.length > 0) {
        const serverData = { ...initialData, ...res.data.data[0] || [] }; // Merge to keep cropNames order
        delete serverData["id"];
        delete serverData["source_doc"];
        delete serverData["category_identifier"];
        setData(serverData);
        setBaseline(serverData);
      }
    } catch (err) {
      toast.error("Failed to load crop data");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryIdentifier]);

  // Detect changes
  useEffect(() => {
    const changed = JSON.stringify(data) !== JSON.stringify(baseline);
    setHasChanges(changed);
  }, [data, baseline]);

  const handleAreaChange = (crop, value) => {
    setData(prev => ({
      ...prev,
      [crop]: Number(value)
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        category_identifier: categoryIdentifier,
        data: [{ ...data, category_identifier: categoryIdentifier, source_doc: "", id: 123 }],
      };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/`, payload);
      setBaseline({ ...data });
      setHasChanges(false);
      toast.success("Changes saved successfully!");
    } catch (err) {
      toast.error("Failed to save crop data");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setData({ ...baseline });
    setHasChanges(false);
    toast("Changes canceled.");
  };

  const totalArea = Object.values(data).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      <div className="card p-6 shadow-md rounded-lg bg-white">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-blue-800"></h1>
          <div className="flex gap-2">
            {hasChanges && (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-900 px-2 py-1 rounded transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-900 px-2 py-1 rounded transition-colors"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Hoofdteelt</th>
                <th className="px-4 py-2 text-right">Ha</th>
              </tr>
            </thead>
            <tbody>
              {cropNames.map((crop, idx) => (
                <tr key={crop} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2">{crop}</td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      value={data[crop]}
                      onChange={(e) => handleAreaChange(crop, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-bold">
              <tr>
                <td className="px-4 py-2">Total</td>
                <td className="px-4 py-2 text-right">{totalArea.toFixed(2)} ha</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
