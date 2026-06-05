import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Server, 
  Github, 
  Terminal, 
  Send, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Code, 
  Cpu, 
  Layers, 
  Lock, 
  Sparkles, 
  FileCode, 
  Copy, 
  Check 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HealthResponse, Message } from "./types";

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(true);
  const [healthError, setHealthError] = useState<string | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "server",
      text: "Hello! I am your backend-integrated Express developer assistant. Ask me anything about server setup, database synchronization, environment secrets, or GitHub migration workflows.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<string>("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Active view tabs for backend config documentation
  const [activeTab, setActiveTab] = useState<"readme" | "server" | "workflow">("readme");

  const serverFileCode = `import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let genAIClient: GoogleGenAI | null = null;

function getGenAIClient() {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY required");
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}`;

  const githubWorkflowCode = `name: Full-Stack Express CI/CD Build Tests

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Setup Node.js Environment
      uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: 'npm'

    - name: Install Project Dependencies
      run: npm ci

    - name: Run Type Checks (Linting)
      run: npm run lint

    - name: Build Full-Stack Bundles
      run: npm run build
      env:
        NODE_ENV: production`;

  // Fetch API Health Status on load
  const fetchHealth = async () => {
    setLoadingHealth(true);
    setHealthError(null);
    try {
      const res = await fetch("/api/health");
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const data: HealthResponse = await res.json();
      setHealth(data);
    } catch (err: any) {
      console.error("Health Check Failed:", err);
      setHealthError(err.message || "Failed to communicate with the Node server.");
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendingMessage]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(""), 2000);
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sendingMessage) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage("");
    setSendingMessage(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentInput })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const serverMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: "server",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, serverMsg]);
    } catch (error: any) {
      console.error("Chat transmission error:", error);
      const errorMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: "server",
        text: `⚠️ Error initiating backend proxy: ${error.message || "Please verify your server console logs for stack failures."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col antialiased">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold tracking-tight text-white flex items-center gap-2">
                TypeScript Full-Stack Engine <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-700/50">Active</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Express.js Server + React Client Applet Boilerplate</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Quick Export Guide Button */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Dev Environment Running
            </div>
            <button 
              onClick={fetchHealth} 
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors border border-slate-800"
              title="Refresh Health Check"
            >
              <RefreshCw className={`w-4 h-4 ${loadingHealth ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Diagnostics, Github Hub (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Server Architecture Config Dashboard */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all shadow-xl">
            <h2 className="text-base font-semibold text-white tracking-wide flex items-center gap-2 mb-4">
              <Server className="w-4 h-4 text-indigo-400" />
              Server Diagnostics & Secrets Integrity
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Card: Server Connection */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  CONTAINER STATUS
                </div>
                <div className="mt-2.5 flex items-baseline gap-2">
                  {loadingHealth ? (
                    <span className="text-slate-400 text-xs font-mono animate-pulse">Querying...</span>
                  ) : healthError ? (
                    <span className="text-rose-400 font-mono text-sm inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Offline
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-mono text-sm font-semibold inline-flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> ONLINE
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Host Ingress Proxy: Port 3000</div>
              </div>

              {/* Card: API Keys */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  GEMINI KEY INTEGRITY
                </div>
                <div className="mt-2.5 flex items-baseline gap-2">
                  {loadingHealth ? (
                    <span className="text-slate-400 text-xs font-mono animate-pulse">Validating...</span>
                  ) : health?.config.hasGeminiKey ? (
                    <span className="text-emerald-400 font-mono text-sm font-semibold inline-flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> DETECTED
                    </span>
                  ) : (
                    <span className="text-amber-400 font-mono text-sm inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> UNCONFIGURED
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Stored securely in Server Envs</div>
              </div>

              {/* Card: Engine Environment */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  RUNTIME ENVIRONMENT
                </div>
                <div className="mt-2.5 block">
                  <span className="text-indigo-400 font-mono text-xs uppercase bg-indigo-950/45 px-2 py-0.5 rounded border border-indigo-900">
                    {loadingHealth ? "---" : health?.environment || "development"}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-2">Node {health?.config.nodeVersion || "v20"} Engine</div>
              </div>
            </div>

            {/* Error Banner if Health check fails */}
            {healthError && (
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-3 text-rose-300 text-xs mb-4 flex items-start gap-2 font-mono">
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Express Server Handshake Failed</p>
                  <p className="mt-0.5 text-rose-400">{healthError}</p>
                </div>
              </div>
            )}

            {/* Config details info info footer */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed font-mono">
              <span className="text-slate-300 font-semibold text-xs border-b border-slate-800 pb-1.5 mb-1.5 block">Server Routing Mechanism:</span>
              <div className="space-y-1 text-slate-400">
                <p>• Client requests go to <code className="text-indigo-300">/api/*</code> and are resolved instantly by Express without passing keys to browser.</p>
                <p>• Complete Production build transpiles TS code into a specialized, single <code className="text-indigo-300">dist/server.cjs</code> for peak speed.</p>
              </div>
            </div>
          </section>

          {/* Github Export and Setup Materials */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all shadow-xl flex-1 flex flex-col">
            <h2 className="text-base font-semibold text-white tracking-wide flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-emerald-400" />
                GitHub Materials & Export Hub
              </div>
            </h2>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 mb-4 text-xs font-mono">
              <button 
                onClick={() => setActiveTab("readme")}
                className={`pb-2.5 px-3 border-b-2 font-medium transition-all ${activeTab === "readme" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}
              >
                1. Local Setup Instructions (README)
              </button>
              <button 
                onClick={() => setActiveTab("server")}
                className={`pb-2.5 px-3 border-b-2 font-medium transition-all ${activeTab === "server" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}
              >
                2. Server Entry point (server.ts)
              </button>
              <button 
                onClick={() => setActiveTab("workflow")}
                className={`pb-2.5 px-3 border-b-2 font-medium transition-all ${activeTab === "workflow" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}
              >
                3. CI/CD Pipeline (GitHub Actions)
              </button>
            </div>

            {/* Active Content Window */}
            <div className="flex-1 flex flex-col">
              {activeTab === "readme" && (
                <div className="flex-1 flex flex-col">
                  <div className="text-xs text-slate-400 mb-3 leading-relaxed">
                    This file is placed at `/README.md` inside your export context. Follow these steps to pull your app locally or push to an external GitHub repository.
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-y-auto max-h-72 font-mono text-xs text-slate-300 leading-relaxed custom-scrollbar flex-1">
                    <div className="flex justify-between items-center bg-slate-900 -mx-4 -mt-4 px-4 py-2 border-b border-slate-800 mb-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Markdown Documentation</span>
                      <button 
                        onClick={() => handleCopy(`# Full-Stack Express-Vite-React Boilerplate\n\n## Local Installation\n1. Extract zip or clone repository\n2. Run 'npm install'\n3. Set GEMINI_API_KEY inside your .env\n4. Boot server: 'npm run dev'`, "readme")}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all inline-flex items-center gap-1 font-mono text-[10px]"
                      >
                        {copiedSection === "readme" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedSection === "readme" ? "Copied!" : "Copy Raw"}
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-white font-bold block text-sm">📁 How to Export from AI Studio</span>
                        <p className="mt-1 text-slate-400">1. Open the AI Studio Project Sidebar Settings menu.</p>
                        <p>2. Click <b className="text-slate-200">Export to GitHub</b> or download the full workspace file as a <b className="text-slate-200">ZIP archive</b>.</p>
                      </div>
                      
                      <div>
                        <span className="text-white font-bold block text-sm">⚙️ Local Installation & Development Running</span>
                        <pre className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-indigo-300 mt-1.5 text-[11px] leading-relaxed">
{`# 1. Install dependencies
npm install

# 2. Duplicate env config and populate credentials
cp .env.example .env

# 3. Spin up full-stack Express server + Vite
npm run dev`}
                        </pre>
                      </div>

                      <div>
                        <span className="text-white font-bold block text-sm">🚢 Production Building & Running</span>
                        <p className="mt-1 text-slate-400">Compiles the React assets and packages the Express backend into code:</p>
                        <pre className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-indigo-300 mt-1.5 text-[11px] leading-relaxed">
{`# Compile all TypeScript assets with esbuild
npm run build

# Direct production server startup
npm run start`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "server" && (
                <div className="flex-1 flex flex-col">
                  <div className="text-xs text-slate-400 mb-3 leading-relaxed">
                    Source content of your custom <code className="text-indigo-400">server.ts</code> entry file. It routes all API traffic transparently to hidden API keys.
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-y-auto max-h-72 font-mono text-xs text-slate-300 flex-1 relative">
                    <div className="flex justify-between items-center bg-slate-900 -mx-4 -mt-4 px-4 py-2 border-b border-slate-800 mb-3">
                      <span className="text-[10px] text-slate-400 font-bold">server.ts</span>
                      <button 
                        onClick={() => handleCopy(serverFileCode, "server")}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all inline-flex items-center gap-1 text-[10px]"
                      >
                        {copiedSection === "server" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedSection === "server" ? "Copied!" : "Copy Code"}
                      </button>
                    </div>
                    <pre className="text-indigo-300/90 leading-relaxed text-[10px] whitespace-pre-wrap">{serverFileCode}</pre>
                  </div>
                </div>
              )}

              {activeTab === "workflow" && (
                <div className="flex-1 flex flex-col">
                  <div className="text-xs text-slate-400 mb-3 leading-relaxed">
                    Configured inside <code className="text-indigo-400">.github/workflows/ci.yml</code>. Runs tests, handles lint warnings, and processes server transpilation checks automatically on pushes.
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-y-auto max-h-72 font-mono text-xs text-slate-300 flex-1 relative">
                    <div className="flex justify-between items-center bg-slate-900 -mx-4 -mt-4 px-4 py-2 border-b border-slate-800 mb-3">
                      <span className="text-[10px] text-slate-400 font-bold">ci.yml</span>
                      <button 
                        onClick={() => handleCopy(githubWorkflowCode, "workflow")}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-all inline-flex items-center gap-1 text-[10px]"
                      >
                        {copiedSection === "workflow" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedSection === "workflow" ? "Copied!" : "Copy CI Workflow"}
                      </button>
                    </div>
                    <pre className="text-emerald-400/90 leading-relaxed text-[10px] whitespace-pre-wrap">{githubWorkflowCode}</pre>
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Interactive Chat & API Test Sandbox (5 cols) */}
        <section className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden h-[630px] shadow-xl">
          {/* Box Header */}
          <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600/10 rounded-lg border border-indigo-500/20 text-indigo-400">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">LLM API Sandbox Terminal</span>
                <span className="text-[10px] text-indigo-400 font-mono mt-0.5">Proxying via Express /api/chat</span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full font-mono scale-[0.85] transform origin-right">
              API Sandbox
            </span>
          </div>

          {/* Dialog Space */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40 custom-scrollbar relative">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/10"
                      : "bg-slate-800/90 text-slate-200 border border-slate-800 rounded-tl-none font-sans"
                  }`}>
                    {msg.text}
                    <div className={`text-[9px] mt-1.5 font-mono text-right ${
                      msg.sender === "user" ? "text-indigo-200" : "text-slate-500"
                    }`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {sendingMessage && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex justify-start"
              >
                <div className="bg-slate-800/50 text-slate-400 border border-slate-800/70 rounded-xl px-4 py-3 rounded-tl-none text-xs flex items-center gap-2 font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  Backend proxy fetching Gemini...
                </div>
              </motion.div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Form Action Handler */}
          <form onSubmit={sendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your Express backend a prompt..."
              disabled={sendingMessage}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-sans focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/35 transition-all text-ellipsis"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || sendingMessage}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>

      </main>

      {/* Workspace Footer */}
      <footer className="border-t border-slate-900 py-4 bg-slate-950/40 text-center text-[10px] text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between px-6 gap-3">
        <span>© 2026 Full-Stack Workspace Engine. Preserving Sandbox and Sandbox Keys securely.</span>
        <div className="flex gap-4">
          <span className="hover:text-slate-300 transition-colors">Port: 3000 Ingress Protected</span>
          <span className="text-slate-800">|</span>
          <span className="hover:text-slate-300 transition-colors">Environment: TS CJS Bundle</span>
        </div>
      </footer>
    </div>
  );
}
