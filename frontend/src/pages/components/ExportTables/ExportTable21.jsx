// ExportTable18.jsx
import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ExportTable18 = memo(({ sub_index, item_index, sub_name, categoryIdentifier, setExportJsonArray }) => {
    const [totals, setTotals] = useState({ totaalOuders: 0, totaalKinderen: 0, totaalInkomen: 0, totaalBelastingen: 0 });

    const fetchTotals = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`);

            if (res.data && res.data.data.length > 0) {
                // Convert invoice data to our format
                const invoiceData = res.data.data[0];

                const data = {
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


                setTotals({ totaalOuders, totaalKinderen, totaalInkomen, totaalBelastingen });
                setExportJsonArray(prev => [...prev, {
                    table_name: `${sub_index}${item_index ? " - " + item_index : ""}: ${sub_name}`,
                    data: { "TOTAAL OUDERS": totaalOuders, "TOTAAL KINDEREN": totaalKinderen, "TOTAAL Inkomsten": totaalInkomen, "TOTAAL BELASTINGEN EN BIJDRAGEN": totaalBelastingen }
                }])
            }

        } catch (err) {
            toast.error("Failed to fetch invoice data");
            console.error(err);
        }
    };

    useEffect(() => {
        if (categoryIdentifier) fetchTotals();
    }, [categoryIdentifier]);

    return (
        <div className="card p-6 shadow-md rounded-lg bg-white flex justify-center">
            <div className="w-full max-w-xl">
                {/* Sub name with custom color */}
                <h3 className="text-lg font-semibold mb-4 text-center text-blue-500">
                    {sub_index}{item_index ? " - " + item_index : ""}: {sub_name}
                </h3>

                <table className="w-full border-collapse border border-gray-300 text-center">
                    <thead>
                        <tr>
                            {/* Table headers with custom color */}
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                TOTAAL OUDERS
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                TOTAAL KINDEREN
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                TOTAAL Inkomsten
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                TOTAAL BELASTINGEN EN BIJDRAGEN
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totaalOuders.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totaalKinderen.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totaalInkomen.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totaalBelastingen.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
})

export default ExportTable18
