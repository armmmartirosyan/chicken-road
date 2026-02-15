# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2026-02-15

### Game Feature - Dynamic Traffic System

This release adds a comprehensive car crossing system with intelligent spawning, object pooling, and professional memory management.

### Added

#### Traffic System

- **Car Entity** (`Car.js`)
  - Complete vehicle obstacle entity extending BaseEntity
  - Dynamic movement with configurable speeds (150-350 px/s)
  - Directional rendering (automatic horizontal flip for left-moving cars)
  - Collision detection methods (getBounds, checkCollision)
  - Object pool support for memory efficiency
  - Automatic offscreen detection and cleanup
  - Size: 280x140px (20px smaller than lane width for proper fit)

- **Car Spawner System** (`CarSpawner.js`)
  - Intelligent car spawning with randomized intervals (2-5 seconds)
  - **Object Pooling**: Pre-allocates 20 car objects for optimal performance
  - **Memory Management**: Cars are recycled, not destroyed, when offscreen
  - Lane-specific spawn rates for varied traffic density
  - Alternating lane directions for realistic traffic flow
  - Speed variation per car (150-350 pixels/second)
  - Support for multiple car types with weighted randomization
  - Pool statistics tracking for debugging
  - Automatic cleanup on game destroy

#### Car Types

- **4 Vehicle Types** with weighted spawn probabilities:
  - `truck-orange`: 30% spawn chance - Orange/yellow truck
  - `truck-blue`: 30% spawn chance - Blue truck
  - `car-yellow`: 20% spawn chance - Yellow car
  - `car-police`: 20% spawn chance - Police car

#### Configuration

- **Car Spawner Config** (`gameConfig.js`)

  ```javascript
  carSpawner: {
    minSpawnInterval: 2.0,  // seconds
    maxSpawnInterval: 5.0,  // seconds
    minSpeed: 150,          // pixels/second
    maxSpeed: 350,          // pixels/second
    poolSize: 20,           // object pool size
  }
  ```

- **Asset Configuration**
  - Added car image paths to asset configuration
  - Support for 4 different car sprite images

#### Documentation

- **CAR_ASSETS.md**: Comprehensive guide for car asset setup
  - Image requirements and specifications
  - Extraction instructions from sprite sheets
  - Troubleshooting guide
  - System features documentation
  - Configuration examples

- **Asset Setup Script** (`scripts/generateCarPlaceholders.js`)
  - Instructions for adding car images
  - Reference guide for required asset files

### Changed

- **Game.js**: Integrated CarSpawner into main game loop
  - Added carSpawner property and initialization
  - Update loop calls carSpawner.update(deltaTime)
  - Cleanup method includes carSpawner.cleanup()

- **useGame Hook**: Added car image loading and spawner initialization
  - Loads 4 car sprite images on game start
  - Initializes CarSpawner with road entity reference
  - Ensures spawner is ready before game starts

- **README.md**: Updated features and architecture
  - Added traffic system to features list
  - Documented car spawning and object pooling
  - Updated project structure to include Car and CarSpawner

### Technical Details

#### Performance Optimizations

1. **Object Pooling Pattern**
   - Pre-allocates 20 car objects at initialization
   - Reuses inactive cars instead of creating/destroying
   - Prevents garbage collection spikes during gameplay
   - Dynamically expands pool if needed

2. **Memory Management**
   - Cars marked inactive when offscreen (not deleted)
   - Automatic cleanup removes cars from entity manager
   - Released cars returned to pool for reuse
   - No memory leaks from abandoned objects

3. **Smart Spawning**
   - Randomized intervals prevent predictable patterns
   - Lane-specific spawn chances vary traffic density
   - Spawn positions offscreen for smooth entrance
   - Direction-based positioning (left/right spawn sides)

4. **Rendering Optimization**
   - Cars only rendered when visible
   - Automatic image flipping via canvas transforms
   - Centered positioning for accurate collision detection

#### Architecture Benefits

- **Separated Concerns**: Traffic logic isolated in CarSpawner system
- **Testability**: CarSpawner can be tested independently
- **Scalability**: Easy to add new car types or modify spawn logic
- **Maintainability**: Clear separation between car entity and spawning logic
- **Code Splitting**: Follows best practices for modular game systems

