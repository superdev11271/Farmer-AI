import React, { useState } from 'react';

const AgriculturalForm = () => {
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
    lostArea: '9,00',
    cultivatedArea: '9,00',
    
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
    grazingSystem: 'Enkel overdag begrazen'
  });

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

  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-800 mb-2"># Naar startpagina</h1>
      </div>

      {/* CODE JAAR Section */}
      <section className="mb-8">
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
      <section className="mb-8">
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

      {/* BTW Section */}
      <section className="mb-8">
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
                <td className="px-4 py-2">0,00 ha</td>
              </tr>
              <tr className="border-b border-gray-300 bg-gray-50">
                <td className="px-4 py-2 font-medium">TOTAAL</td>
                <td className="px-4 py-2">0,00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span>Verloren oppervlakte (gebouwen etc.)</span>
            <input
              type="text"
              value={formData.lostArea}
              onChange={(e) => handleInputChange('lostArea', e.target.value)}
              className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
            />
          </div>
          <div className="flex justify-between items-center">
            <span>Beteelde oppervlakte (tabblad teeltplan)</span>
            <input
              type="text"
              value={formData.cultivatedArea}
              onChange={(e) => handleInputChange('cultivatedArea', e.target.value)}
              className="w-24 px-2 py-1 border border-gray-300 rounded text-right"
            />
          </div>
          <div className="flex justify-between items-center font-bold">
            <span>TOTAAL</span>
            <span>18,00 ha</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-700 text-sm">
            Gelieve ha verloren oppervlakte nog in te vullen.<br />
            Totaal van gepachte ha + ha in eigendom is niet gelijk aan beteelde + verloren oppervlakte, gelieve te corrigeren.<br />
            De oppervlakte eigendom en totaal pacht (zie verder) dienen overeen te komen met de beteelde oppervlakte en de verloren oppervlakte.
          </p>
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
                  <input
                    type="text"
                    value={formData.totalPlots}
                    onChange={(e) => handleInputChange('totalPlots', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
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
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded mb-4">
          <p className="text-yellow-700 text-sm">Gelieve aantal kavels nog in te vullen</p>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Oppervlakte huiskavel:</h3>
          <p className="text-sm text-gray-600 mb-2">
            De huiskavel is de oppervlakte die aan de hoeve gelegen is zonder scheiding van openbare wegen, grachten, enz.
          </p>
          <input
            type="text"
            value={formData.homePlotArea}
            onChange={(e) => handleInputChange('homePlotArea', e.target.value)}
            className="w-32 px-2 py-1 border border-gray-300 rounded"
            placeholder="ha"
          />
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-700 text-sm">Gelieve oppervlakte van de huiskavel nog in te vullen</p>
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

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">
          Opslaan
        </button>
      </div>
    </div>
  );
};

export default AgriculturalForm;