import React, { useState, useEffect } from 'react';
import { Save, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const AgriculturalForm = ({ categoryIdentifier }) => {
  // State for form data
  const [formData, setFormData] = useState({
    // CODE JAAR section
    companyType: 'Standaard',

    // Melkinstalatie section
    milkInstallation: '',

    // BTW section
    vatType: 'Forfait',

    // ALGEMEEN section
    ownership: '',
    lostArea: '',

    // VERKAVELING section
    totalPlots: '0',
    plots0to2: '',
    plots2to5: '',
    plotsOver5: '',
    homePlotArea: '',

    // WATERMANAGEMENT section
    drainedArea: '',
    irrigableArea: '',
    sprinklerArea: '',

    // Beweldingsysteem section
    grazingSystem: 'Enkel overdag begrazen',
    totalOppervlakte: 0,
    totalArea: 0
  });

  const [baseline, setBaseline] = useState(() => ({ ...formData }));
  const [hasChanges, setHasChanges] = useState(false);

  // Load data from backend
  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`);
      const res1 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/R1-2-1`);
      const res2 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/R1-4`);
      const totalOppervlakte = res1.data.data.reduce((sum, inv) => sum + Number(inv.Oppervlakte || 0), 0);
      const tmp = res2.data.data[0] || []
      delete tmp["category_identifier"]
      delete tmp["id"]
      delete tmp["source_doc"]

      const totalArea = Object.values(tmp).reduce((sum, val) => sum + Number(val || 0), 0);
      if (res.data && res.data.data && res.data.data.length > 0) {
        const serverData = res.data.data[0] || [];
        // Map server data to form data structure
        const newFormData = {
          companyType: serverData.companyType || 'Standaard',
          milkInstallation: serverData.milkInstallation || '',
          vatType: serverData.vatType || 'Forfait',
          ownership: serverData.ownership || '',
          lostArea: serverData.lostArea || '9,00',
          totalPlots: serverData.totalPlots || '0',
          plots0to2: serverData.plots0to2 || '',
          plots2to5: serverData.plots2to5 || '',
          plotsOver5: serverData.plotsOver5 || '',
          homePlotArea: serverData.homePlotArea || '',
          drainedArea: serverData.drainedArea || '',
          irrigableArea: serverData.irrigableArea || '',
          sprinklerArea: serverData.sprinklerArea || '',
          grazingSystem: serverData.grazingSystem || 'Enkel overdag begrazen',
          totalOppervlakte: totalOppervlakte || 0,
          totalArea: totalArea || 0
        };
        setFormData(newFormData);
        setBaseline({ ...newFormData });
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
    const changed = JSON.stringify(formData) !== JSON.stringify(baseline);
    setHasChanges(changed);
  }, [formData, baseline]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle radio button changes
  const handleRadioChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        category_identifier: categoryIdentifier,
        data: [{ ...formData, category_identifier: categoryIdentifier, source_doc: "", id: 123324234 }],
      };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/`, payload);
      setBaseline({ ...formData });
      setHasChanges(false);
      toast.success("Changes saved successfully!");
    } catch (err) {
      toast.error("Failed to save data");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({ ...baseline });
    setHasChanges(false);
    toast("Changes canceled.");
  };

  return (
    <div className="space-y-6">
      {/* Main card container matching InvoiceTable1 style */}
      <div className="card p-6 shadow-md rounded-lg bg-white">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-blue-800"># Naar startpagina</h1>
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

        {/* Two Column Layout for Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* CODE JAAR Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">CODE JAAR</h2>

              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Soort bedrijf</h3>
                <div className="space-y-2 ml-4">
                  {['Standaard', 'Bibbedrijf', 'Vlog/GGO'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="companyType"
                        value={type}
                        checked={formData.companyType === type}
                        onChange={(e) => handleRadioChange('companyType', e.target.value)}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Melkinstalatie Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Melkinstalatie</h2>
              <div className="space-y-2 ml-4">
                {['Melkstal', 'Melkrobot'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="milkInstallation"
                      value={type}
                      checked={formData.milkInstallation === type}
                      onChange={(e) => handleRadioChange('milkInstallation', e.target.value)}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* BTW Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">BTW</h2>
              <div className="space-y-2 ml-4">
                {['Forfait', 'Algemeen'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="vatType"
                      value={type}
                      checked={formData.vatType === type}
                      onChange={(e) => handleRadioChange('vatType', e.target.value)}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        {/* ALGEMEEN Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ALGEMEEN</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2 font-medium">Eigendom</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={formData.ownership}
                      onChange={(e) => handleInputChange('ownership', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      placeholder="ha"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2 font-medium">Pachten (tabblad pachten)</td>
                  <td className="px-4 py-2">{formData.totalOppervlakte} ha</td>
                </tr>
                <tr className="border-b border-gray-300 bg-yellow-50">
                  <td className="px-4 py-2 font-medium">TOTAAL</td>
                  <td className="px-4 py-2">{Number(formData.totalOppervlakte || 0) + Number(formData.ownership || 0)} ha</td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="px-4 py-2 font-medium"></td>
                  <td className="px-4 py-2"></td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="px-4 py-2 font-medium">Verloren Oppervlakte (gebouwen etc.)</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={formData.lostArea}
                      placeholder="ha"
                      onChange={(e) => handleInputChange('lostArea', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="px-4 py-2 font-medium">Beteelde Oppervlakte (tabblad teeltplan)</td>
                  <td className="px-4 py-2">{formData.totalArea} ha</td>
                </tr>
                <tr className="border-b border-gray-300 bg-yellow-50">
                  <td className="px-4 py-2 font-medium">TOTAAL</td>
                  <td className="px-4 py-2">{Number(formData.totalArea || 0) + Number(formData.lostArea || 0)} ha</td>
                </tr>
              </tbody>
            </table>
          </div>

        </section>

        {/* VERKAVELING Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">VERKAVELING</h2>
          <p className="text-sm text-gray-600 mb-4">
            Een kavel is 1 blok aaneengesloten landbouwgrond; 'n kavel kan dus uit meerdere percelen bestaan.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="px-4 py-2 font-medium">Totaal</td>
                  <td className="px-4 py-2">
                    {Number(formData.plots0to2 || 0) + Number(formData.plots2to5 || 0) + Number(formData.plotsOver5 || 0)}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Aantal Kavels 0 - 2 ha</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={formData.plots0to2}
                      onChange={(e) => handleInputChange('plots0to2', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Aantal Kavels 2 - 5 ha</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={formData.plots2to5}
                      onChange={(e) => handleInputChange('plots2to5', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Aantal Kavels &gt; 5 ha</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={formData.plotsOver5}
                      onChange={(e) => handleInputChange('plotsOver5', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Oppervlakte huiskavel:</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={formData.homePlotArea}
                      onChange={(e) => handleInputChange('homePlotArea', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      placeholder="ha"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


        </section>

        {/* WATERMANAGEMENT Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">WATERMANAGEMENT</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Oppervlakte gedraineerd:</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={formData.drainedArea}
                      onChange={(e) => handleInputChange('drainedArea', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded"
                      placeholder="ha"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Oppervlakte beroepnbaar:</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={formData.irrigableArea}
                      onChange={(e) => handleInputChange('irrigableArea', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded"
                      placeholder="ha"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Oppervlakte irrigerbaar (bevloeibaar):</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={formData.sprinklerArea}
                      onChange={(e) => handleInputChange('sprinklerArea', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded"
                      placeholder="ha"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Beweldingsysteem Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Beweldingsysteem</h2>
          <p className="text-sm text-gray-600 mb-4">
            Welk beweldingsysteem past u toe op uw bedrijf tijdens de maanden juni en juli?
          </p>

          <div className="space-y-2 ml-4">
            {[
              'Dag en nacht begrazen (eventueel met een of twee maal daags bijvoeren)',
              'Enkel overdag begrazen',
              'Niet begrazen'
            ].map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="grazingSystem"
                  value={option}
                  checked={formData.grazingSystem === option}
                  onChange={(e) => handleRadioChange('grazingSystem', e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AgriculturalForm;