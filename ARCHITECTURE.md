# Game Architecture Documentation

## Overview

This document describes the architecture of the Chicken Road Game, built using the **Separated Game Loop Pattern** - an industry-standard approach for building high-performance canvas games with React.

## Architecture Pattern

### Separated Game Loop Pattern

The core principle is **separation of concerns** between:

1. **Game Engine** - Pure JavaScript, framework-agnostic, runs at 60 FPS
2. **React UI Layer** - Handles UI components, controls, and overlays
3. **Bridge Layer** - Custom hooks that connect React to the game engine

```
┌─────────────────────────────────────────────────────────┐
│                    React Component                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │           React Hooks (Bridge)                  │    │
│  │  - useGame: Manages game lifecycle              │    │
│  │  - useResponsiveCanvas: Handles resize          │    │
│  └─────────────────┬────────────────────────────...│    │
│                    │ Events                             │
└────────────────────┼────────────────────────────────────┘
                     │
          ┌──────────▼───────────┐
          │   Game Instance      │
          │  - Game Loop         │
          │  - Renderer          │
          │  - Entity Manager    │
          │  - Input System      │
          └──────────┬───────────┘
                     │
          ┌──────────▼───────────┐
          │     Entities         │
          │  - Chicken           │
          │  - Road              │
          │  - Scenery           │
          └──────────────────────┘
```

## Core Systems

### 1. Game Loop (`GameLoop.js`)

**Purpose**: Manages the main game loop using `requestAnimationFrame` for consistent 60 FPS rendering.

**Key Features**:

- Fixed time step for consistent gameplay
- Automatic frame rate management
- Delta time calculation for smooth animations
- Start/stop controls

**Usage**:

```javascript
const gameLoop = new GameLoop(updateCallback, renderCallback);
gameLoop.start();
```

**Why It's Separate**: Running independently from React's render cycle ensures consistent 60 FPS regardless of React re-renders.

### 2. Renderer (`Renderer.js`)

**Purpose**: Provides canvas rendering utilities and manages the 2D context.

**Key Features**:

- Camera transform support
- Drawing primitives (rect, circle, line, text)
- Image rendering
- Context state management

**API**:

```javascript
renderer.clear();
renderer.begin(); // Apply camera transform
renderer.drawImage(image, x, y);
renderer.drawRect(x, y, width, height, color);
renderer.end(); // Restore transform
```

**Why It's Separate**: Abstracts canvas API, makes rendering code cleaner and testable.

### 3. Camera (`Camera.js`)

**Purpose**: Manages viewport transformation and panning.

**Key Features**:

- Position and scale management
- Drag-to-pan functionality
- World-to-screen coordinate conversion
- Screen-to-world coordinate conversion

**Usage**:

```javascript
camera.startDrag(screenX, screenY);
camera.updateDrag(screenX, screenY);
camera.stopDrag();
camera.applyTransform(context);
```

**Why It's Separate**: Decouples viewport logic from rendering, enables easy camera controls.

### 4. Entity Manager (`EntityManager.js`)

**Purpose**: Manages all game entities lifecycle.

**Key Features**:

- Batch entity updates
- Deferred add/remove to avoid mid-iteration issues
- Type-based entity queries
- Automatic cleanup

**API**:

```javascript
entityManager.addEntity(entity);
entityManager.removeEntity(entity);
entityManager.getEntitiesOfType(Chicken);
entityManager.update(deltaTime);
entityManager.render(renderer);
```

**Why It's Separate**: Centralizes entity management, prevents common bugs with entity lifecycle.

### 5. Input System (`InputSystem.js`)

**Purpose**: Handles mouse/touch input independently from React.

**Key Features**:

- Event-based callbacks
- Drag detection
- Canvas-relative coordinates
- Proper cleanup

**Usage**:

```javascript
inputSystem.onDragStart((x, y) => {
  /* handle */
});
inputSystem.onDragMove((x, y) => {
  /* handle */
});
inputSystem.onDragEnd(() => {
  /* handle */
});
```

**Why It's Separate**: Keeps input handling in game loop timing, not React event timing.

### 6. Asset Manager (`AssetManager.js`)

