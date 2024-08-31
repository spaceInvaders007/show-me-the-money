import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Reports from "../reports";

describe("Reports Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display the report data when API call is successful", async () => {
    const mockData = {
      Status: "OK",
      Reports: [
        {
          ReportID: "BalanceSheet",
          ReportName: "Balance Sheet",
          ReportTitles: ["Balance Sheet", "Demo Org", "As at 27 August 2024"],
          ReportDate: "27 August 2024",
          UpdatedDateUTC: "/Date(1724802941855)/",
          Fields: [],
          Rows: [
            {
              RowType: "Header",
              Cells: [
                { Value: "Header 1" },
                { Value: "Header 2" },
                { Value: "Header 3" },
              ],
            },
            {
              RowType: "Section",
              Title: "Assets",
              Rows: [
                {
                  RowType: "Row",
                  Cells: [
                    { Value: "Cash" },
                    { Value: "$1000" },
                    { Value: "$2000" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    } as any);

    render(<Reports />);

    await screen.findByText("Balance Sheet");

    expect(screen.getByText("Header 1")).toBeInTheDocument();
    expect(screen.getByText("Cash")).toBeInTheDocument();
  });
  it("should display a loading message before the data is loaded", () => {
    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ json: () => ({}) }), 100);
        })
    );

    render(<Reports />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should handle an empty report gracefully", async () => {
    const mockData = {
      Status: "OK",
      Reports: [],
    };

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockData),
    } as any);

    render(<Reports />);

    await waitFor(() => {
      expect(screen.queryByText("Balance Sheet")).not.toBeInTheDocument();
    });
  });

  it("should display an error message if the API call fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));

    render(<Reports />);

    await waitFor(() => {
      expect(screen.queryByText("Balance Sheet")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching data:",
        new Error("API Error")
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
