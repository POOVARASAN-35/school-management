import React from "react";
const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="text-left px-4 py-2 border-b font-semibold"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {Object.values(row).map((val, idx) => (
                <td key={idx} className="px-4 py-2 border-b">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
