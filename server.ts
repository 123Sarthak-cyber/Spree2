import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lazy initializer for Google GenAI client to handle missing keys gracefully on boot
let genAIClient: GoogleGenAI | null = null;

function getGenAIClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured on the server. Please set it in Settings > Secrets.");
    }
    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// REST Backend API endpoints
app.get("/api/health", (req, res) => {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    config: {
      hasGeminiKey,
      appUrl: process.env.APP_URL || "http://localhost:3000",
      nodeVersion: process.version,
    },
    message: "Full-Stack Express + Vite Integration active."
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, history } = req.body;

    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "A prompt string is required to generate content." });
      return;
    }

    const ai = getGenAIClient();

    // If chat history is provided, use the Chat API
    if (history && Array.isArray(history)) {
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: "You are an intelligent full-stack developer assistant answering queries gracefully right from an active Express.js backend environment.",
        }
      });

      // Populate history if needed, or simply run single chats or send sequence. 
      // For general chat behavior, we can pass entire instruction or construct chat.
      const chatResponse = await chat.sendMessage({ message: prompt });
      res.json({
        text: chatResponse.text,
        model: "gemini-3.5-flash"
      });
    } else {
      // Single generation
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert developer assistant assisting inside a production-ready Express+React dashboard.",
        },
      });

      res.json({
        text: response.text,
        model: "gemini-3.5-flash"
      });
    }
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred in your Express server's Gemini integration."
    });
  }
});

// Serve frontend build output or run dev middleware
async function setupVitePipeline() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Integrating Vite HMR-less middlewares for dynamic frontend rendering.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`Serving static distribution assets from: ${distPath}`);
  }
}

setupVitePipeline().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Production Node Engine Listening at http://0.0.0.0:${PORT}`);
  });
}).catch((err) => {
  console.error("Vite server integration pipeline failure:", err);
});
