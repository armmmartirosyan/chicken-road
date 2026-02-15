# Contributing to Chicken Road Game

First off, thank you for considering contributing to Chicken Road Game! It's people like you that make this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful, inclusive, and professional in all interactions.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Setting Up Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/chicken-road-game.git
   cd chicken-road-game
   ```

3. Add the original repository as upstream:

   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/chicken-road-game.git
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open http://localhost:5173 in your browser

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## Development Process

### 1. Choose an Issue

- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it
- Ask questions if anything is unclear

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates
- `chore/` - Build process or tooling changes

### 3. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests if applicable
- Update documentation as needed
- Test thoroughly

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new obstacle system"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### JavaScript/JSX

#### General Principles

- **Clarity over cleverness**: Write code that's easy to understand
- **DRY (Don't Repeat Yourself)**: Extract common patterns
- **SOLID principles**: Apply when appropriate
- **Separation of concerns**: Keep game logic separate from React

#### Naming Conventions

```javascript
// Classes: PascalCase
class ChickenEntity {}

// Functions/methods: camelCase
function updateGameState() {}

// Constants: UPPER_SNAKE_CASE
const MAX_LANE_COUNT = 30;

// Private properties: prefix with underscore
class Game {
  _privateMethod() {}
}

// React components: PascalCase
function GameCanvas() {}

// React hooks: camelCase with 'use' prefix
function useGame() {}
```

#### React Best Practices

```javascript
// ✅ Good: Functional components with hooks
export function GameCanvas() {
  const [state, setState] = useState(initialState);
  return <div>...</div>;
}

// ✅ Good: Extract custom hooks
function useGameLogic() {
  // Hook logic
}

// ✅ Good: Use refs for game instances
const gameRef = useRef(null);

// ❌ Bad: Don't access ref.current during render
return <div>{gameRef.current.state}</div>;

// ✅ Good: Use state for render-dependent values
const [gameState, setGameState] = useState("idle");
return <div>{gameState}</div>;
```

#### Game Code Best Practices

```javascript
// ✅ Good: Pure game logic, no React dependencies
export class Game {
  update(deltaTime) {
    this.entities.forEach(e => e.update(deltaTime));
  }
}

// ❌ Bad: Mixing React with game logic
export class Game {
  update(deltaTime) {
    this.setState({ ... }); // Don't do this!
  }
}

// ✅ Good: Use events for React communication
game.on('stateChange', (data) => {
  setGameState(data);
});

// ✅ Good: Document public APIs
/**
 * Update the game state
 * @param {number} deltaTime - Time since last update in seconds
 */
update(deltaTime) { }
```

#### File Organization

```javascript
// Order within a file:
// 1. Imports
import { useState } from "react";
import { Game } from "../game/core/Game";

// 2. Constants
const DEFAULT_CONFIG = {};

// 3. Helper functions
function calculatePosition() {}

// 4. Main component/class
export function GameCanvas() {}

// 5. Styles (if inline)
const styles = {};
```

### CSS

#### Naming Convention

Use BEM (Block Element Modifier):

```css
/* Block */
.game-canvas {
}

/* Element */
.game-canvas__loading {
}

/* Modifier */
.game-canvas--fullscreen {
}
```

#### Organization

```css
/* 1. Positioning */
.element {
  position: relative;
  top: 0;
  left: 0;
}

/* 2. Display & Box Model */
.element {
  display: flex;
  width: 100%;
  padding: 10px;
  margin: 5px;
}

/* 3. Typography */
.element {
  font-size: 16px;
  color: #333;
}

/* 4. Visual */
.element {
  background: #fff;
  border: 1px solid #ccc;
}

/* 5. Misc */
.element {
  cursor: pointer;
  transition: all 0.3s;
}
```

### Comments and Documentation

```javascript
// ✅ Good: JSDoc for public APIs
/**
 * Create a new game instance
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Object} config - Game configuration
 * @returns {Game} The game instance
 */
export function createGame(canvas, config) {}

// ✅ Good: Explain complex logic
// Calculate the spawn position based on lane index
// and road offset to ensure proper alignment
const spawnX = laneIndex * LANE_WIDTH + roadOffset;

// ❌ Bad: Obvious comments
// Set x to 0
x = 0;

// ✅ Good: TODO comments with context
// TODO: Implement collision detection for circular entities
// Currently only supporting rectangular bounds (AABB)
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, tooling, dependencies

### Examples

```bash
feat(entities): add obstacle entity with collision detection

Implemented a new Obstacle entity that spawns on lanes
and moves across the screen. Added AABB collision detection
in the CollisionSystem.

Closes #123
```

```bash
fix(camera): correct pan calculation for high DPI displays

Fixed camera panning that was too sensitive on retina displays
by accounting for devicePixelRatio in the drag delta calculation.
```

```bash
docs(readme): update installation instructions

Added clarification about Node.js version requirements
and alternative package managers.
```

### Commit Best Practices

- Write clear, concise commit messages
- Use present tense ("add feature" not "added feature")
- Limit first line to 72 characters
- Reference issues and PRs when relevant
- Make atomic commits (one logical change per commit)

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Tested on different screen sizes (if UI changes)
- [ ] Linter passes (`npm run lint`)

### PR Description Template

```markdown
## Description

Brief description of what this PR does

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made

- List of changes
- One per line

## Testing

How did you test this?

- [ ] Local development server
- [ ] Production build
- [ ] Multiple browsers

## Screenshots (if applicable)

Add screenshots here

## Related Issues

Closes #123
```

### Review Process

1. Maintainer will review your PR
2. Address any requested changes
3. Once approved, maintainer will merge
4. Your contribution will be credited

### After Merge

- Delete your feature branch (locally and on GitHub)
- Pull the latest changes from main
- Celebrate! 🎉

## Project Structure

### Key Directories

```
src/
├── game/           # Pure game engine (no React)
├── components/     # React components
├── hooks/          # Custom React hooks
├── config/         # Game configuration
├── constants/      # Constants and enums
└── utils/          # Utility functions
```

### Adding New Files

- Game logic → `src/game/`
- React components → `src/components/`
- Hooks → `src/hooks/`
- Shared utilities → `src/utils/`

Always add index files for exports:

```javascript
// src/game/entities/index.js
export { Chicken } from "./Chicken.js";
export { Road } from "./Road.js";
```

## Testing

### Running Tests

```bash
# Run linter
npm run lint

# Build to check for errors
npm run build
```

### Writing Tests (Future)

When unit tests are added:

```javascript
describe("Chicken Entity", () => {
  it("should update animation time", () => {
    const chicken = new Chicken(0, 0, config);
    chicken.update(0.016);
    expect(chicken.animationTime).toBeGreaterThan(0);
  });
});
```

## Documentation

### When to Update Docs

- Adding new features
- Changing existing behavior
- Adding new APIs
- Fixing bugs that might confuse users

### Documentation Files

- `README.md` - User-facing documentation
- `ARCHITECTURE.md` - Technical architecture details
- `CONTRIBUTING.md` - This file
- JSDoc comments - API documentation in code

### JSDoc Style

```javascript
/**
 * Brief description
 *
 * Detailed explanation if needed
 *
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 * @throws {Error} When something goes wrong
 * @example
 * const result = myFunction(123);
 */
export function myFunction(paramName) {}
```

## Questions?

- Open an issue with the `question` label
- Check existing documentation
- Review closed PRs for similar changes

## Recognition

Contributors will be:

- Listed in the README
- Credited in release notes
- Appreciated for their time and effort!

---

Thank you for contributing! 🐔❤️
