import React, { useState , useEffect} from "react";
import { Save, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function StallplaatsenForm({ categoryIdentifier }) {
  const [data, setData] = useState({
    melkkoeien: 0,
    jongvee: 0,
  });

  const [baseline, setBaseline] = useState({ ...data });
  const [hasChanges, setHasChanges] = useState(false);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`);
        const serverData = res.data.data[0];
        setData(serverData);
        setBaseline(serverData);

      } catch { }

    };
    load();
  }, [categoryIdentifier]);
  const handleChange = (field, value) => {
    const newData = { ...data, [field]: Number(value) || 0 };
    setData(newData);
    setHasChanges(JSON.stringify(newData) !== JSON.stringify(baseline));
  };

  const handleSave = async () => {
    try {
      const payload = {
        category_identifier: categoryIdentifier,
        data: [{ ...data, category_identifier: categoryIdentifier, source_doc: "", id: 123324234 }],
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/`, payload);
      setBaseline({ ...data });
      setHasChanges(false);
      toast.success("Changes saved successfully!");
    } catch (err) {
      toast.error("Failed to save data");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setData({ ...baseline });
    setHasChanges(false);
    toast("Changes canceled.");
  };

  const renderRow = (label, field, suffix) => (
    <div className="grid grid-cols-[auto_120px_auto] items-center gap-2 py-1">
      <span className="font-semibold text-sm text-gray-800">{label}</span>
      <input
        type="number"
        className="border px-2 py-1 w-full bg-green-100 text-right rounded"
        value={data[field]}
        onChange={(e) => handleChange(field, e.target.value)}
      />
      <span className="text-sm text-gray-700">{suffix}</span>
    </div>
  );

  return (
    <div className="card p-6 shadow-md rounded-lg bg-white w-full max-w-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Stalplaatsen</h3>
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

      <div className="space-y-2">
        {renderRow("Aantal stalplaatsen melkkoeien", "melkkoeien", "plaatsen (incl. droge koeien)")}
        {renderRow("Aantal stalplaatsen jongvee", "jongvee", "plaatsen")}
      </div>
    </div>
  );
}
