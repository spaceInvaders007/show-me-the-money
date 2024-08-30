import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

const PORT = 3001;
app.use(cors());

app.get("/balance-sheet", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api.xro/2.0/Reports/BalanceSheet"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching balance sheet data:", error);
    res.status(500).send(`Error fetching balance sheet data`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
