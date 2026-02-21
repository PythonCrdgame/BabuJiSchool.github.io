import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "school-data.json");

// Initial data
const initialData = {
  gallery: [
    { id: "1", url: "https://picsum.photos/seed/school1/800/600", caption: "Main Building" },
    { id: "2", url: "https://picsum.photos/seed/school2/800/600", caption: "Science Lab" },
    { id: "3", url: "https://picsum.photos/seed/school3/800/600", caption: "Annual Sports Day" },
    { id: "4", url: "https://picsum.photos/seed/school4/800/600", caption: "Library" },
  ],
  announcements: [
    { id: "1", title: "Admissions Open 2026-27", date: "2026-02-20" },
    { id: "2", title: "Annual Day Celebration on March 15th", date: "2026-02-15" }
  ]
};

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/data", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    res.json(data);
  });

  app.post("/api/gallery", (req, res) => {
    const { url, caption } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    const newItem = {
      id: Date.now().toString(),
      url,
      caption: caption || "New Photo"
    };
    data.gallery.unshift(newItem);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(newItem);
  });

  app.delete("/api/gallery/:id", (req, res) => {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    data.gallery = data.gallery.filter((item: { id: string }) => item.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
