import React, { useEffect, useMemo, useState } from "react";

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
  btwOpVoorschot: emptyNumRec(),
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
  bedragStrafpunten: emptyNumRec(),
  heffingenBijdragen: emptyNumRec(),
  totaalMelkgeld: emptyNumRec(),
  btwMelkgeld: emptyNumRec(),
  btwHeffingenBijdragen: emptyNumRec(),
  totaalOntvangen: emptyNumRec(),
  totaalOntvangenViaVoorschot: emptyNumRec(),
  totaalOntvangenViaAfrekening: emptyNumRec(),
});

const INPUT_ROWS = [
  "liters",
  "vetgehalte",
  "eiwitgehalte",
  "voorschotOntvangen",
  "btwOpVoorschot",
  "kwaliteitsPremie",
  "ikmPremie",
  "hoeveelheidspremie",
  "getrouwheidspremie",
  "anderePremies",
  "ophaalKostenFabriek",
  "bedragStrafpunten",
  "heffingenBijdragen",
  "melkgeldVet",
  "melkgeldEiwit",
  "negatieveGrondstofprijs",
  "btwMelkgeld",
  "btwHeffingenBijdragen"
];

const LABEL = {
  liters: "Liters",
  vetgehalte: "Vetgehalte (%)",
  eiwitgehalte: "Eiwitgehalte (%)",
  voorschotOntvangen: "Ontvangen voorschot",
  btwOpVoorschot: "BTW op voorschot",
  voorschotOntvangenInclBTW:"Ontvangen voorschot incl. BTW",
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
  bedragStrafpunten: "Bedrag strafpunten",
  heffingenBijdragen: "Heffingen/bijdragen",
  totaalMelkgeld: "Totaal melkgeld",
  btwMelkgeld: "BTW melkgeld",
  btwHeffingenBijdragen: "BTW heffingen/bijdragen",
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
  "btwHeffingenBijdragen",
];

const ROWS_ORDER = [
  "liters",
  "vetgehalte",
  "eiwitgehalte",
  "voorschotOntvangen",
  "btwOpVoorschot",
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
  "bedragStrafpunten",
  "heffingenBijdragen",
  "totaalMelkgeld",
  "btwMelkgeld",
  "btwHeffingenBijdragen",
  "totaalOntvangen",
  "totaalOntvangenViaVoorschot",
  "totaalOntvangenViaAfrekening",
];

// --- Component -------------------------------------------------------------
export default function MilkPayoutSheet() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem("milk-sheet");
      if (raw) return JSON.parse(raw);
    } catch {}
    return baseState();
  });
  
  useEffect(() => {
    localStorage.setItem("milk-sheet", JSON.stringify(data));
  }, [data]);


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
        (data.bedragStrafpunten[m] || 0);

      const heffingen = data.heffingenBijdragen[m] || 0;

      d.totaalMelkgeld[m] = d.totaalBasisMelkgeld[m] + premies - kosten - heffingen;
      d.voorschotOntvangenInclBTW[m] = d.voorschotOntvangen[m] + d.btwOpVoorschot[m];
      d.btwHeffingenBijdragen[m] = heffingen ;

      d.totaalOntvangen[m] =
        d.totaalMelkgeld[m] +
        d.btwMelkgeld[m] -
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
    <div className="w-full overflow-auto">
      <div className="border shadow-sm">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            <tr>
              <th className="w-64 border-b p-3 text-left">&nbsp;</th>
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
                            defaultValue={data[rowKey][m] || 0.00}
                            onBlur={(e) =>
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
  );
}
