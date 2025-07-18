# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the ACE Valet Operations Improvement Proposal presentation project. The repository contains documentation for a comprehensive business proposal aimed at transforming ACE Parking's valet operations through standardized processes, training programs, and data-driven decision making.

## Repository Structure

- `docs/` - Contains the core project documentation
  - `blueprint.md` - Detailed presentation blueprint for an interactive web-based presentation
  - `proposal.txt` - Complete business proposal document with phased implementation plan
  - `rant.txt` - Additional operational observations and detailed field notes

## Key Project Components

### Presentation Blueprint (`docs/blueprint.md`)
- Interactive web presentation (5-7 minutes) using HTML, CSS, and JavaScript
- Offline-first architecture with service worker caching
- Three-layer operational metaphor: Valet (firefighter), Manager (watchtower), Executive (fire-spotter plane)
- 3D elements using Three.js for desk environment and figures
- JSON-driven content management system
- Responsive design for mobile, tablet, and projector displays

### Business Proposal (`docs/proposal.txt`)
- Three-phase implementation plan:
  1. Foundational Systems & Data Capture (3-6 months)
  2. Structured Training & Process Standardization (6-12 months)
  3. Performance Management & Culture Enhancement (12+ months)
- Pilot program recommendation for Marriott Marquis
- Comprehensive appendices including software design specifications

### Technical Specifications

#### Frontend Technology Stack
- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js for 3D desk environment
- **Animations**: CSS transitions and keyframes
- **Interactions**: interact.js for cross-device compatibility
- **Offline Support**: Service worker implementation
- **Export**: jsPDF for PDF generation

#### Data Management
- Local JSON file as primary data source
- Browser local storage caching (IndexedDB fallback)
- Structured schema for operational events and solutions
- Optional serverless API integration for feedback collection

#### Development Standards
- Mobile-first responsive design
- Accessibility compliance (WCAG standards)
- Performance budget: <1MB initial load
- Target: 60 FPS on mid-range devices
- Offline-first functionality

## Common Development Tasks

### Building the Presentation
The presentation is designed as a static Single-Page Application (SPA). No specific build process is documented, but the project should be deployable to static hosting services like Netlify or Vercel.

### Data Structure Management
Content is managed through JSON files with a defined schema:
```json
{
  "id": "string",
  "section": "enum('valet', 'manager', 'executive')",
  "priority": "number",
  "title": "string",
  "description": "string",
  "impact": "string",
  "solution": "string",
  "paper_image": "string",
  "paper_color": "string"
}
```

### Testing and Validation
- JSON schema validation for data integrity
- Lighthouse performance audits (target: ≥90 mobile, ≥95 desktop)
- Cross-device compatibility testing
- Accessibility audit compliance

## Development Architecture

### Interactive Presentation Flow
1. **Opening Scene**: Chaotic desk with 30-50 problem papers
2. **Valet Layer**: Problem-to-solution transformations with paper animations
3. **Manager Layer**: Organized binder with tabbed sections
4. **Executive Layer**: Data dashboard with KPI metrics
5. **Closing Scene**: Clean desk with "Launch Pilot" CTA

### Key Features to Implement
- Paper-to-binder slide animations (200ms ease-out)
- 3D binder flip effects using CSS transforms
- Modal overlays for detailed content (150ms fade)
- Automated demo mode with 30-second sequence
- Presenter mode with timer and cues

## Performance Considerations

- Keep 3D models under 500KB each using optimized GLTF format
- Implement `prefers-reduced-motion` media query support
- Use 2D sprites for UI elements to maintain performance
- Lazy load non-critical assets
- Implement efficient caching strategies

## Deployment Strategy

- Static hosting deployment (Netlify, Vercel, or internal server)
- CI/CD pipeline with automated validation
- Asset optimization and compression
- Service worker registration for offline functionality

## Business Context

This project addresses systematic operational challenges in valet services through:
- Standardized training programs and procedures
- Data-driven performance tracking
- Employee retention and recognition systems
- Technology integration for efficiency improvements

The presentation serves as a proof-of-concept for the proposed operational improvements and technology solutions outlined in the comprehensive business proposal.

## Current Implementation Status

### ✅ Completed Features
- **3D Scene Controller**: Interactive Three.js scene with cube placeholders for easy model swapping
- **Modal System**: Character and problem modal overlays with custom actions
- **Interactive Objects**: Papers, firefighter, watchtower, plane, and binder all clickable
- **Tooltip System**: Hover tooltips provide interaction feedback
- **Event System**: Complete event handling for 3D object interactions
- **Navigation Integration**: Modal actions navigate to relevant presentation sections

### 🔄 Current UX Implementation
The 3D scene now serves as the primary interactive interface. Users can:
- Click papers to view problem details in modal overlays
- Click 3D characters (firefighter/watchtower/plane) to learn about their roles
- Click the operations binder to navigate to manager section
- Hover over objects to see descriptive tooltips

### 🎯 Critical TODOs for UX Refinement

#### High Priority UX Improvements
1. **Section Content Integration**
   - Hide/minimize HTML section content containers completely
   - Make 3D scene fill the entire main content area
   - Ensure section headers are positioned correctly at top

2. **3D Model Asset Swapping**
   - Replace cube placeholders with actual 3D models (.glb/.gltf)
   - Implement proper model loading with fallback system
   - Add loading states for 3D asset loading

3. **Enhanced Interactions**
   - Add hover animations for 3D objects (scaling, rotation, glow effects)
   - Implement click feedback (bounce, flash, sound effects)
   - Add particle effects for paper-to-binder animations

4. **Modal Content Enhancement**
   - Populate character modals with actual role-specific content
   - Add relevant images, charts, or diagrams to modals
   - Implement modal transitions and animations

5. **Scene Transitions**
   - Refine camera transitions between sections
   - Add smooth object visibility animations
   - Implement section-specific lighting changes

#### Medium Priority Improvements
6. **Paper System**
   - Add paper pickup/manipulation interactions
   - Implement paper stacking and organization animations
   - Add paper content preview on hover

7. **Operations Binder**
   - Make binder interactive in 3D space
   - Add page-flip animations when opened
   - Connect binder tabs to 3D interaction

8. **Performance Optimization**
   - Implement Level of Detail (LOD) for 3D models
   - Add object culling for off-screen elements
   - Optimize rendering performance

9. **Mobile Experience**
   - Touch gesture support for 3D scene manipulation
   - Responsive layout for mobile devices
   - Touch-friendly interaction areas

#### Low Priority Polish
10. **Audio System**
    - Add ambient background sounds
    - Click sound effects for interactions
    - Optional narration for demo mode

11. **Advanced Animations**
    - Physics-based paper movements
    - Realistic material properties
    - Dynamic lighting effects

12. **Accessibility**
    - Keyboard navigation for 3D scene
    - Screen reader support for 3D interactions
    - High contrast mode support

### 🛠️ Technical Notes
- **Asset Management**: Use `replacePlaceholder()` method in ThreeSceneController to swap 3D models
- **Event System**: All 3D interactions use custom events (paperClicked, firefighterClicked, etc.)
- **Modal System**: Use `showCharacterModal()` for character interactions
- **CSS Architecture**: Tooltip system uses `.scene-tooltip` class with show/hide states

### 🎮 Game-Like Experience Goals
- Make interactions feel responsive and rewarding
- Add visual feedback for all user actions
- Implement progressive disclosure of content
- Create a narrative flow through the 3D environment
- Maintain the "limited interactive game" feel requested by user