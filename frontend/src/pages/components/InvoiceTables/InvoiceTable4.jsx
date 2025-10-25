import React, { useState, useEffect } from "react";
import { Trash2, Plus, Save, X, DollarSign, Factory, Briefcase, Users, Building2, TrendingUp, Eye } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function InvoiceTable({ categoryIdentifier }) {
  const [invoices, setInvoices] = useState([]);
  const [draftInvoices, setDraftInvoices] = useState([]);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });
  const [hasChanges, setHasChanges] = useState(false);
  const [percentages, setPercentages] = useState({
    MK: '',
    JV: '',
    MV: '',
    ZK: ''
  });
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Load invoices from backend
  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`);
      // Add calculated BedragIncl field
      const data = res.data.data.map(inv => ({
        source_doc: inv.source_doc,
        ...inv,
        BedragIncl: +(Number(inv.Bedrag || 0) + Number(inv.Bedrag || 0) * (Number(inv.BTW || 0) / 100)).toFixed(2),
        Verschil: +((Number(inv.MK || 0) + Number(inv.JV || 0) + Number(inv.MV || 0) + Number(inv.ZK || 0)) - Number(inv.Bedrag || 0)).toFixed(2)
      }));
      setInvoices(data);
      setDraftInvoices(data);
    } catch (err) {
      toast.error("Failed to load invoices");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [categoryIdentifier]);

  const handleDoubleClick = (id, field) => setEditingCell({ id, field });
  const handleBlur = () => setEditingCell({ id: null, field: null });

  const handleChange = (id, field, value) => {
    setDraftInvoices(prev =>
      prev.map(inv => {
        if (inv.id === id) {
          const updated = { ...inv, [field]: value };
          const amountNum = parseFloat(updated.Bedrag) || 0;
          const vatPerc = parseFloat(updated.BTW) || 0;
          const mk = parseFloat(updated.MK) || 0;
          const jv = parseFloat(updated.JV) || 0;
          const mv = parseFloat(updated.MV) || 0;
          const zk = parseFloat(updated.ZK) || 0;
          updated.BTW = vatPerc;
          updated.BedragIncl = +(amountNum + amountNum * (vatPerc / 100)).toFixed(2);
          updated.Verschil = +((mk + jv + mv + zk - amountNum)).toFixed(2);

          return updated;
        }
        return inv;
      })
    );
    setHasChanges(true);
  };

  const handleRemove = id => {
    setDraftInvoices(prev => prev.filter(inv => inv.id !== id));
    setHasChanges(true);
    toast("Item removed.");
  };

  const handleView = (invoice) => {
    // Display the PDF file from source_doc
    if (invoice.source_doc) {
      const pdfUrl = `${import.meta.env.VITE_API_BASE_URL}/${invoice.source_doc}`;
      // Open PDF in a new tab
      window.open(pdfUrl, '_blank');
    } else {
      toast.error("No PDF file available for this item");
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      category_identifier: categoryIdentifier,
      source_doc: "",
      Datum: "",
      Omschrijving: "",
      MK: null,
      JV: null,
      MV: null,
      ZK: null,
      Bedrag: 0,
      BTW: 21,
      BedragIncl: 0,
      Verschil: 0
    };
    setDraftInvoices(prev => [...prev, newItem]);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      // Send to backend using backend keys
      const payload = draftInvoices.map(({ BedragIncl, ...rest }) => rest);
      await axios.post(import.meta.env.VITE_API_BASE_URL + "/api/invoice/", {
        category_identifier: categoryIdentifier,
        data: payload,
      });
      setInvoices(draftInvoices);
      setHasChanges(false);
      toast.success("Changes saved successfully!");
    } catch (err) {
      toast.error("Failed to save invoices");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setDraftInvoices(invoices);
    setHasChanges(false);
    toast("Changes canceled.");
  };

  const handlePercentageChange = (field, value) => {
    setPercentages(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemSelection = (itemId, isSelected) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allIds = draftInvoices.map(invoice => invoice.id);
    setSelectedItems(new Set(allIds));
  };

  const handleSelectNone = () => {
    setSelectedItems(new Set());
  };

  const handleSetPercentages = () => {
    const mkPercent = parseFloat(percentages.MK) || 0;
    const jvPercent = parseFloat(percentages.JV) || 0;
    const mvPercent = parseFloat(percentages.MV) || 0;
    const zkPercent = parseFloat(percentages.ZK) || 0;

    if (mkPercent === 0 && jvPercent === 0 && mvPercent === 0 && zkPercent === 0) {
      toast.error("Please enter at least one percentage value");
      return;
    }

    if (selectedItems.size === 0) {
      toast.error("Please select at least one item");
      return;
    }

    setDraftInvoices(prev =>
      prev.map(invoice => {
        // Only apply to selected items
        if (!selectedItems.has(invoice.id)) {
          return invoice;
        }

        const bedrag = parseFloat(invoice.Bedrag) || 0;
        const updated = { ...invoice };

        if (mkPercent > 0) updated.MK = (bedrag * mkPercent / 100).toFixed(2);
        if (jvPercent > 0) updated.JV = (bedrag * jvPercent / 100).toFixed(2);
        if (mvPercent > 0) updated.MV = (bedrag * mvPercent / 100).toFixed(2);
        if (zkPercent > 0) updated.ZK = (bedrag * zkPercent / 100).toFixed(2);

        // Recalculate BedragIncl and Verschil
        const amountNum = parseFloat(updated.Bedrag) || 0;
        const vatPerc = parseFloat(updated.BTW) || 0;
        const mk = parseFloat(updated.MK) || 0;
        const jv = parseFloat(updated.JV) || 0;
        const mv = parseFloat(updated.MV) || 0;
        const zk = parseFloat(updated.ZK) || 0;

        updated.BedragIncl = +(amountNum + amountNum * (vatPerc / 100)).toFixed(2);
        updated.Verschil = +((mk + jv + mv + zk - amountNum)).toFixed(2);

        return updated;
      })
    );
    setHasChanges(true);
    toast.success(`Percentages applied to ${selectedItems.size} selected item(s)`);
  };
  // Totals
  const totalExcl = draftInvoices.reduce((sum, inv) => sum + Number(inv.Bedrag || 0), 0);
  const totalIncl = draftInvoices.reduce((sum, inv) => sum + Number(inv.BedragIncl || 0), 0);

  const totalMK = draftInvoices.reduce((sum, inv) => sum + Number(inv.MK || 0), 0);
  const totalJV = draftInvoices.reduce((sum, inv) => sum + Number(inv.JV || 0), 0);
  const totalMV = draftInvoices.reduce((sum, inv) => sum + Number(inv.MV || 0), 0);
  const totalZK = draftInvoices.reduce((sum, inv) => sum + Number(inv.ZK || 0), 0);


  return (
    <div className="space-y-6">
      {/* Main invoice table card */}
      <div className="card p-6 shadow-md rounded-lg bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
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
            <button
              onClick={handleAddItem}
              className="flex items-center text-sm text-gray-500 hover:text-gray-900 px-2 py-1 rounded transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>
        </div>

        {/* Percentage Input Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4 mb-3">
            <h4 className="text-sm font-medium text-gray-700">Set Percentages:</h4>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600">MK %:</label>
              <input
                type="number"
                step="1"
                value={percentages.MK}
                onChange={(e) => handlePercentageChange('MK', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600">JV %:</label>
              <input
                type="number"
                step="1"
                value={percentages.JV}
                onChange={(e) => handlePercentageChange('JV', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600">MV %:</label>
              <input
                type="number"
                step="1"
                value={percentages.MV}
                onChange={(e) => handlePercentageChange('MV', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600">ZK %:</label>
              <input
                type="number"
                step="1"
                value={percentages.ZK}
                onChange={(e) => handlePercentageChange('ZK', e.target.value)}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <button
              onClick={handleSetPercentages}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Set
            </button>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={handleSelectNone}
                className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
              >
                Select None
              </button>
            </div>
            <span className="text-xs text-gray-600">
              {selectedItems.size} of {draftInvoices.length} items selected
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Enter percentages to automatically calculate MK, JV, MV, ZK values based on Bedrag for selected items only.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 table-header text-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === draftInvoices.length && draftInvoices.length > 0}
                    onChange={(e) => e.target.checked ? handleSelectAll() : handleSelectNone()}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="w-1/6 table-header">Category ID</th>
                <th className="w-1/6 table-header text-right">Datum</th>
                <th className="w-1/4 table-header">Supplier</th>
                <th className="w-1/4 table-header">Omschrijving</th>
                <th className="w-1/6 table-header text-right">MK</th>
                <th className="w-1/6 table-header text-right">JV</th>
                <th className="w-1/6 table-header text-right">MV</th>
                <th className="w-1/6 table-header text-right">ZK</th>
                <th className="w-1/6 table-header text-right">Bedrag</th>
                <th className="w-1/12 table-header text-right">BTW %</th>
                <th className="w-1/6 table-header text-right">BTW Bedrag</th>
                <th className="w-1/6 table-header text-right">Verschil </th>
                <th className="w-1/12 table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {draftInvoices.map(invoice => (
                <tr key={invoice.id} className={`hover:bg-gray-50 transition-colors duration-150 ${selectedItems.has(invoice.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(invoice.id)}
                      onChange={(e) => handleItemSelection(invoice.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  {["category_identifier", "Datum", "Supplier", "Omschrijving", "MK", "JV", "MV", "ZK", "Bedrag", "BTW"].map(field => (
                    <td
                      key={field}
                      className={`px-3 py-2 text-sm text-right`}
                      onDoubleClick={() => handleDoubleClick(invoice.id, field)}
                    >
                      {editingCell.id === invoice.id && editingCell.field === field ? (
                        <input
                          type={field === "Bedrag" || field === "BTW" ? "number" : "text"}
                          autoFocus
                          onBlur={handleBlur}
                          value={invoice[field] ? invoice[field] : ""}
                          onChange={e => handleChange(invoice.id, field, e.target.value)}
                          className="w-full border border-blue-400 rounded px-2 py-1 text-sm text-right focus:outline-none box-border"
                        />
                      ) : field === "Bedrag" || field === "BTW" ? (
                        invoice[field]
                      ) : (
                        invoice[field]
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right font-semibold">€{(invoice.BedragIncl - invoice.Bedrag).toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-semibold">€{invoice.Verschil.toFixed(2)}</td>


                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(invoice)}
                        className="p-1 text-blue-600 hover:text-blue-800 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(invoice.id)}
                        className="p-1 text-red-600 hover:text-red-800 rounded transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals dashboard card */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">


        {/* Total MK */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <Factory className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total MK</p>
            <p className="text-lg font-semibold text-gray-900">{totalMK.toFixed(2)}</p>
          </div>
        </div>

        {/* Total JV */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total JV</p>
            <p className="text-lg font-semibold text-gray-900">{totalJV.toFixed(2)}</p>
          </div>
        </div>

        {/* Total MV */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total MV</p>
            <p className="text-lg font-semibold text-gray-900">{totalMV.toFixed(2)}</p>
          </div>
        </div>

        {/* Total ZK */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-pink-100 text-pink-600 mr-4">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total ZK</p>
            <p className="text-lg font-semibold text-gray-900">{totalZK.toFixed(2)}</p>
          </div>
        </div>

        {/* Bedrag (excl)[EUR] */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Bedrag (excl)[EUR]</p>
            <p className="text-lg font-semibold text-gray-900">€{totalExcl.toFixed(2)}</p>
          </div>
        </div>

        {/* BTW Bedrag[EUR] */}
        <div className="flex items-center p-4 bg-white shadow rounded-lg">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">BTW Bedrag[EUR]</p>
            <p className="text-lg font-semibold text-gray-900">€{(totalIncl - totalExcl).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
