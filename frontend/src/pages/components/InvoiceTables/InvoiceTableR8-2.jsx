import React, { useState } from "react";

export default function PrivateExpensesForm() {
  const [data, setData] = useState({
    ouders: {
      norm: "",
      lening: "",
      kleineRisico: "",
      ziektekosten: "",
      gewaarborgd: "",
      woning: "",
      pensioen: "",
      vapz: "",
      andere1: "",
      andere2: "",
    },
    kinderen: {
      norm: "",
      studiekosten: "",
      kinderbijslag: "",
      studietoelage: "",
    },
    priveInkomen: ["", ""],
    belastingen: {
      voorafbetaling: "",
      personenbelasting: "",
      vennootschapsbelasting: "",
      bedrijfsvoorheffing: "",
      socialeBijdragen: "",
      extraBijdragen: "",
      afrekening: "",
      overige: "",
    },
  });

  const handleChange = (section, key, value, index = null) => {
    setData((prev) => {
      const updated = { ...prev };
      if (index !== null) {
        updated[section][index] = value;
      } else {
        updated[section][key] = value;
      }
      return updated;
    });
  };

  const calcTotal = (section) =>
    Object.values(section).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  return (
    <div className="mx-auto p-6 bg-white shadow rounded-xl space-y-8">
      {/* Ouders */}
      <div>
        <h2 className="text-lg font-bold mb-2">Ouders</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data.ouders).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="capitalize">{key}</label>
              <input
                type="number"
                value={val}
                onChange={(e) =>
                  handleChange("ouders", key, e.target.value)
                }
                className="border p-1 rounded w-32 text-right"
              />
            </div>
          ))}
        </div>
        <div className="mt-2 text-right font-bold bg-yellow-100 p-2 rounded">
          Totaal Ouders: €{calcTotal(data.ouders).toFixed(2)}
        </div>
      </div>

      {/* Kinderen */}
      <div>
        <h2 className="text-lg font-bold mb-2">Kinderen</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data.kinderen).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="capitalize">{key}</label>
              <input
                type="number"
                value={val}
                onChange={(e) =>
                  handleChange("kinderen", key, e.target.value)
                }
                className="border p-1 rounded w-32 text-right"
              />
            </div>
          ))}
        </div>
        <div className="mt-2 text-right font-bold bg-yellow-100 p-2 rounded">
          Totaal Kinderen: €{calcTotal(data.kinderen).toFixed(2)}
        </div>
      </div>

      {/* Privé inkomsten */}
      <div>
        <h2 className="text-lg font-bold mb-2">Privé-inkomsten</h2>
        <div className="space-y-2">
          {data.priveInkomen.map((val, i) => (
            <div key={i} className="flex items-center justify-between">
              <label>Inkomen {i + 1}</label>
              <input
                type="number"
                value={val}
                onChange={(e) =>
                  handleChange("priveInkomen", null, e.target.value, i)
                }
                className="border p-1 rounded w-32 text-right"
              />
            </div>
          ))}
        </div>
        <div className="mt-2 text-right font-bold bg-yellow-100 p-2 rounded">
          Totaal: €
          {data.priveInkomen
            .reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
            .toFixed(2)}
        </div>
      </div>

      {/* Belastingen */}
      <div>
        <h2 className="text-lg font-bold mb-2">Belastingen en Bijdragen</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data.belastingen).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="capitalize">{key}</label>
              <input
                type="number"
                value={val}
                onChange={(e) =>
                  handleChange("belastingen", key, e.target.value)
                }
                className="border p-1 rounded w-32 text-right"
              />
            </div>
          ))}
        </div>
        <div className="mt-2 text-right font-bold bg-yellow-100 p-2 rounded">
          Totaal Belastingen: €{calcTotal(data.belastingen).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
