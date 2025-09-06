// ExportDataSelector.jsx
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx-js-style";
import categories from "../../data/categories.json"; // adjust path if needed
import invoice_types from "../../data/invoice_types.json";
// Format category names
function formatCategoryName(name) {
    return name.replace(/\(.*?\)/g, "").trim().toLowerCase();
}

// Flatten nested JSON into single list
function flattenCategories(cats, parentPath = "") {
    let all = [];
    cats.forEach((cat) => {
        const formattedName = formatCategoryName(cat.name);
        const path = parentPath ? `${parentPath} > ${formattedName}` : formattedName;

        all.push({
            id: cat.identifier || cat.name,
            name: formattedName,
            path: path,
        });

        if (cat.items) {
            all = all.concat(flattenCategories(cat.items, path));
        }
    });
    return all;
}
const exportMultipleTables = (tables, filename = "tables.xlsx") => {
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    let currentRow = 0;

    tables.forEach((table) => {
        const { table_name, data } = table;

        // Table name row (bold)
        XLSX.utils.sheet_add_aoa(worksheet, [[table_name]], { origin: currentRow });
        worksheet[XLSX.utils.encode_cell({ r: currentRow, c: 0 })].s = {
            font: { bold: true, sz: 14 },
        };
        currentRow += 1;

        // Header row (keys)
        const headers = Object.keys(data);
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: currentRow });

        headers.forEach((_, colIndex) => {
            const cell = worksheet[XLSX.utils.encode_cell({ r: currentRow, c: colIndex })];
            if (cell) {
                cell.s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } }, // white text
                    fill: { fgColor: { rgb: "4F81BD" } }, // blue background
                    alignment: { horizontal: "center", vertical: "center" },
                };
            }
        });

        currentRow += 1;

        // Values row
        const values = Object.values(data);
        XLSX.utils.sheet_add_aoa(worksheet, [values], { origin: currentRow });
        currentRow += 2; // gap row
    });

    // Set column widths
    worksheet["!cols"] = Array(20).fill({ wch: 20 }); // 20 chars width each col

    // Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AllTables");

    // Save file
    XLSX.writeFile(workbook, filename);
};

// Example usage:
const tables = [
    { table_name: "Table1", data: { a: 1, b: 2, c: 3 } },
    { table_name: "Table2", data: { x: 10, y: 20, z: 30 } },
];


export default function ExportDataSelector({ exportJsonArray, setCurrentCategoryIdentifier }) {
    const allCategories = flattenCategories(categories);
    const [selected, setSelected] = useState(allCategories[0].id);

    const handleExportSelected = () => {
        exportMultipleTables(exportJsonArray, selected + ".xlsx");
    };
    const current_excel = categories.filter(category => category.identifier == selected)[0]
    let total_export_cnt = 0;

    for (const sub_item of current_excel.sub_items) {
        if (sub_item.items.length > 0) {
            for (const item of sub_item.items) {
                for (const key of Object.keys(invoice_types)) {
                    if (invoice_types[key].includes(item.identifier))
                        total_export_cnt += 1;
                }
            }
        } else {
            for (const key of Object.keys(invoice_types)) {
                if (invoice_types[key].includes(sub_item.identifier))
                    total_export_cnt += 1;
            }
        }
    }
    const exportable = total_export_cnt == exportJsonArray.length


    // const handleExportAll = () => {
    //     exportToExcel(allCategories, "all_categories.xlsx");
    // };
    useEffect(() => {
        setCurrentCategoryIdentifier(selected);
    }, [selected, setCurrentCategoryIdentifier]);
    return (
        <div className="card p-6 shadow-md rounded-lg bg-white">
            {/* Card title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Export Data
            </h3>

            {/* Header row: select left, buttons right */}
            <div className="flex items-center justify-between">
                {/* Left: Select */}
                <select
                    className="w-1/3 border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                >
                    {allCategories.map((cat, idx) => (
                        <option key={cat.id || idx} value={cat.id}>
                            {cat.id}: {cat.path}
                        </option>
                    ))}
                </select>

                {/* Right: Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleExportSelected}
                        disabled={!exportable}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${exportable
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Export Selected
                    </button>
                    {/* 
                    <button
                        onClick={handleExportAll}
                        className="px-4 py-2 rounded-lg font-medium transition-colors bg-green-500 hover:bg-green-600 text-white"
                    >
                        Export All
                    </button> */}
                </div>
            </div>
        </div>
    );
}
