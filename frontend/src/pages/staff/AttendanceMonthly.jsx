import React, { useState } from "react";
import api from "../../api/axios";

const AttendanceMonthly = () => {

  const [report, setReport] = useState([]);

  const loadReport = async () => {

    const res = await api.get("/attendance/monthly/2026-03");

    setReport(res.data);

  };

  return (
    <div>

      <button onClick={loadReport}>
        Load March Report
      </button>

      <table border="1">

        <thead>
          <tr>
            <th>Student</th>
            <th>Subject</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {report.map(r => (
            <tr key={r._id}>
              <td>{r.student.name}</td>
              <td>{r.subject.name}</td>
              <td>{r.status}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default AttendanceMonthly;