**Purpose**: Loads and caches game assets.

**Key Features**:

- Image loading with promises
- Automatic caching
- Batch loading
- Prevents duplicate loads

**API**:

```javascript
await assetManager.loadImage("chicken", "/assets/chicken.png");
const image = assetManager.getImage("chicken");
await assetManager.loadImages([
  { key: "start", url: "/start.png" },
  { key: "finish", url: "/finish.png" },
]);
```

**Why It's Separate**: Centralized asset management, automatic de-duplication.

## Entity System

### Base Entity (`BaseEntity.js`)

**Purpose**: Abstract base class for all game entities.

**Interface**:

```javascript
class BaseEntity {
  update(deltaTime) {} // Override for game logic
  render(renderer) {} // Override for rendering
  getBounds() {} // Returns bounding box
  containsPoint(x, y) {} // Point collision
  destroy() {} // Cleanup
}
```

### Concrete Entities

#### Chicken (`Chicken.js`)

- Player character
- Animated with idle bob effect
- Rendered at 280px (slightly smaller than lane width)
- Direction control (facing right/left)

#### Road (`Road.js`)

- Multi-lane road system
- 30 lanes, 300px each
- Dashed lane dividers
- Lane position calculations

#### Scenery (`Scenery.js`)

- Start/finish images
- Static decoration
- Simple image rendering

### Adding New Entities

1. Create class extending `BaseEntity`
2. Implement `update()` and `render()` methods
3. Add specific entity behavior
4. Register in `EntityManager`

Example:

```javascript
export class Obstacle extends BaseEntity {
  constructor(x, y, speed) {
    super(x, y);
    this.speed = speed;
    this.width = 80;
    this.height = 50;
  }

  update(deltaTime) {
    this.x += this.speed * deltaTime;
  }

  render(renderer) {
    renderer.drawRect(this.x, this.y, this.width, this.height, "#ff0000");
  }
}
```

## React Integration

### Custom Hooks

#### useGame

**Purpose**: Bridge between React and game engine.

**Responsibilities**:

- Initialize game instance
- Load assets
- Create entities
- Subscribe to game events
- Update React state from game events
- Cleanup on unmount

**Returns**:

```javascript
{
  gameRef,           // Ref to game instance
  isLoading,         // Loading state
  gameState,         // Current game state
}
```

#### useResponsiveCanvas

**Purpose**: Make canvas responsive to container size.

**Responsibilities**:

- Monitor container size changes
- Update canvas CSS dimensions
- Debounce resize events
- Optional aspect ratio maintenance

**Parameters**:

```javascript
{
  maintainAspectRatio,  // boolean
  aspectRatio,          // number (width/height)
  onResize,             // callback(width, height)
}
```

### Event Communication

Game → React communication uses event emitters:

```javascript
// In Game.js
this.emit("stateChange", { state: "playing" });

// In useGame.js
game.on("stateChange", (data) => {
  setGameState((prev) => ({ ...prev, ...data }));
});
```

**Available Events**:

- `initialized`: Game setup complete
- `stateChange`: Game state changed
- `fpsUpdate`: FPS counter updated
- `resize`: Canvas resized
- `dragStart`: Drag started
- `dragMove`: Drag in progress
- `dragEnd`: Drag ended
- `destroyed`: Game destroyed

## Data Flow

```
User Input
    ↓
InputSystem (captures events)
    ↓
Game.update() (processes input)
    ↓
EntityManager.update() (updates entities)
    ↓
Entity.update() (individual logic)
    ↓
Game.render()
    ↓
Renderer (draws to canvas)
    ↓
EntityManager.render()
    ↓
Entity.render() (individual rendering)

Parallel Path:
Game events → React hooks → React state → UI updates
```

## Performance Considerations

### 60 FPS Game Loop

- Game loop runs independently via `requestAnimationFrame`
- React re-renders don't affect game performance
- Updates and rendering happen every ~16.67ms

### Entity Management

- Deferred add/remove prevents mid-iteration bugs
- Only active entities are updated
- Only visible entities are rendered

### Canvas Optimization

- Single canvas element
- Minimal state changes
- Batch rendering operations
- No unnecessary clears