### Migration Guide

No breaking changes. The car system is automatically initialized and runs independently.

To customize car spawning behavior, modify `carSpawner` config in `gameConfig.js`.

### Asset Requirements

⚠️ **IMPORTANT**: This version requires 4 car sprite images to be added manually:

1. `/public/assets/truck-orange.png`
2. `/public/assets/truck-blue.png`
3. `/public/assets/car-yellow.png`
4. `/public/assets/car-police.png`

See `CAR_ASSETS.md` for detailed instructions.

## [2.0.0] - 2026-02-15

### Major Refactoring - Game Architecture Overhaul

This release represents a complete architectural refactoring of the game, moving from a monolithic React component to a professional, industry-standard **Separated Game Loop Pattern**.

### Added

#### Game Engine

- **Game Loop System** (`GameLoop.js`)
  - Independent 60 FPS rendering loop using `requestAnimationFrame`
  - Delta time calculation for smooth animations
  - Start/stop controls for game state management

- **Rendering System** (`Renderer.js`)
  - Canvas rendering utilities and abstractions
  - Camera transform support
  - Drawing primitives (rect, circle, line, text, image)
  - Context state management

- **Camera System** (`Camera.js`)
  - Viewport transformation and coordinate conversion
  - Drag-to-pan functionality
  - Screen-to-world and world-to-screen coordinate conversion
  - Position and scale management

- **Entity Management** (`EntityManager.js`)
  - Centralized entity lifecycle management
  - Batch entity operations
  - Type-based entity queries
  - Deferred add/remove to prevent iteration bugs

- **Input System** (`InputSystem.js`)
  - Framework-agnostic input handling
  - Mouse/touch event management
  - Drag detection and callbacks
  - Proper event cleanup

- **Asset Management** (`AssetManager.js`)
  - Image loading with promises
  - Automatic asset caching
  - Batch loading support
  - Duplicate load prevention

#### Entity System

- **BaseEntity** - Abstract base class for all game entities
  - Standard interface for update/render
  - Bounding box calculations
  - Point collision detection
  - Resource cleanup

- **Chicken Entity** - Player character
  - Resized to 280px (slightly smaller than lane width)
  - Smooth idle animation with bob effect
  - Direction control
  - Professional geometric rendering

- **Road Entity** - Multi-lane road system
  - 30 lanes at 300px width each
  - Dashed lane dividers
  - Lane position calculations
  - Optimized rendering

- **Scenery Entity** - Environmental decoration
  - Start/finish image rendering
  - Static entity optimization

#### React Integration

- **useGame Hook** - Game lifecycle management
  - Game instance initialization
  - Asset loading with loading states
  - Entity creation and setup
  - Event-based React state updates
  - Automatic cleanup on unmount

- **useResponsiveCanvas Hook** - Responsive canvas handling
  - Automatic canvas resizing
  - Container size monitoring with ResizeObserver
  - Debounced resize events
  - Optional aspect ratio maintenance

#### Configuration & Constants

- **Game Configuration** (`gameConfig.js`)
  - Centralized game parameters
  - Lane configuration (width, count, colors)
  - Chicken properties (size, scale)
  - Asset path definitions
  - Difficulty settings (for future features)

- **Game Constants** (`gameConstants.js`)
  - Game state enums
  - Entity type definitions
  - Animation name constants
  - Event type constants
  - Color palette
  - Timing constants

#### Documentation

- **ARCHITECTURE.md** - Comprehensive architecture documentation
  - Pattern explanation (Separated Game Loop)
  - System descriptions
  - Entity system guide
  - React integration details
  - Data flow diagrams
  - Performance considerations
  - Best practices
  - Troubleshooting guide

- **CONTRIBUTING.md** - Contributor guide
  - Code of conduct
  - Development workflow
  - Coding standards
  - Commit conventions
  - Pull request process
  - Testing guidelines

- **Updated README.md** - Complete rewrite
  - Architecture overview
  - Updated project structure
  - Development guide
  - API reference
  - Customization guide
  - Roadmap

### Changed

#### Architecture

- **Separated Concerns**: Game logic now lives in pure JavaScript classes, completely independent of React
- **Performance**: Game loop runs at consistent 60 FPS regardless of React re-renders
- **Scalability**: Much easier to add new entities, systems, and features
- **Testability**: Game logic can be tested without React dependencies

