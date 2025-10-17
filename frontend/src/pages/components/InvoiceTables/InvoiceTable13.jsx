import React, { useEffect, useMemo, useState } from "react";
import { Save, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
/**
 * MilkPayoutSheet — single-file React component (JS version)
 * - Green cells are editable user inputs
 * - Grey cells are auto-calculated
 * - Totals column at the right aggregates Jan–Dec
 * - VAT (BTW) is configurable (defaults to 21%)
 *
 * Drop this component anywhere in your app. Tailwind recommended.
 */

// --- Helpers ---------------------------------------------------------------
const months = [
  "Januari",
  "Februari",
  "Maart",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Augustus",
  "September",
  "Oktober",
  "November",
  "December",
];

const emptyNumRec = () =>
  Object.fromEntries(months.map((m) => [m, 0]));

const fmt = (n) =>
  isFinite(n)
    ? n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    : "";

const parseNum = (v) => {
  const x = Number(String(v).replace(/[^0-9+\-.,]/g, "").replace(",", "."));
  return isFinite(x) ? x : 0;
};

// --- Config ----------------------------------------------------------------
const DEFAULTS = {
  prijsPerVetPuntPer100L: 1.0, // € per % vet per 100L
  prijsPerEiwitPuntPer100L: 1.5, // € per % eiwit per 100L
};

// --- Rows ------------------------------------------------------------------
const baseState = () => ({
  liters: emptyNumRec(),
  vetgehalte: emptyNumRec(),
  eiwitgehalte: emptyNumRec(),
  voorschotOntvangen: emptyNumRec(),
  BTWOpVoorschot: emptyNumRec(),
  voorschotOntvangenInclBTW: emptyNumRec(),
  melkgeldVet: emptyNumRec(),
  melkgeldEiwit: emptyNumRec(),
  negatieveGrondstofprijs: emptyNumRec(),
  totaalBasisMelkgeld: emptyNumRec(),
  kwaliteitsPremie: emptyNumRec(),
  ikmPremie: emptyNumRec(),
  hoeveelheidspremie: emptyNumRec(),
  getrouwheidspremie: emptyNumRec(),
  anderePremies: emptyNumRec(),
  ophaalKostenFabriek: emptyNumRec(),
  BedragStrafpunten: emptyNumRec(),
  heffingenBijdragen: emptyNumRec(),
  totaalMelkgeld: emptyNumRec(),
  BTWMelkgeld: emptyNumRec(),
  BTWHeffingenBijdragen: emptyNumRec(),
  totaalOntvangen: emptyNumRec(),
  totaalOntvangenViaVoorschot: emptyNumRec(),
  totaalOntvangenViaAfrekening: emptyNumRec(),
});

const INPUT_ROWS = [
  "liters",
  "vetgehalte",
  "eiwitgehalte",
  "voorschotOntvangen",
  "BTWOpVoorschot",
  "kwaliteitsPremie",
  "ikmPremie",
  "hoeveelheidspremie",
  "getrouwheidspremie",
  "anderePremies",
  "ophaalKostenFabriek",
  "BedragStrafpunten",
  "heffingenBijdragen",
  "melkgeldVet",
  "melkgeldEiwit",
  "negatieveGrondstofprijs",
  "BTWMelkgeld",
  "BTWHeffingenBijdragen"
];

const LABEL = {
  liters: "Liters",
  vetgehalte: "Vetgehalte (%)",
  eiwitgehalte: "Eiwitgehalte (%)",
  voorschotOntvangen: "Ontvangen voorschot",
  BTWOpVoorschot: "BTW op voorschot",
  voorschotOntvangenInclBTW: "Ontvangen voorschot incl. BTW",
  melkgeldVet: "Melkgeld vet",
  melkgeldEiwit: "Melkgeld eiwit",
  negatieveGrondstofprijs: "Negatieve grondstofprijs",
  totaalBasisMelkgeld: "Totaal basis melkgeld",
  kwaliteitsPremie: "Kwaliteits Premie (AA, …)",
  ikmPremie: "IKM Premie",
  hoeveelheidspremie: "Hoeveelheidspremie",
  getrouwheidspremie: "Getrouwheidspremie",
  anderePremies: "Andere premies",
  ophaalKostenFabriek: "(Ophaal)kosten fabriek",
  BedragStrafpunten: "Bedrag strafpunten",
  heffingenBijdragen: "Heffingen/bijdragen",
  totaalMelkgeld: "Totaal melkgeld",
  BTWMelkgeld: "BTW melkgeld",
  BTWHeffingenBijdragen: "BTW heffingen/bijdragen",
  totaalOntvangen: "Totaal ontvangen",
  totaalOntvangenViaVoorschot: "Totaal ontvangen — Via voorschot",
  totaalOntvangenViaAfrekening: "Totaal ontvangen — Via afrekening",
};

const SECTION_BREAK_AFTER = [
  "eiwitgehalte",
  "voorschotOntvangenInclBTW",
  "totaalBasisMelkgeld",
  "anderePremies",
  "heffingenBijdragen",
  "BTWHeffingenBijdragen",
];

const ROWS_ORDER = [
  "liters",
  "vetgehalte",
  "eiwitgehalte",
  "voorschotOntvangen",
  "BTWOpVoorschot",
  "voorschotOntvangenInclBTW",
  "melkgeldVet",
  "melkgeldEiwit",
  "negatieveGrondstofprijs",
  "totaalBasisMelkgeld",
  "kwaliteitsPremie",
  "ikmPremie",
  "hoeveelheidspremie",
  "getrouwheidspremie",
  "anderePremies",
  "ophaalKostenFabriek",
  "BedragStrafpunten",
  "heffingenBijdragen",
  "totaalMelkgeld",
  "BTWMelkgeld",
  "BTWHeffingenBijdragen",
  "totaalOntvangen",
  "totaalOntvangenViaVoorschot",
  "totaalOntvangenViaAfrekening",
];

// --- Component -------------------------------------------------------------
export default function MilkPayoutSheet({ categoryIdentifier }) {
  const [data, setData] = useState(() => baseState());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [baseline, setBaseline] = useState(() => baseState());
  const [hasChanges, setHasChanges] = useState(false);

  // derive hasChanges by comparing to baseline
  useEffect(() => {
    const changed = JSON.stringify(data) !== JSON.stringify(baseline);
    setHasChanges(changed);
  }, [data, baseline]);

  // Load from backend once on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            try {
              if (json.data.length > 0) {

                const serverData = json.data[0];
                setData(serverData);
                setBaseline(serverData);

              }
            } catch {
              console.log("xxxxxxxxxxxxxxxxxxx")
            }
          }
        }
      } catch { }
      finally { setLoading(false); }
    };
    load();
  }, [categoryIdentifier]);

  const saveToServer = async () => {
    try {
      setSaving(true);
      const payload = {
        category_identifier: categoryIdentifier,
        data: [{ ...data, category_identifier: categoryIdentifier, source_doc: "", id: 123324234 }],
      };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/`, payload);
      setBaseline(data);
      setHasChanges(false);
      toast.success("Changes saved successfully!");
    } catch {
      toast.error("Failed to save invoices");
    }
    finally { setSaving(false); }
  };

  const cancelChanges = () => {
    setData(baseline);
    setHasChanges(false);
    toast("Changes canceled.");
  };


  const calculated = useMemo(() => {

    const d = baseState();
    Object.assign(d, data);

    months.forEach((m) => {

      d.totaalBasisMelkgeld[m] =
        d.melkgeldVet[m] +
        d.melkgeldEiwit[m] +
        (data.negatieveGrondstofprijs[m] || 0);

      const premies =
        (data.kwaliteitsPremie[m] || 0) +
        (data.ikmPremie[m] || 0) +
        (data.hoeveelheidspremie[m] || 0) +
        (data.getrouwheidspremie[m] || 0) +
        (data.anderePremies[m] || 0);

      const kosten =
        (data.ophaalKostenFabriek[m] || 0) +
        (data.BedragStrafpunten[m] || 0);

      const heffingen = data.heffingenBijdragen[m] || 0;

      d.totaalMelkgeld[m] = d.totaalBasisMelkgeld[m] + premies - kosten - heffingen;
      d.voorschotOntvangenInclBTW[m] = d.voorschotOntvangen[m] + d.BTWOpVoorschot[m];
      d.BTWHeffingenBijdragen[m] = heffingen;

      d.totaalOntvangen[m] =
        d.totaalMelkgeld[m] +
        d.BTWMelkgeld[m] -
        heffingen;

      d.totaalOntvangenViaVoorschot[m] = d.voorschotOntvangenInclBTW[m]
      d.totaalOntvangenViaAfrekening[m] = d.totaalOntvangen[m] - d.totaalOntvangenViaVoorschot[m]

    });

    return d;
  }, [data]);

  const isInputRow = (key) => INPUT_ROWS.includes(key);
  const colTotal = (row) =>
    months.reduce((sum, m) => sum + (row[m] || 0), 0);

  const handleChange = (row, m, value) => {
    if (!isInputRow(row)) return;

    setData((prev) => ({
      ...prev,
      [row]: { ...prev[row], [m]: parseNum(value) },
    }));

  };

  return (
    <div className="space-y-6">
      <div className="card p-6 shadow-md rounded-lg bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{categoryIdentifier}</h3>
          <div className="flex gap-2 items-center">
            {loading && <span className="text-xs text-gray-500">Loading…</span>}
            {hasChanges && (
              <>
                <button
                  onClick={cancelChanges}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-900 px-2 py-1 rounded transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
                <button
                  onClick={saveToServer}
                  disabled={saving}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-900 px-2 py-1 rounded transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-1" />
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="w-full overflow-auto">
          <div className="border shadow-sm">
            <table className="w-full table-fixed border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-white">
                <tr>
                  <th className="w-40 border-b p-3 text-left">&nbsp;</th>
                  {months.map((m) => (
                    <th
                      key={m}
                      className="border-b p-3 text-right font-medium"
                    >
                      {m}
                    </th>
                  ))}

                </tr>
              </thead>
              <tbody>
                {ROWS_ORDER.map((rowKey) => {
                  const row = calculated[rowKey];
                  const editable = isInputRow(rowKey);
                  const afterBreak = SECTION_BREAK_AFTER.includes(rowKey);

                  return (
                    <React.Fragment key={rowKey}>
                      <tr className="odd:bg-white even:bg-slate-50">
                        <td className="border-b p-2 pr-4 font-medium">
                          {LABEL[rowKey]}
                        </td>
                        {months.map((m) => (
                          <td key={m} className="border-b p-1 text-right">
                            {editable ? (
                              <input
                                type="number"
                                step="0.01"
                                value={data[rowKey][m] ?? 0}
                                onChange={(e) =>
                                  handleChange(rowKey, m, e.target.value)
                                }
                                className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-md bg-green-100 px-2 py-1 text-right outline-none focus:ring"
                              />
                            ) : (
                              <span className="block select-none rounded-md bg-slate-100 px-2 py-1">
                                {fmt(row[m] || 0)}
                              </span>
                            )}
                          </td>
                        ))}

                      </tr>
                      {afterBreak && (
                        <tr>
                          <td
                            colSpan={months.length + 1}
                            className="bg-white p-1"
                          >
                            <div className="my-1 h-px w-full bg-slate-300" />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
