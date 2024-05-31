# yhan0177_9103_Tut01_GroupD
# 交互说明
## 我使用Perlin noise来驱动我的个人代码。
# Interactive Particle Animation

## 1. Loading the Page
When the page loads, it automatically switches between two particle animation modes: Webcam Capture Mode and The Scream Image Mode.
At the top of the screen, there are two buttons: "Use Webcam" and "Back to Default Image." Click the "Use Webcam" button to start the Webcam Capture Mode. Click the "Back to Default Image" button to return to The Scream Image Mode.

## 2. Webcam Capture Mode
After starting the webcam capture, the page will count down for 3 seconds. Please adjust your pose during this time.
When the countdown ends, the webcam captures your image and generates a particle animation.
Particles will fall from the top of the screen, simulating a gravity effect, and be colored according to the captured image.
You can interact with the particles by moving the mouse:
- Move the mouse near the particles to push or attract them.
- Hold down the left mouse button to push the particles away more strongly.

## 3. The Scream Image Mode
In the default mode, the page displays a particle animation forming The Scream image.
Particles are attracted to specific positions in the center of the canvas, gradually forming the image of The Scream.
You can generate attractors to move particles towards the mouse position:
- Click the left mouse button to generate an attractor at the mouse position, pulling particles towards it.
- Hold down the left mouse button to speed up the particles' movement towards the attractor.

# Animation Properties

## Webcam Capture Mode
- Particles fall from the top of the screen, simulating a gravity effect.
- Particles are colored based on the captured image, enhancing visual effects.
- Mouse interactions affect the particles' trajectory by pushing or pulling them based on the mouse position.

## The Scream Image Mode
- Particles are attracted to specific positions, gradually forming the image.
- Clicking the mouse generates attractors, pulling particles towards the attractor position.
- Holding down the left mouse button speeds up the particles' movement towards the attractor.

# Inspiration

- The particle interaction in Webcam Capture Mode was inspired by [this sketch](https://openprocessing.org/sketch/2102044).
- The particle attraction effect in The Scream Image Mode was inspired by natural gravitational and attractive forces combined with classic particle system animation techniques. See [this sketch](https://openprocessing.org/sketch/2058929) for reference.

# Technical Details

- Implemented using the p5.js library to create particle system animations.
- Started webcam capture using the `createCapture(VIDEO)` function and captured images with the `capture.get()` method.
- Mapped image colors to particles using the `map` function and adjusted colors with the `applyScreamFilter` function to match The Scream's palette. Reference: [p5.js filter](https://p5js.org/reference/#/p5/filter).
- Implemented different particle movement styles through the `Particle` and `AttractedParticle` classes for the two modes.
- Handled mouse interactions using `mousePressed` and `mouseReleased` events to generate attractors and control particle speed.
- The animation's uniqueness lies in combining real-time webcam capture with particle animations of a classic painting, creating a unique interactive experience.

## Enjoy this interactive animation experience!
