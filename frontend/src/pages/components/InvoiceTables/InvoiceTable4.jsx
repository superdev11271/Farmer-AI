import React, { useState, useEffect } from "react";
import { Trash2, Plus, Save, X, DollarSign, Scale, Factory, Briefcase, Users, Building2, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function InvoiceTable({ categoryIdentifier }) {
  const [invoices, setInvoices] = useState([]);
  const [draftInvoices, setDraftInvoices] = useState([]);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });
  const [hasChanges, setHasChanges] = useState(false);

  // Load invoices from backend
  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`);
      // Add calculated BedragIncl field
      const data = res.data.map(inv => ({
        ...inv,
        BedragIncl: +(Number(inv.bedrag || 0) + Number(inv.bedrag || 0) * (Number(inv.btw || 0) / 100)).toFixed(2),
        Verschil: +((Number(inv.mk || 0) + Number(inv.jv || 0) + Number(inv.mv || 0) + Number(inv.zk || 0)) - Number(inv.bedrag || 0)).toFixed(2)
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
          const amountNum = parseFloat(updated.bedrag) || 0;
          const vatPerc = parseFloat(updated.btw) || 0;
          const mk = parseFloat(updated.mk) || 0;
          const jv = parseFloat(updated.jv) || 0;
          const mv = parseFloat(updated.mv) || 0;
          const zk = parseFloat(updated.zk) || 0;
          updated.btw = vatPerc;
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

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      category_identifier: categoryIdentifier,
      source_doc: "",
      datum: "",
      omschrijving: "",
      kg: null,
      mk: null,
      jv: null,
      mv: null,
      zk: null,
      bedrag: 0,
      btw: 21,
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
        items: payload,
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
  // Totals
  const totalExcl = draftInvoices.reduce((sum, inv) => sum + Number(inv.bedrag || 0), 0);
  const totalIncl = draftInvoices.reduce((sum, inv) => sum + Number(inv.BedragIncl || 0), 0);

  const totalMK = draftInvoices.reduce((sum, inv) => sum + Number(inv.mk || 0), 0);
  const totalJV = draftInvoices.reduce((sum, inv) => sum + Number(inv.jv || 0), 0);
  const totalMV = draftInvoices.reduce((sum, inv) => sum + Number(inv.mv || 0), 0);
  const totalZK = draftInvoices.reduce((sum, inv) => sum + Number(inv.zk || 0), 0);


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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/6 table-header">Category ID</th>
                <th className="w-1/3 table-header">Source Doc</th>
                <th className="w-1/6 table-header text-right">Datum</th>
                <th className="w-1/4 table-header">Omschrijving</th>
                <th className="w-1/6 table-header text-right">MK</th>
                <th className="w-1/6 table-header text-right">JV</th>
                <th className="w-1/6 table-header text-right">MV</th>
                <th className="w-1/6 table-header text-right">ZK</th>
                <th className="w-1/6 table-header text-right">Bedrag</th>
                <th className="w-1/12 table-header text-right">BTW %</th>
                <th className="w-1/6 table-header text-right">Bedrag Incl.</th>
                <th className="w-1/6 table-header text-right">Verschil </th>
                <th className="w-1/12 table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {draftInvoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-150">
                  {["category_identifier", "source_doc", "datum", "omschrijving", "mk", "jv", "mv", "zk", "bedrag", "btw"].map(field => (
                    <td
                      key={field}
                      className={`px-3 py-2 text-sm text-right`}
                      onDoubleClick={() => handleDoubleClick(invoice.id, field)}
                    >
                      {editingCell.id === invoice.id && editingCell.field === field ? (
                        <input
                          type={field === "bedrag" || field === "btw" ? "number" : "text"}
                          autoFocus
                          onBlur={handleBlur}
                          value={invoice[field] ? invoice[field] : ""}
                          onChange={e => handleChange(invoice.id, field, e.target.value)}
                          className="w-full border border-blue-400 rounded px-2 py-1 text-sm text-right focus:outline-none box-border"
                        />
                      ) : field === "bedrag" || field === "btw" ? (
                        invoice[field]
                      ) : (
                        invoice[field]
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right font-semibold">€{invoice.BedragIncl.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-semibold">€{invoice.Verschil.toFixed(2)}</td>


                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleRemove(invoice.id)}
                      className="p-1 text-red-600 hover:text-red-800 rounded transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
            <p className="text-lg font-semibold text-gray-900">€{totalIncl.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
