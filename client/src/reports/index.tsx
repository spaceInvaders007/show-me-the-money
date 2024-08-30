import React from "react";
import { useEffect, useState } from "react";

interface Cell {
    Value: string;
    Attributes?: Array<{ Value: string; Id: string }>;
  }
  
  interface Row {
    RowType: string;
    Title?: string;
    Cells: Cell[];
    Rows?: Row[];
  }
  
  interface Report {
    ReportID: string;
    ReportName: string;
    ReportType: string;
    ReportTitles: string[];
    ReportDate: string;
    UpdatedDateUTC: string;
    Fields: any[];
    Rows: Row[];
  }
  
  interface ApiResponse {
    Status: string;
    Reports: Report[];
  }

  const Reports = () => {
    const [balanceSheet, setBalanceSheet] = useState<Report | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3001/balance-sheet');
          const data: ApiResponse = await response.json();
          setBalanceSheet(data.Reports[0]);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    if (!balanceSheet) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h2>{balanceSheet.ReportName}</h2>
        <h3>{balanceSheet.ReportTitles.join(' - ')}</h3>
        <table>
          <thead>
            <tr>
              {balanceSheet.Rows[0].Cells.map((cell, index) => (
                <th key={index}>{cell.Value}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {balanceSheet.Rows.slice(1).map((section, index) => (
              <React.Fragment key={index}>
                {section.RowType === 'Section' && (
                  <>
                    <tr>
                      <td colSpan={3}><strong>{section.Title}</strong></td>
                    </tr>
                    {section.Rows?.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.Cells.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell.Value}</td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Reports;