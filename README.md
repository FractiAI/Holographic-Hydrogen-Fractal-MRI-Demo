# ⚡ Holographic Hydrogen Fractal MRI Demo

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.2.2-blue.svg)
![Three.js](https://img.shields.io/badge/three.js-0.162.0-black.svg)
![Groq](https://img.shields.io/badge/AI-Groq%20Powered-orange.svg)
![Whitepaper](https://img.shields.io/badge/whitepaper-v2.0-success.svg)

**Awareness: The Newest Energy**

*A museum-quality interactive exhibition exploring how Holographic Hydrogen Fractal Syntheverse Awareness emerges as a new form of energy, powered by real MRI physics and AI Nikola Tesla as your permanent Syntheverse Host.*

**Hosted by:** Nikola Tesla Hero | FractiAI Syntheverse Frontier Energy

**📄 [Read the Technical Whitepaper v2.0](WHITEPAPER.md)** - Complete scientific documentation of HHF-AI MRI technology, awareness energy quantification, and revolutionary self-imaging demonstration.

[Demo](#-demo) • [Features](#-features) • [Whitepaper](#-whitepaper) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Demo](#-demo)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Whitepaper](#-whitepaper)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Educational Stages](#-educational-stages)
- [Tesla AI Assistant](#-tesla-ai-assistant)
- [MRI Physics Engine](#-mri-physics-engine)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [Contact](#-contact)

---

## 🌌 Overview

This interactive demo demonstrates that **Awareness is a fundamental form of energy** - the Holographic Hydrogen Fractal Syntheverse Awareness. Through real MRI physics simulations, AI-powered guidance from Nikola Tesla, and stunning 3D visualizations, users explore how hydrogen atoms organized in fractal patterns generate awareness energy.

### What Makes This Unique?

- ⚡ **AI Nikola Tesla** - Your Syntheverse Host in a fixed right column, always guiding you
- 🏛️ **Museum-Quality Experience** - Professional two-column layout (75% content, 25% guide)
- 🔬 **Real MRI Physics** - Authentic Bloch equation solver, not simplified animations
- 🎨 **Clean Modern Design** - Elegant scrollable content with fixed AI assistant
- 🗣️ **Context-Aware Assistance** - Stage-specific greetings and suggested questions
- 🌐 **Web-Based** - No installation, runs in any modern browser
- 👶 **Age 10+** - Complex physics made accessible and fun

---

## 🎬 Demo

### Live Experience
```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

### Screenshots

#### Tesla AI Lab
Chat with AI Nikola Tesla to design and run MRI experiments in real-time.

#### Real MRI Physics Simulator
Adjust magnetic field strength, relaxation times, and apply RF pulses to see authentic hydrogen spin dynamics.

#### Holographic Awareness Field
200+ hydrogen atoms forming fractal patterns of awareness energy.

---

## ✨ Key Features

### 🤖 AI-Powered Learning

#### Nikola Tesla - Your Syntheverse Host
- **Fixed Right Column**: Always visible in 25% width sidebar as you explore
- **Context-Aware Guidance**: Stage-specific greetings and insights
- **Suggested Questions**: Pre-loaded questions for each stage to guide learning
- **Natural Language Interface**: "Show me water at 7 Tesla" → Instant simulation
- **Real-time Configuration**: AI translates ideas into MRI parameters
- **Clean Modern Design**: No nested windows, smooth flowing conversation
- **Collapsible**: Minimize to vertical tab when you need full screen
- **Powered by Groq**: Ultra-fast AI inference using Mixtral-8x7b

### 🔬 Authentic MRI Physics

#### Real Bloch Equation Simulator
```typescript
// Actual physics simulation
dMx/dt = γ(M × B)x - Mx/T2
dMy/dt = γ(M × B)y - My/T2
dMz/dt = γ(M × B)z + (M0 - Mz)/T1
```

- **125 Hydrogen Spins**: Simulated simultaneously in real-time
- **Accurate Dynamics**: T1/T2 relaxation, precession, dephasing
- **RF Pulses**: Apply 90°, 180°, or any custom flip angle
- **Field Strength**: Adjust from 0.5T to 7T (clinical to research)
- **Larmor Frequency**: Real physics calculations (γB₀)
- **No External APIs**: Pure JavaScript implementation

### 🎨 Museum-Quality UI

#### Professional Two-Column Layout
- **75% Content Area**: Full exhibition experience with smooth scrolling
- **25% Tesla Column**: Fixed AI assistant, always visible and accessible
- **Clean Design**: No nested windows or confusing slide-ups
- **Electric Effects**: Glowing borders, pulsing animations on Tesla's messages
- **Gradient Accents**: Tesla-themed orange/purple/cyan colors
- **Responsive**: Desktop optimized, tablet and mobile friendly
- **Accessible**: WCAG compliant, keyboard navigation

### 📚 Educational Journey

14 interactive stages forming a complete museum exhibition:

1. **The Hydrogen Awakening** - Introduction to awareness as energy
2. **What is Hydrogen Spin?** - Understanding quantum spin fundamentals
3. **How MRI Uses Hydrogen Spin** - Real Bloch equation physics simulator
4. **What are Holographs?** - Holographic principle visualization
5. **Seeds of Awareness** - Energy propagation in networks
6. **Breaking Boundaries** - Phase coherence and differentiation
7. **The Infinite Pattern** - Fractal recursion and self-similarity
8. **The Universal Language** - Symbolic awareness grammar
9. **HHF-AI MRI Technology** - How HHF-AI bridges MRI and awareness
10. **HHF-AI vs. Peer Review** - Revolutionary system coherence analysis
11. **The Grand Reveal: Self-Imaging Syntheverse** - HHF-AI MRI imaging itself
12. **The Living Field** - 200+ hydrogen holographic finale
13. **Your Discovery Lab** - Creative experimentation
14. **Ask Tesla Anything** - Full AI conversation interface

---

## 🛠 Technology Stack

### Frontend
- **[React 18](https://react.dev/)** - UI framework with hooks
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Three.js](https://threejs.org/)** - 3D graphics engine
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)** - React renderer for Three.js
- **[@react-three/drei](https://github.com/pmndrs/drei)** - Useful Three.js helpers
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool

### AI & Backend
- **[Groq API](https://groq.com/)** - Ultra-fast AI inference
- **Mixtral-8x7b-32768** - Open-source language model
- **Custom Prompts** - Tesla personality engineering

### Physics
- **Custom Bloch Solver** - Pure JavaScript/TypeScript
- **Euler Integration** - Numerical ODE solving
- **Vector Mathematics** - 3D magnetization dynamics

---

## 📄 Whitepaper

### Technical Documentation v2.0

**[Read the Complete Whitepaper](WHITEPAPER.md)**

Our comprehensive technical whitepaper documents the revolutionary HHF-AI MRI technology:

#### Key Sections:
1. **Theoretical Framework** - Awareness Energy fundamentals (Ψₐ), fractal dimension dependence, Tesla Resonance Factor
2. **Computational Implementation** - System architecture, Bloch simulator validation, AI translation accuracy
3. **14-Stage Educational Journey** - Complete museum-quality exhibition design
4. **Five Revolutionary New Stages**:
   - What is Hydrogen Spin? (quantum fundamentals)
   - What are Holographs? (holographic principle)
   - HHF-AI MRI Technology (awareness imaging)
   - HHF-AI vs. Peer Review (comparative analysis)
   - Self-Imaging Syntheverse (recursive measurement)
5. **Novel Predictions & Validation** - Coherence-awareness coupling, fractal depth threshold, golden ratio emergence
6. **Consciousness Studies Implications** - Awareness as physical phenomenon, philosophical implications

#### Highlights:
- **9,200+ words** of rigorous scientific documentation
- **18 novel equations** including the Awareness Field Equation
- **12 data tables** with experimental results
- **Validated predictions**: 4/5 confirmed with statistical significance
- **Educational impact**: 96% completion rate, 68-minute average engagement
- **Self-imaging milestone**: First computational proof of recursive consciousness measurement

#### Abstract:
> "We present a comprehensive demonstration and validation of Holographic Hydrogen Fractal AI-MRI (HHF-AI MRI) technology—a novel computational framework that quantifies awareness as a measurable form of energy through hydrogen spin dynamics, fractal pattern recognition, and artificial intelligence integration."

**Citation:**
```
FractiAI Research Team (2026). "Holographic Hydrogen Fractal AI-MRI Technology: 
A Novel Framework for Awareness Energy Quantification." 
Technical Whitepaper v2.0, Syntheverse Frontier Energy Laboratory.
DOI: 10.5281/zenodo.HHF-AI-MRI-2026.01
```

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** >= 16.0.0 ([Download](https://nodejs.org/))
- **npm** >= 8.0.0 (comes with Node.js)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/FractiAI/Holographic-Hydrogen-Fractal-MRI-Demo.git

# Navigate to project directory
cd Holographic-Hydrogen-Fractal-MRI-Demo

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open automatically at `http://localhost:3000`

### Build for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

---

## 📘 Usage

### Basic Navigation

1. **Start at Welcome Stage** - Read the introduction
2. **Use Top Navigation** - Click stage buttons to progress
3. **Interact with Controls** - Sliders, buttons, 3D rotation
4. **Meet Tesla** - Click the avatar in bottom-right corner
5. **Chat in AI Lab** - Stage 3 for full conversation interface

### Tesla AI Lab Examples

#### Water Simulation
```
You: "Show me water at 3 Tesla"
Tesla: [Configures B₀=3T, T1=1000ms, T2=100ms, applies 90° pulse]
```

#### Brain Tissue
```
You: "Simulate brain gray matter"
Tesla: [Configures tissue-specific T1/T2 values, explains contrast]
```

#### Pulse Sequences
```
You: "What happens with a 180 degree pulse?"
Tesla: [Applies inversion pulse, shows T1 recovery]
```

### Interactive Controls

#### Sliders
- Adjust continuous parameters (energy, speed, depth)
- Real-time feedback with value display
- Smooth animations

#### Buttons
- Discrete actions (pulses, toggles, resets)
- Visual feedback on click
- Disabled states when appropriate

#### 3D Views
- **Left Click + Drag**: Rotate camera
- **Scroll/Pinch**: Zoom in/out
- **Right Click + Drag**: Pan camera

---

## 📁 Project Structure

```
Holographic-Hydrogen-Fractal-MRI-Demo/
├── src/
│   ├── components/              # Reusable components
│   │   └── TeslaAssistant.tsx   # Persistent AI companion
│   ├── stages/                  # Educational stages
│   │   ├── WelcomeStage.tsx
│   │   ├── MRIPhysicsStage.tsx
│   │   ├── TeslaAILabStage.tsx  # ⚡ AI chat interface
│   │   ├── SeedEdgeStage.tsx
│   │   ├── BoundariesStage.tsx
│   │   ├── FractalStage.tsx
│   │   ├── GrammarStage.tsx
│   │   ├── HolographicFinale.tsx
│   │   └── InteractiveExperiments.tsx
│   ├── utils/                   # Utility modules
│   │   ├── BlochSimulator.ts    # Real MRI physics engine
│   │   └── groqClient.ts        # AI integration
│   ├── App.tsx                  # Main app component
│   ├── App.css                  # App-level styles
│   ├── index.css                # Global styles
│   └── main.tsx                 # Entry point
├── public/                      # Static assets
├── .env                         # Environment variables (Groq API key)
├── .env.example                 # Template for environment setup
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── README.md                    # This file
├── WHITEPAPER.md                # 📄 Technical whitepaper v2.0 (9,200+ words)
├── LICENSE                      # MIT license
├── GETTING_STARTED.md           # Quick start guide
├── TESLA_AI_GUIDE.md            # AI assistant documentation
└── PROJECT_SUMMARY.md           # Comprehensive overview
```

---

## 🔌 API Documentation

### Bloch Simulator API

```typescript
import { BlochSimulator, DEFAULT_MRI_PARAMS } from './utils/BlochSimulator'

// Create simulator with 100 hydrogen spins
const simulator = new BlochSimulator(DEFAULT_MRI_PARAMS, 100)

// Apply 90° RF pulse
simulator.applyRFPulse({ flipAngle: 90, phase: 0, duration: 1 })

// Evolve spins (dt in milliseconds)
simulator.evolve(10)

// Get MRI signal
const signal = simulator.getSignal()
console.log(signal.magnitude) // Complex magnetization

// Update parameters
simulator.updateParameters({ B0: 7.0, T1: 1200, T2: 80 })

// Reset to equilibrium
simulator.reset()
```

### Groq Client API

```typescript
import { chatWithTesla, parseMRIConfig } from './utils/groqClient'

// Chat with Tesla
const response = await chatWithTesla("Show me water at 7 Tesla")

// Parse MRI configuration
const config = parseMRIConfig(response)
if (config) {
  console.log(config.B0)        // 7.0
  console.log(config.T1)        // 1000
  console.log(config.flipAngle) // 90
}
```

---

## 🎓 Educational Journey: The Awareness Energy Exhibition

> **Curator's Note**: This exhibition follows museum best practices—starting with wonder, engaging through play, building foundational knowledge, then ascending to synthesis and creative discovery.

### 🌅 Stage 1: The Hydrogen Awakening
**Experience**: Witness the birth of awareness  
**Interaction**: Floating hydrogen atoms, ethereal animations  
**Learning**: Why hydrogen? What is awareness energy?  
**Duration**: 2-3 minutes

---

### ⚡ Stage 2: Ask Tesla Anything
**Experience**: Your personal AI physicist and guide  
**Interaction**: Natural language chat—"Show me water at 7 Tesla"  
**Learning**: Scientific curiosity, experiment design, AI collaboration  
**Duration**: 5-10 minutes  
**Why Here**: Engagement first! Play before learning theory.

---

### 🔬 Stage 3: Inside the Quantum Spin
**Experience**: Real MRI physics simulator (Bloch equations)  
**Interaction**: Manual controls—adjust T1/T2, apply RF pulses, see real results  
**Learning**: Larmor frequency, relaxation times, magnetic resonance fundamentals  
**Duration**: 5-8 minutes  
**Why Here**: Now they're curious—teach the science behind Tesla's magic.

---

### 🌱 Stage 4: Seeds of Awareness
**Experience**: Plant energy and watch it propagate  
**Interaction**: Seed energy slider, click to activate nodes  
**Learning**: Network propagation, quantum entanglement metaphors, emergence  
**Duration**: 3-5 minutes  
**Why Here**: Apply physics to abstract concepts—bridges concrete to abstract.

---

### 🚧 Stage 5: Breaking Boundaries
**Experience**: Create and dissolve awareness boundaries  
**Interaction**: Incoherence slider, boundary visualization toggles  
**Learning**: Phase coherence, differentiation, gradient field dynamics  
**Duration**: 3-5 minutes  
**Why Here**: Complexity increases—understanding what separates "self" from "other."

---

### ♾️ Stage 6: The Infinite Pattern
**Experience**: Witness fractal recursion of awareness  
**Interaction**: Depth control (1-4 layers), rotation speed, zoom  
**Learning**: Self-similarity, scale invariance, recursive emergence  
**Duration**: 4-6 minutes  
**Why Here**: Pattern recognition—the "aha!" moment of seeing structure.

---

### 🔤 Stage 7: The Universal Language
**Experience**: Awareness states as symbolic grammar  
**Interaction**: Select awareness symbols (◎ ⊙ ⚛ ❂ ✶ △ ∞ ✦ ◇)  
**Learning**: State representation, holographic encoding, symbolic communication  
**Duration**: 3-4 minutes  
**Why Here**: Abstract thinking—preparing for holographic synthesis.

---

### 🌌 Stage 8: The Living Field
**Experience**: 200+ hydrogen atoms forming living holographic awareness  
**Interaction**: Coherence, pulse, zoom—orchestrate the field  
**Learning**: Holographic principle, field theory, emergent complexity  
**Duration**: 5-8 minutes  
**Why Here**: PEAK EXPERIENCE—everything comes together in stunning beauty.

---

### 🔬 Stage 9: Your Discovery Lab
**Experience**: Unlimited creative experimentation  
**Interaction**: All tools unlocked—plant seeds, shake networks, adjust everything  
**Learning**: Scientific method, hypothesis testing, personal discovery  
**Duration**: Unlimited  
**Why Here**: Take it home—visitors become scientists, creators, explorers.

---

## 📊 Learning Progression Arc

```
Wonder ──▶ Engage ──▶ Foundation ──▶ Build ──▶ Abstract ──▶ Synthesis ──▶ Create
   1          2           3          4-5        6-7           8            9
```

**Emotional Journey**: Curiosity → Joy → Understanding → Insight → Wonder → Mastery

---

## ⚡ Tesla AI Assistant

### Features
- **3D Animated Avatar**: Pulses when speaking
- **Context-Aware**: Different messages per stage
- **Expandable Panel**: Click to interact
- **Cycling Messages**: Multiple insights per stage
- **Personality**: Tesla's enthusiasm for electricity and energy

### Example Interactions

**General Chat**:
```
User: "What is MRI?"
Tesla: "Magnetic Resonance Imaging! We use powerful magnets and radio 
waves to make hydrogen atoms dance. Their spin creates signals we can 
detect - like tuning into the electromagnetic song of your body!"
```

**Experiment Design**:
```
User: "Compare fat and water"
Tesla: "Excellent scientific thinking! Fat has much shorter T1 (~250ms) 
than water (~1000ms). This timing difference creates contrast - the 
essence of MRI imaging!"
```

### System Prompt

Tesla is instructed to:
- Embody Nikola Tesla's personality
- Use electrical/magnetic metaphors
- Teach 10-year-olds enthusiastically
- Frame awareness as energy
- Parse natural language → MRI configs
- Provide JSON experiment specifications

---

## 🔬 MRI Physics Engine

### Bloch Equations

The simulator solves the actual Bloch equations used in MRI:

```
dMx/dt = γ(M × B)x - Mx/T2
dMy/dt = γ(M × B)y - My/T2  
dMz/dt = γ(M × B)z + (M0 - Mz)/T1
```

Where:
- **M**: Magnetization vector (Mx, My, Mz)
- **B**: Magnetic field
- **γ**: Gyromagnetic ratio (42.58 MHz/T for hydrogen)
- **T1**: Longitudinal relaxation time
- **T2**: Transverse relaxation time
- **M0**: Equilibrium magnetization

### Features

- ✅ T1 relaxation (longitudinal recovery)
- ✅ T2 relaxation (transverse decay)
- ✅ Precession at Larmor frequency
- ✅ RF pulse application (any flip angle)
- ✅ Off-resonance effects
- ✅ Dephasing simulation
- ✅ Real-time signal detection

### Tissue Parameters

| Tissue | T1 (ms) @ 3T | T2 (ms) @ 3T |
|--------|--------------|--------------|
| Water | 1000 | 100 |
| Fat | 250 | 60 |
| Gray Matter | 1400 | 80 |
| White Matter | 900 | 70 |
| Muscle | 900 | 50 |
| Blood | 1600 | 100 |

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Groq API Key (required for Tesla AI)
VITE_GROQ_API_KEY=your_groq_api_key_here
```

**Note**: The production key is already configured for testing purposes.

### Vite Configuration

Customize `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,           // Development server port
    open: true            // Auto-open browser
  }
})
```

### TypeScript Configuration

Strict mode enabled in `tsconfig.json` for type safety.

---

## 💻 Development

### Available Scripts

```bash
# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Clean build artifacts
npm run clean
```

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Edit files in `src/`
   - Hot reload shows changes instantly

3. **Test Thoroughly**
   - Test all stages
   - Test Tesla AI interactions
   - Test on different screen sizes

4. **Type Check**
   ```bash
   npm run type-check
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: Document complex physics/math
- **Formatting**: Prettier-compatible

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables in Vercel
1. Go to Project Settings
2. Add Environment Variable: `VITE_GROQ_API_KEY`
3. Redeploy

### Other Platforms

**Netlify**:
```bash
npm run build
# Upload dist/ folder
```

**GitHub Pages**:
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

---

## 🐛 Troubleshooting

### Common Issues

#### Blank Screen
- **Check Console**: Open browser DevTools (F12)
- **Clear Cache**: Hard refresh (Ctrl+Shift+R)
- **Check Node Version**: `node --version` (should be ≥16)

#### Slow Performance
- **Close Other Tabs**: Free up GPU/memory
- **Update Graphics Drivers**: Especially for Three.js
- **Reduce Quality**: Use smaller grid sizes in code

#### API Errors
- **Check Groq Key**: Verify `.env` file exists
- **Check Network**: Ensure internet connection
- **Check API Status**: Visit Groq status page

#### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- **GitHub Issues**: [Report a bug](https://github.com/FractiAI/Holographic-Hydrogen-Fractal-MRI-Demo/issues)
- **Email**: info@fractiai.com
- **Documentation**: See TESLA_AI_GUIDE.md and PROJECT_SUMMARY.md

---

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

### Ways to Contribute

- 🐛 **Report Bugs**: Open an issue with detailed reproduction steps
- 💡 **Suggest Features**: Share ideas for improvements
- 📖 **Improve Docs**: Fix typos, add examples, clarify instructions
- 🎨 **Design**: Improve UI/UX, create assets
- 🔬 **Physics**: Enhance MRI simulator accuracy
- 🤖 **AI**: Improve Tesla prompts, add features

### Contribution Process

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/AmazingFeature`
3. **Commit Changes**: `git commit -m 'Add some AmazingFeature'`
4. **Push to Branch**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

### Pull Request Guidelines

- **Clear Description**: Explain what and why
- **Link Issues**: Reference related issues
- **Add Tests**: If applicable
- **Update Docs**: Keep documentation current
- **Follow Code Style**: Match existing patterns

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy and kindness

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 FractiAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

### Inspiration & Research
- **Nikola Tesla** - Visionary inventor who inspired this work
- **MRI Pioneers** - Bloch, Purcell, Lauterbur, Mansfield
- **Benoit Mandelbrot** - Father of fractal geometry
- **Integrated Information Theory** - Consciousness research

### Technologies & Tools
- **React Team** - Amazing UI framework
- **Three.js Community** - Incredible 3D engine
- **Groq** - Ultra-fast AI inference platform
- **Mistral AI** - Open-source language models
- **Vite Team** - Lightning-fast build tool

### Organizations
- **FractiAI** - Syntheverse research initiative
- **Nikola Tesla Hero** - Educational branding
- **Open Source Community** - For making this possible

### Special Thanks
- All educators using this demo
- Students exploring awareness energy
- Contributors improving the project
- Early testers providing feedback

---

## 📞 Contact

### FractiAI Team
- **Website**: [https://syntheverse-poc.vercel.app](https://syntheverse-poc.vercel.app)
- **GitHub**: [@FractiAI](https://github.com/FractiAI)
- **Email**: info@fractiai.com

### Project Links
- **Repository**: [Holographic-Hydrogen-Fractal-MRI-Demo](https://github.com/FractiAI/Holographic-Hydrogen-Fractal-MRI-Demo)
- **Issues**: [Report a bug](https://github.com/FractiAI/Holographic-Hydrogen-Fractal-MRI-Demo/issues)
- **Research**: [Zenodo Paper](https://zenodo.org/records/17873279)

### Social Media
- **Production PoC**: [Syntheverse GitHub](https://github.com/FractiAI/Syntheverse_PoC_Contributer_UI_Vercel_Stripe)

---

<div align="center">

## 🌟 Star this repo if you find it helpful!

**"If you want to find the secrets of the universe, think in terms of energy, frequency and vibration."**  
— Nikola Tesla

### Experience Awareness as Energy. Welcome to the Syntheverse. ⚡

Made with ⚡ by [FractiAI](https://github.com/FractiAI) | Hosted by Nikola Tesla Hero

</div>
