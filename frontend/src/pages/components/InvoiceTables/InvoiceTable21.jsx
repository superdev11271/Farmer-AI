import React, { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function InvoiceTableR8_2({ categoryIdentifier }) {
  const [data, setData] = useState({
    // Parents
    lening: 0,
    kleineRisico: 0,
    extraZiekte: 0,
    gewaarborgdInkomen: 0,
    verzekeringWoning: 0,
    pensioensparen: 0,
    vapz: 0,
    andere1: 0,
    andere2: 0,

    // Children
    totaalNormKinderen: 0,
    studiekosten: 0,
    kinderbijslag: 0,
    studietoelage: 0,

    // Inkomsten
    priveInkomen1: 0,
    priveInkomen2: 0,

    // Belastingen en bijdragen
    voorafbetaling: 0,
    personenBelasting: 0,
    vennootschapsBelasting: 0,
    bedrijfsVoorheffing: 0,
    socialeBijdragen: 0,
    afrekeningBijdragen: 0,
    overige: 0,
  });

  const [baseline, setBaseline] = useState(() => ({ ...data }));
  const [hasChanges, setHasChanges] = useState(false);

  // Load data from backend
  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`);

      if (res.data && res.data.data.length > 0) {
        // Convert invoice data to our format
        const invoiceData = res.data.data[0];

        const newData = {
          lening: invoiceData.lening || 0,
          kleineRisico: invoiceData.kleineRisico || 0,
          extraZiekte: invoiceData.extraZiekte || 0,
          gewaarborgdInkomen: invoiceData.gewaarborgdInkomen || 0,
          verzekeringWoning: invoiceData.verzekeringWoning || 0,
          pensioensparen: invoiceData.pensioensparen || 0,
          vapz: invoiceData.vapz || 0,
          andere1: invoiceData.andere1 || 0,
          andere2: invoiceData.andere2 || 0,
          totaalNormKinderen: invoiceData.totaalNormKinderen || 0,
          studiekosten: invoiceData.studiekosten || 0,
          kinderbijslag: invoiceData.kinderbijslag || 0,
          studietoelage: invoiceData.studietoelage || 0,
          priveInkomen1: invoiceData.priveInkomen1 || 0,
          priveInkomen2: invoiceData.priveInkomen2 || 0,
          voorafbetaling: invoiceData.voorafbetaling || 0,
          personenBelasting: invoiceData.personenBelasting || 0,
          vennootschapsBelasting: invoiceData.vennootschapsBelasting || 0,
          bedrijfsVoorheffing: invoiceData.bedrijfsVoorheffing || 0,
          socialeBijdragen: invoiceData.socialeBijdragen || 0,
          afrekeningBijdragen: invoiceData.afrekeningBijdragen || 0,
          overige: invoiceData.overige || 0,
        };
        setData(newData);
        setBaseline({ ...newData });
      }
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryIdentifier]);

  // derive hasChanges by comparing to baseline
  useEffect(() => {
    const changed = JSON.stringify(data) !== JSON.stringify(baseline);
    setHasChanges(changed);
  }, [data, baseline]);

  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: Number(value) || 0,
    }));
  };

  const handleSave = async () => {
    console.log(data)
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

  // Calculations
  const totaalOuders =
    data.lening +
    data.kleineRisico +
    data.extraZiekte +
    data.gewaarborgdInkomen +
    data.verzekeringWoning +
    data.pensioensparen +
    data.vapz +
    data.andere1 +
    data.andere2;

  const totaalKinderen =
    data.totaalNormKinderen +
    data.studiekosten +
    data.kinderbijslag +
    data.studietoelage;

  const totaalInkomen = data.priveInkomen1 + data.priveInkomen2;

  const totaalBelastingen =
    data.voorafbetaling +
    data.personenBelasting +
    data.vennootschapsBelasting +
    data.bedrijfsVoorheffing +
    data.socialeBijdragen +
    data.afrekeningBijdragen +
    data.overige;

  const renderRow = (label, field, readonly = false) => (
    <div className="grid grid-cols-2 gap-2 py-1">
      <span className="text-sm">{label}</span>
      {readonly ? (
        <input
          className="border px-2 py-1 w-full bg-yellow-200 text-right font-semibold"
          value={field}
          readOnly
        />
      ) : (
        <input
          type="number"
          className="border px-2 py-1 w-full bg-green-100 text-right"
          value={data[field]}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Main card container matching InvoiceTable1 style */}
      <div className="card p-6 shadow-md rounded-lg bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">BENODIGD VOOR PRIVE</h3>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-semibold mb-3 text-gray-700">Uitgaven Ouders</h4>
              <div className="space-y-2">
                {renderRow("Rente en aflossing lening woning", "lening")}
                {renderRow("Verzekering kleine risico's ziekte", "kleineRisico")}
                {renderRow("Aanvullende ziektekostenverzekering", "extraZiekte")}
                {renderRow("Gewaarborgd inkomen", "gewaarborgdInkomen")}
                {renderRow("Verzekering woning/inboedel", "verzekeringWoning")}
                {renderRow("Pensioensparen/levensverzekering", "pensioensparen")}
                {renderRow("Vrij aanvullend pensioen (VAPZ)", "vapz")}
                {renderRow("Andere", "andere1")}
                {renderRow("Andere", "andere2")}
                {renderRow("TOTAAL OUDERS", totaalOuders, true)}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-3 text-gray-700">Uitgaven Kinderen</h4>
              <div className="space-y-2">
                {renderRow("Totaal norm kinderen", "totaalNormKinderen")}
                {renderRow("Studie kosten (kot...)", "studiekosten")}
                {renderRow("Kinderbijslag", "kinderbijslag")}
                {renderRow("Studietoelage", "studietoelage")}
                {renderRow("TOTAAL KINDEREN", totaalKinderen, true)}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-semibold mb-3 text-gray-700">Inkomsten</h4>
              <div className="space-y-2">
                {renderRow("Privé-inkomsten (bv. loon)", "priveInkomen1")}
                {renderRow("Privé-inkomsten (bv. loon)", "priveInkomen2")}
                {renderRow("TOTAAL", totaalInkomen, true)}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-3 text-gray-700">Belastingen & Bijdragen</h4>
              <div className="space-y-2">
                {renderRow("Voorafbetaling", "voorafbetaling")}
                {renderRow("(Personen)belasting", "personenBelasting")}
                {renderRow("Vennootschapsbelasting", "vennootschapsBelasting")}
                {renderRow("Bedrijfsvoorheffing ondernemer(s)", "bedrijfsVoorheffing")}
                {renderRow("Sociale bijdragen", "socialeBijdragen")}
                {renderRow("Afrekening sociale bijdragen", "afrekeningBijdragen")}
                {renderRow("Overige", "overige")}
                {renderRow("TOTAAL BELASTINGEN EN BIJDRAGEN", totaalBelastingen, true)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
