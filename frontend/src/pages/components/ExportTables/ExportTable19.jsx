// ExportTable18.jsx
import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ExportTable18 = memo(({ sub_index, item_index, sub_name, categoryIdentifier, setExportJsonArray }) => {
    const [totals, setTotals] = useState({ totalUren: 0, totalAK: 0 });

    const fetchTotals = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`);
            const res1 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/R1-2-1`);
            const res2 = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/R1-4`);
            const totalOppervlakte = res.data.data.length > 0 ?
                res1.data.data.reduce((sum, inv) => sum + Number(inv.Oppervlakte || 0), 0) + Number(res.data.data[0][["ownership"]] || 0) : 0;
            const tmp = res2.data.data[0] || []
            delete tmp["category_identifier"]
            delete tmp["id"]
            delete tmp["source_doc"]
            const totalArea = res.data.data.length > 0 ? Object.values(tmp).reduce((sum, val) => sum + Number(val || 0), 0) + Number(res.data.data[0]["lostArea"] || 0) : 0;
            const totalUren = totalOppervlakte
            const totalAK = totalArea

            setTotals({ totalUren, totalAK });
            setExportJsonArray(prev => [...prev, {
                table_name: `${sub_index}${item_index ? " - " + item_index : ""}: ${sub_name}`,
                data: { "Eigendom": totalUren, "Verloren oppervlakte": totalAK }
            }])
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
            <div className="w-full">
                {/* Sub name with custom color */}
                <h3 className="text-lg font-semibold mb-4 text-center text-blue-500">
                    {sub_index}{item_index ? " - " + item_index : ""}: {sub_name}
                </h3>

                <table className="w-full border-collapse border border-gray-300 text-center">
                    <thead>
                        <tr>
                            {/* Table headers with custom color */}
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                Eigendom
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                Verloren oppervlakte
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalUren.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                {totals.totalAK.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
})

export default ExportTable18
