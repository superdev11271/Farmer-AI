// ExportTable18.jsx
import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ExportTable18 = memo(({ sub_index, item_index, sub_name, categoryIdentifier, setExportJsonArray }) => {
    const [totals, setTotals] = useState({ totalExcl: 0, totalIncl: 0 });

    const fetchTotals = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/invoice/${categoryIdentifier}`
            );

            const data = res.data.data || [];
            const totalExcl = data.reduce(
                (sum, inv) => sum + Number(inv.bedrag || 0),
                0
            );
            const totalIncl = data.reduce(
                (sum, inv) =>
                    sum +
                    Number(inv.bedrag || 0) +
                    (Number(inv.bedrag || 0) * (Number(inv.btw || 0) / 100)),
                0
            );

            setTotals({ totalExcl, totalIncl });
            setExportJsonArray(prev => [...prev, {
                table_name: `${sub_index}${item_index ? " - " + item_index : ""}: ${sub_name}`,
                data: { "Bedrag (excl)[EUR]": totalExcl, "BTW Bedrag[EUR]": totalIncl }
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
                                Bedrag (excl)[EUR]
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-green-700">
                                BTW Bedrag[EUR]
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center">€{totals.totalExcl.toFixed(2)}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">
                                €{totals.totalIncl.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
})

export default ExportTable18
