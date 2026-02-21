import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "school-data.json");

// Initial data
const initialData = {
  gallery: [
    { id: "1", url: "https://images.unsplash.com/photo-1523050853063-bd8012fec4c8?auto=format&fit=crop&q=80&w=1000", caption: "Main Academic Block" },
    { id: "2", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000", caption: "Modern Science Laboratory" },
    { id: "3", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000", caption: "Annual Sports Meet 2025" },
    { id: "4", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000", caption: "Interactive Classroom Session" },
    { id: "5", url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1000", caption: "School Library & Resource Center" },
    { id: "6", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000", caption: "Cultural Fest Performances" },
  ],
  announcements: [
    { id: "1", title: "Registration Open for Session 2026-27", date: "2026-02-21" },
    { id: "2", title: "Board Examination Schedule Released", date: "2026-02-18" },
    { id: "3", title: "Annual Day Celebration - March 15th", date: "2026-02-10" }
  ],
  contacts: [],
  newsletter: []
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

  app.post("/api/contact", (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    const newContact = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      message,
      date: new Date().toISOString()
    };
    data.contacts.push(newContact);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  });

  app.post("/api/newsletter", (req, res) => {
    const { email } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    if (!data.newsletter.includes(email)) {
      data.newsletter.push(email);
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    }
    res.json({ success: true });
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

  app.post("/api/announcements", (req, res) => {
    const { title } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    const newItem = {
      id: Date.now().toString(),
      title,
      date: new Date().toISOString().split('T')[0]
    };
    data.announcements.unshift(newItem);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(newItem);
  });

  app.delete("/api/announcements/:id", (req, res) => {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    data.announcements = data.announcements.filter((item: { id: string }) => item.id !== id);
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