#### Component Refactoring

- **CanvasGameArea.jsx**: Reduced from 261 lines to ~50 lines
  - Now uses `useGame` hook for all game management
  - Removed manual animation loops
  - Removed manual asset loading
  - Removed manual input handling
  - Simplified to pure React component concerns

#### Visual & Functional

- **Chicken Size**: Increased from 60px to 280px (matches requirement to be ~1 lane height)
- **Responsive Canvas**: Now automatically adapts to container size
- **Loading State**: Added professional loading indicator
- **Cursor Feedback**: Maintains grab/grabbing cursor changes

### Removed

- **spineLoader.js**: Removed old Spine integration attempt
  - Replaced with clean geometric chicken rendering
  - Eliminated external Spine library dependency issues
  - Simpler, more maintainable solution

- **Unused Code**: Cleaned up unused state variables and functions
  - Removed `chickenPos` state (now managed by game engine)
  - Removed `isChickenLoaded` state (handled by loading system)
  - Removed manual scroll position management

### Fixed

- **Ref Access During Render**: Fixed React 19 errors about accessing `ref.current` during render
- **ESLint Warnings**: Fixed all unused variable warnings in abstract base classes
- **Performance**: Eliminated React re-render performance issues by separating game loop
- **Code Organization**: Much clearer separation between game logic and UI

### Technical Details

#### File Structure Changes

```
Added:
src/game/core/Game.js
src/game/core/GameLoop.js
src/game/core/Renderer.js
src/game/core/Camera.js
src/game/entities/BaseEntity.js
src/game/entities/Chicken.js
src/game/entities/Road.js
src/game/entities/Scenery.js
src/game/managers/EntityManager.js
src/game/managers/AssetManager.js
src/game/systems/InputSystem.js
src/hooks/useGame.js
src/hooks/useResponsiveCanvas.js
src/hooks/index.js
src/constants/gameConstants.js
src/constants/index.js
ARCHITECTURE.md
CONTRIBUTING.md

Modified:
src/components/GameArea/CanvasGameArea.jsx
src/components/GameArea/CanvasGameArea.css
src/config/gameConfig.js
README.md

Removed:
src/utils/spineLoader.js
```

#### Dependencies

- No new runtime dependencies added
- Removed unused `@esotericsoftware/spine-canvas` from active codebase
- Cleaner dependency graph

### Migration Guide

For developers working on the old codebase:

1. **Game Logic**: Now in `src/game/` directory
   - Old: Game logic in React component
   - New: Pure JavaScript classes in `game/`

2. **Entity Creation**: Through `EntityManager`
   - Old: Direct instantiation in component
   - New: Add to `EntityManager` in `useGame` hook

3. **Animation Loop**: Handled by `GameLoop`
   - Old: Manual `requestAnimationFrame` in component
   - New: `GameLoop` manages timing automatically

4. **Asset Loading**: Through `AssetManager`
   - Old: Manual `Image()` creation and loading
   - New: `AssetManager.loadImage()` with promises

5. **Input Handling**: Through `InputSystem`
   - Old: React event handlers
   - New: `InputSystem` with callbacks

### Breaking Changes

⚠️ **None for end users** - All visible and functional aspects remain the same

⚠️ **For developers**:

- Cannot import `ChickenAnimation` from `utils/spineLoader` (file removed)
- Must use new `useGame` hook instead of manual game initialization
- Game instance now accessed via `gameRef.current`, not direct variable

### Performance Improvements

- Consistent 60 FPS rendering
- Reduced React re-renders (game loop independent)
- More efficient entity management
- Optimized canvas rendering with camera transforms
- Debounced resize events

### Code Quality Improvements

- Added comprehensive JSDoc comments
- Proper TypeScript-style type hints in JSDoc
- Consistent naming conventions
- Clear separation of concerns
- Improved error handling
- Better resource cleanup

---

## [1.0.0] - Previous Version

### Initial Implementation

- Basic canvas game area
- Chicken character (simple rendering)
- Road with lanes
- Drag-to-pan viewport
- Start/finish images

---

**Note**: This changelog focuses on the major 2.0.0 refactoring. For detailed commit history, see the git log.
