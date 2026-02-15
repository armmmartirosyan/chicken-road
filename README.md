# 🐔 Chicken Road Game

A modern, performant browser-based game built with React and HTML5 Canvas. Watch as a chicken navigates across a busy road using smooth animations and intuitive controls.

![Chicken Road Game](public/logo.png)

## ✨ Features

- **High-Performance Canvas Rendering**: 60 FPS smooth gameplay using separated game loop architecture
- **Dynamic Car Traffic**: Intelligent car spawning system with object pooling and memory management
- **Responsive Design**: Adapts to any screen size while maintaining optimal gameplay
- **Modern Architecture**: Clean separation of game logic and React UI layer
- **Intuitive Controls**: Drag to pan the viewport and explore the game world
- **Professional Chicken Animation**: Custom-drawn animated chicken character
- **Extensive Road System**: 30 lane road with dynamic rendering and alternating traffic
- **Modular & Extensible**: Easy to add new features, obstacles, and game mechanics
- **Optimized Performance**: Object pooling, efficient cleanup, and smart spawn timing

## 🎮 Game Features

- **Interactive Gameplay**: Smooth drag-to-pan viewport control
- **Intelligent Traffic System**: Cars spawn dynamically with varied speeds and types
  - Object pooling for optimal memory management
  - Smart cleanup of offscreen vehicles
  - Alternating lane directions for realistic traffic flow
  - 2-5 second spawn intervals with lane-specific spawn rates
- **Visual Feedback**: Real-time cursor changes and loading states
- **Performance Optimized**: Efficient entity management and rendering
- **Scalable Architecture**: Built to support future features (collision detection, scoring, levels)

## 🏗️ Architecture

This project follows the **Separated Game Loop Pattern**, an industry-standard architecture for React canvas games:

### Project Structure

```
src/
├── game/                    # Pure game engine (framework-agnostic)
│   ├── core/
│   │   ├── Game.js         # Main game orchestrator
│   │   ├── GameLoop.js     # 60 FPS rendering loop
│   │   ├── Renderer.js     # Canvas rendering utilities
│   │   └── Camera.js       # Viewport management
│   ├── entities/           # Game objects
│   │   ├── BaseEntity.js   # Abstract entity class
│   │   ├── Chicken.js      # Player character
│   │   ├── Car.js          # Vehicle obstacle entity
│   │   ├── Road.js         # Road with lanes
│   │   └── Scenery.js      # Start/finish images
│   ├── systems/            # Game logic systems
│   │   ├── InputSystem.js  # Mouse/touch handling
│   │   └── CarSpawner.js   # Car spawning & object pooling
│   └── managers/
│       ├── EntityManager.js # Entity lifecycle
│       └── AssetManager.js  # Image loading & caching
│
├── components/             # React UI layer
│   └── GameArea/
│       ├── CanvasGameArea.jsx  # Main canvas component
│       └── CanvasGameArea.css
│
├── hooks/                  # Custom React hooks
│   ├── useGame.js         # Game instance management
│   └── useResponsiveCanvas.js # Responsive canvas handling
│
├── config/
│   └── gameConfig.js      # Game configuration
│
└── constants/
    └── gameConstants.js   # Game constants & enums
```

### Architecture Benefits

1. **Performance**: Game loop runs independently from React at consistent 60 FPS
2. **Testability**: Pure JavaScript game logic can be tested without React
3. **Maintainability**: Clear separation of concerns between game and UI
4. **Scalability**: Easy to add new entities, systems, and features
5. **React Integration**: Seamless event-based communication with React components

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd chicken-road-game
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the displayed URL)

### Building for Production

```bash
npm run build
```

The optimized build will be created in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎯 How to Play

1. **Wait for Loading**: The game will load all assets automatically
2. **Explore**: Click and drag anywhere on the canvas to pan the viewport
3. **Navigate**: View the chicken on the sidewalk, ready to cross the road
4. **Future Features**: Obstacles, scoring, and interactive gameplay coming soon!

## 🛠️ Built With

- **React 19.2.0** - UI framework
- **Vite 7.3.1** - Build tool and dev server
- **HTML5 Canvas** - High-performance rendering
- **Modern JavaScript (ES6+)** - Clean, maintainable code

## 📖 Development Guide

### Adding New Entities

1. Create a new class extending `BaseEntity`:

```javascript
import { BaseEntity } from "./BaseEntity.js";

export class MyEntity extends BaseEntity {
  update(deltaTime) {
    // Update logic
  }

  render(renderer) {
    // Rendering logic
  }
}
```

2. Add the entity in `useGame.js`:

```javascript
const myEntity = new MyEntity(x, y, config);
entityManager.addEntity(myEntity);
```

### Creating New Systems

1. Create a system class in `src/game/systems/`:

```javascript
export class MySystem {
  update(deltaTime, entities) {
    // Process entities
  }
}
```

2. Initialize in `Game.js` and call in update loop

### Configuration

Edit `src/config/gameConfig.js` to modify:

- Lane dimensions and count
- Chicken size and behavior
- Colors and visual settings
- Asset paths

### Constants

Define game constants in `src/constants/gameConstants.js`:

- Game states
- Entity types
- Animation names
- Color palette

## 🎨 Customization

### Changing Chicken Size

Edit `GAME_CONFIG.chickenSize` in `src/config/gameConfig.js`:

```javascript
chickenSize: 280, // Slightly smaller than lane width (300px)
```

### Modifying Road

Edit road properties in `GAME_CONFIG`:

```javascript
laneWidth: 300,
laneCount: 30,
roadColor: '#716c69',
lineColor: '#ffffff',
```

### Adding New Assets

1. Place assets in `public/` directory
2. Add to `GAME_CONFIG.assets`:

```javascript
assets: {
  myAsset: '/path/to/asset.png',
}
```

3. Load in `useGame.js`:

```javascript
await assetManager.loadImage("myAsset", "/path/to/asset.png");
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Check for errors
npm run build
```

## 📚 API Reference

### Game Core

- **Game**: Main game orchestrator
  - `start()`: Start game loop
  - `pause()`: Pause game
  - `resume()`: Resume game
  - `reset()`: Reset game state
  - `destroy()`: Clean up resources

- **GameLoop**: Manages 60 FPS rendering loop
- **Renderer**: Canvas rendering utilities
- **Camera**: Viewport and pan management

### Hooks

- **useGame(canvasRef, config)**: Initialize and manage game instance
  - Returns: `{ gameRef, isLoading, gameState }`
- **useResponsiveCanvas(canvasRef, containerRef, gameRef, options)**: Make canvas responsive
  - Options: `{ maintainAspectRatio, aspectRatio, onResize }`

### Entities

- **Chicken**: Player character with animations
- **Road**: Multi-lane road system
- **Scenery**: Environmental decoration

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow existing code patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep components small and focused
- Separate game logic from React components

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the lightning-fast build tool
- Canvas API for high-performance rendering

## 📞 Support

For issues and questions:

- Open an issue on GitHub
- Check existing documentation
- Review code comments and JSDoc

## 🗺️ Roadmap

### Planned Features

- [ ] Obstacle system (cars, trucks)
- [ ] Player movement controls
- [ ] Scoring and multiplier system
- [ ] Sound effects and music
- [ ] Particle effects
- [ ] Multiple difficulty levels
- [ ] Leaderboards
- [ ] Mobile touch controls
- [ ] Game states (menu, game over, win)
- [ ] Power-ups and collectibles

---

**Made with ❤️ using React, Vite, and HTML5 Canvas**
