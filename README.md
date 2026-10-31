# 🔧 FixLens — AI Circuit Doctor

**Understand. Diagnose. Repair.**

FixLens is an AI-powered electronics troubleshooting assistant that helps students, beginners, and electronics enthusiasts understand circuit problems using images and natural language.

Upload a circuit photo, describe the issue, and let **Gemma 4** analyze the available visual information and suggest possible causes, diagnostic checks, and troubleshooting steps.

Built for the **Gemma 4 Hackathon**.

## ✨ Features

- 📸 **Circuit Image Analysis** — Upload a photograph of your electronics project.
- 🧠 **AI-Powered Troubleshooting** — Use Gemma 4 to analyze images alongside problem descriptions.
- 🔍 **Potential Fault Identification** — Explore possible wiring issues and other causes of circuit problems.
- 🛠️ **Step-by-Step Guidance** — Receive an organized troubleshooting checklist.
- 💬 **Interactive Follow-ups** — Provide additional information to refine the analysis.
- 🌓 **Light & Dark Mode** — Switch between themes for a comfortable experience.
- 📚 **Sample Circuits** — Explore example electronics troubleshooting scenarios.
- 🛡️ **Safety-First Design** — Clearly distinguish AI-generated suggestions from verified electrical measurements.

*Features depend on the current implementation. See the project for the functionality actually available.*

## 🎯 The Problem

Troubleshooting electronics can be difficult for beginners. A small wiring mistake, incorrect component orientation, or incomplete connection can prevent a circuit from working.

Beginners may struggle to identify the problem or understand which diagnostic check to perform first.

FixLens aims to make electronics troubleshooting more approachable by combining visual AI analysis with clear, beginner-friendly explanations.

## 💡 Our Solution

FixLens transforms a circuit photograph and a user's description into a structured troubleshooting report.

### How it works

1. **Upload** — Provide a photograph of your circuit.
2. **Describe** — Explain what is happening and what you expected to happen.
3. **Analyze** — Gemma 4 examines the available image and text.
4. **Understand** — Review visible observations and possible causes.
5. **Troubleshoot** — Follow suggested diagnostic checks and provide additional observations.

## 🧰 Tech Stack

The intended technology stack includes:

- **Frontend:** React, TypeScript, and Tailwind CSS
- **AI Model:** Gemma 4
- **AI Integration:** A compatible API or runtime
- **Image Processing:** Image upload and validation
- **Version Control:** Git and GitHub

The actual stack may differ depending on the current implementation.

## 🚀 Getting Started

### Prerequisites

- Node.js and npm if using the React implementation.
- Access to a supported Gemma 4 model.
- The required API credentials or local model runtime.
- Git to clone the repository.

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/fixlens-circuit-doctor.git
```

Navigate to the project directory:

```bash
cd fixlens-circuit-doctor
```

Install the dependencies:

```bash
npm install
```

Configure the environment variables required by your implementation.

For example, if the application uses a backend that reads a Gemma API key:

```env
GEMMA_API_KEY=your_api_key_here
```

**Important:** This is an example variable name. Use the variable name expected by your actual code. Never commit real API keys or secret configuration files to GitHub.

Start the application using the command specified in your project's `package.json`.

For a typical Vite development setup:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

*These commands assume a React/Vite project. If your implementation uses a different framework or runtime, follow its actual setup instructions.*

## 🧪 Example Use Case

**Problem:** An LED connected to an Arduino Uno does not illuminate.

**Input:**
- A photograph of the circuit.
- The components used.
- A description of the observed behavior.

**Expected output:**
- A description of visible components and connections.
- Possible reasons the LED may not illuminate.
- An ordered list of diagnostic checks.
- Missing information that would help narrow down the issue.
- Appropriate safety precautions.

The AI should identify uncertainty rather than claim to have confirmed a fault that cannot be established from the photograph.

## 🛡️ Safety & Limitations

FixLens is an educational troubleshooting assistant, not a substitute for qualified electrical expertise.

- AI-generated diagnoses may be incorrect.
- Photographs may not reveal hidden connections or electrical measurements.
- Always verify connections against reliable circuit documentation.
- Disconnect power before changing wiring.
- Never touch exposed live conductors.
- Seek qualified assistance for hazardous electrical conditions.

**Always verify AI-generated recommendations before acting on them.**

## 🌱 Future Improvements

Potential improvements include:

- More supported electronic components.
- Better circuit-reference matching.
- Guided, multi-step diagnostic workflows.
- Verified troubleshooting examples.
- Improved handling of unclear photographs.
- Downloadable diagnostic reports.
- Additional educational resources for beginners.

## 🤝 Contributing

Contributions and suggestions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your implementation.
5. Submit a pull request describing your changes.

Please do not include API keys, private credentials, or sensitive user data in contributions.

## 🏆 Hackathon Project

FixLens was created as a project for the **Gemma 4 Hackathon**, exploring how multimodal AI can make electronics troubleshooting more accessible to beginners.

The goal is to turn circuit photographs and problem descriptions into useful, understandable diagnostic guidance.

## 📄 License

If this project is released under the MIT License, add a `LICENSE` file containing the appropriate license text. Otherwise, specify the license you have chosen.

---

**FixLens — Understand. Diagnose. Repair.** 🔧
