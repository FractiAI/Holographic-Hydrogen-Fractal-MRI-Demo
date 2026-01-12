# Contributing to Holographic Hydrogen Fractal MRI Demo

First off, thank you for considering contributing to the Holographic Hydrogen Fractal MRI Demo! It's people like you that make this educational tool valuable for students and researchers worldwide.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

**Bug Report Template**:
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome 120, Firefox 122]
 - Node version: [e.g. 18.0.0]

**Additional context**
Any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Explanation of why this enhancement would be useful**
- **Possible implementation approach**
- **Examples from other projects** (if applicable)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our code style guidelines
3. **Test thoroughly** - ensure all stages work correctly
4. **Update documentation** if you've changed APIs or added features
5. **Write meaningful commit messages**
6. **Submit a pull request**

## 💻 Development Process

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Holographic-Hydrogen-Fractal-MRI-Demo.git

# Navigate to directory
cd Holographic-Hydrogen-Fractal-MRI-Demo

# Install dependencies
npm install

# Create a branch
git checkout -b feature/your-feature-name

# Start development server
npm run dev
```

### Code Style Guidelines

#### TypeScript
- Use TypeScript for all new files
- Enable strict mode compliance
- Provide proper type annotations
- Avoid `any` types when possible

```typescript
// Good
interface SpinState {
  Mx: number
  My: number
  Mz: number
}

// Avoid
const spinState: any = { ... }
```

#### React Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use descriptive prop names

```typescript
// Good
interface MyComponentProps {
  onUpdate: (value: number) => void
  initialValue: number
}

export default function MyComponent({ onUpdate, initialValue }: MyComponentProps) {
  // Component logic
}
```

#### Naming Conventions
- **Components**: PascalCase (`TeslaAssistant`, `BlochSimulator`)
- **Functions**: camelCase (`calculateMagnetization`, `applyRFPulse`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_MRI_PARAMS`, `TESLA_SYSTEM_PROMPT`)
- **Files**: Match component name or describe content clearly

#### Comments
- Comment complex physics calculations
- Explain "why" not "what" for non-obvious code
- Use JSDoc for public APIs

```typescript
/**
 * Applies an RF pulse to hydrogen spins
 * @param pulse - Pulse parameters (angle, phase, duration)
 * @param spinIndex - Optional specific spin to affect
 */
applyRFPulse(pulse: RFPulse, spinIndex?: number): void
```

### Testing Your Changes

Before submitting a PR, ensure:

- [ ] All stages load without errors
- [ ] Tesla AI assistant appears and responds
- [ ] 3D visualizations render correctly
- [ ] Controls are responsive
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Code follows style guidelines
- [ ] Documentation is updated

### Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add spin echo sequence simulation
fix: resolve Tesla avatar positioning issue
docs: update API documentation for BlochSimulator
style: format code with prettier
refactor: extract common visualization logic
test: add unit tests for magnetization calculations
chore: update dependencies
```

## 🎨 Areas for Contribution

### High Priority
- [ ] Additional pulse sequences (FLAIR, diffusion-weighted)
- [ ] Voice synthesis for Tesla (text-to-speech)
- [ ] Mobile optimization improvements
- [ ] Accessibility enhancements (ARIA labels, keyboard nav)
- [ ] Unit tests for physics engine

### Medium Priority
- [ ] K-space visualization
- [ ] Image reconstruction from k-space
- [ ] Multi-tissue phantoms
- [ ] Save/load experiment configurations
- [ ] Internationalization (i18n)

### Low Priority
- [ ] Additional AI models (GPT-4, Claude)
- [ ] VR/AR support
- [ ] Multiplayer collaborative experiments
- [ ] Teacher dashboard for tracking progress

## 🔬 Physics Contributions

If you're contributing to the MRI physics engine:

### Accuracy Requirements
- Reference peer-reviewed literature
- Cite equations and sources
- Validate against known results
- Document assumptions and limitations

### Example Physics Contribution

```typescript
/**
 * Simulates diffusion-weighted imaging
 * Reference: Le Bihan et al. (1988) Radiology
 * 
 * Signal attenuation: S = S0 * exp(-b * D)
 * where b is the b-value and D is the diffusion coefficient
 */
simulateDiffusionWeighting(bValue: number, diffusionCoeff: number): number {
  const S0 = this.getSignal().magnitude
  return S0 * Math.exp(-bValue * diffusionCoeff)
}
```

## 🤖 AI Contributions

For Tesla AI enhancements:

### Prompt Engineering
- Maintain Tesla's personality
- Keep explanations age-appropriate (10+)
- Balance accuracy with accessibility
- Test with diverse user queries

### Adding New AI Features
- Document API changes
- Include example conversations
- Test edge cases
- Consider rate limiting

## 📖 Documentation Contributions

### Types of Documentation
- **Code Comments**: Inline explanations
- **API Docs**: Function/class documentation
- **Tutorials**: Step-by-step guides
- **Explanations**: Conceptual overviews

### Documentation Standards
- Clear and concise language
- Include code examples
- Add screenshots/diagrams when helpful
- Keep it up-to-date with code changes

## 🎓 Educational Content

If contributing educational content:

- **Target Audience**: 10-year-old students
- **Tone**: Enthusiastic and encouraging
- **Accuracy**: Scientifically correct but simplified
- **Examples**: Concrete, relatable analogies
- **Visuals**: Colorful and engaging

## 🐛 Bug Triage Process

For maintainers and active contributors:

1. **Label Issues**: bug, enhancement, documentation, etc.
2. **Prioritize**: critical, high, medium, low
3. **Assign**: To appropriate contributor
4. **Track**: Update status regularly
5. **Close**: When resolved and verified

## 🏆 Recognition

Contributors will be recognized in:
- README.md acknowledgments section
- GitHub contributors page
- Release notes (for significant contributions)

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Don't hesitate to ask questions:
- **GitHub Discussions**: For general questions
- **GitHub Issues**: For specific problems
- **Email**: info@fractiai.com for private inquiries

## 🙏 Thank You!

Your contributions help make awareness energy education accessible to students worldwide. Every improvement, no matter how small, makes a difference!

---

**"The present is theirs; the future, for which I really worked, is mine."**  
— Nikola Tesla

Let's build that future together! ⚡



