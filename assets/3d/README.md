# 3D Assets

This folder is for 3D model files that can be used in the Three.js scene.

## Current Implementation

The presentation currently uses **procedural 3D geometry** created with Three.js primitives:

- **Desk**: Box geometry with wooden texture
- **Papers**: Small box geometries with problem-specific colors
- **Firefighter**: Composed of cylinders and spheres (body, head, helmet, hose, axe)
- **Watchtower**: Cylindrical tower with windows
- **Plane**: Box and cylinder geometry for fuselage and wings
- **Binder**: Box geometry with spine details

## Future 3D Assets

If you want to replace the procedural models with actual 3D assets, you can add files here:

### Supported Formats
- **GLTF/GLB** - Recommended for web (supports animations, materials, textures)
- **OBJ** - Basic geometry support
- **FBX** - If needed (requires additional loader)

### Recommended Assets
- `desk.glb` - Realistic office desk
- `firefighter.glb` - Cartoon firefighter character with animations
- `watchtower.glb` - Lookout tower with details
- `plane.glb` - Small aircraft for executive view
- `binder.glb` - Operations manual binder
- `papers/` - Various paper models with different colors

### Integration

To use 3D assets, update the `three-scene.js` file:

```javascript
// Example: Loading a GLTF model
const loader = new THREE.GLTFLoader();
loader.load('/assets/3d/firefighter.glb', (gltf) => {
  this.firefighter = gltf.scene;
  this.scene.add(this.firefighter);
});
```

## Animation Support

If using GLTF models with animations:
- Idle animations for characters
- Action animations (firefighter spraying water, plane flying)
- Interaction animations (binder opening, watchtower rotating)

## Texture Guidelines

- Use web-optimized textures (PNG, JPG, WebP)
- Keep texture sizes reasonable (512x512 or 1024x1024)
- Consider using texture atlases for better performance

## Performance Considerations

- Keep polygon counts reasonable for web performance
- Use LOD (Level of Detail) models if needed
- Optimize for mobile devices
- Consider file compression for faster loading

---

**Note**: The current procedural implementation works well and provides a game-like feel. 3D assets are optional enhancements for more realistic visuals.