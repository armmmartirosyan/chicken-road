# Car Assets Setup

This document explains how to set up car assets for the chicken road game.

## Required Car Images

The game expects 4 car image files in the `/public/assets/` directory:

### 1. truck-orange.png

- **Description**: Orange/yellow truck (top-down view)
- **Recommended Size**: Any size (will be scaled to 280x140px in-game)
- **Source**: Use the orange truck image from the provided attachments
- **Path**: `/public/assets/truck-orange.png`

### 2. truck-blue.png

- **Description**: Blue truck (top-down view)
- **Recommended Size**: Any size (will be scaled to 280x140px in-game)
- **Source**: Use the blue truck image from the provided attachments
- **Path**: `/public/assets/truck-blue.png`

### 3. car-yellow.png

- **Description**: Yellow car (top-down view)
- **Recommended Size**: Any size (will be scaled to 280x140px in-game)
- **Source**: Extract from objects.png sprite sheet or use any top-down car image
- **Path**: `/public/assets/car-yellow.png`

### 4. car-police.png

- **Description**: Police car (top-down view)
- **Recommended Size**: Any size (will be scaled to 280x140px in-game)
- **Source**: Extract from objects.png sprite sheet or use any top-down car image
- **Path**: `/public/assets/car-police.png`

## Extracting from objects.png

If using the `objects.png` sprite sheet:

1. Open `objects.png` in an image editor
2. Locate the yellow car (middle row, third from left)
3. Crop and save as `car-yellow.png`
4. Locate the police car (top row, fourth from left)
5. Crop and save as `car-police.png`

## Image Requirements

- **Format**: PNG with transparency preferred
- **Orientation**: Top-down view (bird's eye view)
- **Aspect Ratio**: Approximately 2:1 (width:height) works best
- **Quality**: Any resolution (game will scale appropriately)

## Automatic Scaling

The game automatically scales all car images to:

- **Width**: 280px (20px smaller than lane width of 300px)
- **Height**: 140px (proportional 2:1 ratio)

## Testing

After adding the images:

1. Refresh the game
2. Cars should start spawning automatically after 2-5 seconds
3. Cars move at different speeds in alternating lanes
4. Cars are automatically removed when they move off-screen

## Troubleshooting

If cars don't appear:

1. Check browser console for image loading errors
2. Verify all 4 image files exist in `/public/assets/`
3. Check file names match exactly (case-sensitive)
4. Ensure images are valid PNG files
5. Clear browser cache and refresh

## Car System Features

- **Object Pooling**: Pre-allocates 20 car objects for performance
- **Memory Management**: Cars are recycled when off-screen, not deleted
- **Smart Spawning**: 2-5 second intervals with lane-specific spawn rates
- **Traffic Flow**: Alternating lane directions for realistic traffic
- **Speed Variation**: 150-350 pixels/second random speeds
- **Automatic Cleanup**: No memory leaks from abandoned cars

## Configuration

Car spawning can be adjusted in `/src/config/gameConfig.js`:

```javascript
carSpawner: {
  minSpawnInterval: 2.0,  // Minimum seconds between spawns
  maxSpawnInterval: 5.0,  // Maximum seconds between spawns
  minSpeed: 150,          // Minimum pixels/second
  maxSpeed: 350,          // Maximum pixels/second
  poolSize: 20,           // Object pool size
}
```
