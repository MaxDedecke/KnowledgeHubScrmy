import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get("/health", (_req, res) => {
  res.status(200).json({ service: "knowledge-hub-backend", status: "ok" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend-Server lauscht auf Port ${port}`);
});
