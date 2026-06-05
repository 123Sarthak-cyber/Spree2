# Full-Stack TypeScript Boilerplate: Express + Vite + React + Google Gemini AI

A highly optimized, production-ready full-stack application template combining an **Express.js backend server**, a **Vite-powered React SPA frontend**, and secure **Google Gemini AI SDK integration** server-side. Prepared with full CI/CD GitHub Actions workflow setups.

## 🚀 Key Architectural Features
- **Server-Side API Keys Protection**: Keeps sensitive credentials like `GEMINI_API_KEY` masked safely on the node container environment without leaking variables to client bundles.
- **Lazy Initializers**: Robust SDK bootloaders that prevent start-time crashes if keys or configurations are missing.
- **Unified Port Routing**: Proxies all workspace requests dynamically to port `3000` via a structured reverse pipe.
- **Transpiled Production Builds**: Combines rapid frontend compiler steps (`vite build`) with esbuild to bundle server targets into a clean, standalone, high-performance `dist/server.cjs` file.

---

## 🛠️ Local Setup and Configuration

### Core Requirements
Before proceeding, confirm you have these tools installed in your system:
- **Node.js**: Version 18.x or 20.x is highly recommended.
- **NVM** (Node Version Manager) is recommended for setting versions.

### 1. File Tree Preparation & Cloning
Extract your exported ZIP archive or clone the repository to your local folder:
```bash
git clone <your-exported-github-repo-url>
cd <folder-name>
```

### 2. Dependency Installations
Run standard package manager installs to populate the required binaries and dev dependencies:
```bash
npm install
```

### 3. Environment Secrets Management
Create a local `.env` configuration file in the project's root folder by copying the existing template:
```bash
cp .env.example .env
```
Open `.env` in your editor and enter your actual Google Gemini API Key:
```env
# Stored inside your local workspace directory
GEMINI_API_KEY="AIzaSyYourActualSecretGeminiKeyPlaceholder"
APP_URL="http://localhost:3000"
```
> ⚠️ **IMPORTANT SECURITY NOTICE**: Never commit your active `.env` file containing real secret keys to GitHub. The project's `.gitignore` is already pre-configured to list and filter `.env` files to safeguard security.

---

## 💻 Running the Application

### Development Hot-Reload Engine
Start the development setup. It simultaneously spawns your Express REST server on port `3000` and configures Vite's core compilation pipeline live:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your designated browser to test the reactive dashboard.

### Production Compiling, Packaging & Execution
To verify, build, and deploy the application like an enterprise server pipeline:

1. **Trigger Code Audits & Type Checks**:
   ```bash
   npm run lint
   ```
2. **Compile and Bundle All Production Packages**:
   ```bash
   npm run build
   ```
   *This command outputs static HTML/CSS/JS frontend files under `dist/` and compiles `server.ts` into a fast, standalone ES-bundled CommonJS format in `dist/server.cjs` via esbuild.*
3. **Execute Production Docker Mode / Standalone Core Server**:
   ```bash
   npm run start
   ```

---

## 📂 Source Code Structure Documentation
```text
/
├── .github/
│   └── workflows/
│       └── ci.yml             # Github actions verification suite on PR/Push
├── src/
│   ├── components/            # Extracted UI component files
│   ├── types.ts               # Shared TypeScript schemas
│   ├── App.tsx                # Main Interactive Front-End Dash layout
│   ├── index.css              # Main tailwind theme entries & Google fonts
│   └── main.tsx               # Frontend client entry anchor
├── .env.example               # Secure environment variables template
├── index.html                 # Main single-page application document
├── package.json               # Full NPM system manager scripts
├── server.ts                  # Pure-backend Express router containing GenAI Client lazy initializers
├── tsconfig.json              # Strict compiler definitions
└── vite.config.ts             # Custom compiler pipeline Aliases
```

---

## ⚡ GitHub CI/CD Workflows Status
Your codebase has prebuilt pipeline materials configured inside `.github/workflows/ci.yml`. On every Pull Request or Git Push, GitHub Actions will:
- Spin up an isolated Ubuntu build instance.
- Setup a standardized Node.js caching workflow.
- Complete strict type checks to catch structural omissions early.
- Run complete web bundle compilation commands to secure deployment integrity.
