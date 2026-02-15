# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
