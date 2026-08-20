import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 8081);

app.get("/", (_req, res) => {
  res.status(200).json({ service: "knowledge-hub-frontend", status: "ok" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Frontend-Server lauscht auf Port ${port}`);
});