### React Integration

- Throttled state updates to React (not every frame)
- Use refs for game instance (don't trigger re-renders)
- Event-based communication (not polling)

## Configuration System

### gameConfig.js

Centralized configuration for:

- Lane dimensions
- Chicken properties
- Colors
- Asset paths
- Difficulty settings

**Benefit**: Easy to tweak game parameters without touching code.

### gameConstants.js

Immutable constants for:

- Game states
- Entity types
- Animation names
- Events
- Colors

**Benefit**: Type-safe references, autocomplete support, easier refactoring.

## Testing Strategy

### Unit Testing Game Logic

Game logic is pure JavaScript, testable without React:

```javascript
// Test entity behavior
const chicken = new Chicken(0, 0, config);
chicken.update(0.016); // One frame
expect(chicken.animationTime).toBeGreaterThan(0);
```

### Integration Testing

Test React-game integration:

```javascript
// Test useGame hook
const { result } = renderHook(() => useGame(canvasRef, config));
await waitFor(() => expect(result.current.isLoading).toBe(false));
```

### Visual Testing

Manual testing for:

- Rendering correctness
- Animation smoothness
- Input responsiveness

## Scalability

### Adding Game Systems

1. Create system class in `src/game/systems/`
2. Initialize in `Game.js` constructor
3. Call in `Game.update()` or `Game.render()`

Example:

```javascript
// CollisionSystem.js
export class CollisionSystem {
  checkCollisions(entities) {
    // Collision detection logic
  }
}

// In Game.js
this.collisionSystem = new CollisionSystem();

// In update()
this.collisionSystem.checkCollisions(this.entityManager.getEntities());
```

### Adding Game Features

**Example: Obstacle System**

1. Create `Obstacle` entity
2. Create `ObstacleSpawner` system
3. Add obstacles to entity manager
4. Implement collision in `CollisionSystem`
5. Add UI for obstacle count in React

All without changing existing architecture!

## Common Patterns

### Dependency Injection

```javascript
const game = new Game(canvas, config);
await game.initialize(entityManager, assetManager, inputSystem);
```

**Benefit**: Testability, flexibility

### Event-Driven Architecture

```javascript
game.on("collision", handleCollision);
game.emit("collision", { entity1, entity2 });
```

**Benefit**: Loose coupling, extensibility

### Object Pooling (Future)

```javascript
class ObjectPool {
  acquire() {
    return this.pool.pop() || new Entity();
  }
  release(obj) {
    obj.reset();
    this.pool.push(obj);
  }
}
```

**Benefit**: Reduced garbage collection, better performance

## Best Practices

### Do's

✅ Keep game logic in game layer, not React
✅ Use events for game → React communication
✅ Update entities via entity manager
✅ Use refs for game instances
✅ Test game logic independently
✅ Add JSDoc comments to public APIs
✅ Follow naming conventions

### Don'ts

❌ Don't access game state directly from React render
❌ Don't create entities in React hooks
❌ Don't mix game loop timing with React timing
❌ Don't access `ref.current` during render
❌ Don't forget to clean up in `destroy()`
❌ Don't put React dependencies in game code

## Troubleshooting

### Common Issues

**Issue**: Game not rendering

- Check canvas ref is attached
- Verify game.start() is called
- Check browser console for errors

**Issue**: Lag or stuttering

- Check FPS counter
- Verify game loop is running
- Look for expensive operations in update/render

**Issue**: React re-renders affecting game

- Ensure game instance in ref, not state
- Throttle state updates from game events
- Use `useCallback` for event handlers

**Issue**: Canvas not responsive

- Check `useResponsiveCanvas` is called
- Verify container has dimensions
- Check CSS for `width: 100%`

## Future Enhancements

- **State Machine**: Manage game states (menu, playing, paused)
- **Physics System**: Handle collisions, movement
- **Particle System**: Visual effects
- **Audio System**: Sound effects and music
- **Serialization**: Save/load game state
- **Networking**: Multiplayer support
- **Performance Monitoring**: FPS, memory tracking

---

**Architecture Version**: 1.0.0  
**Last Updated**: 2026-02-15
