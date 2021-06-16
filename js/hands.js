/**
 * Finger painting: A starter sketch demonstrating how to "finger paint" with Handsfree.js
 *
 * Step 1: Press the ▶ Play Button on the top left of the p5 editor (or load this sketch in a browser)
 * Step 2: Click "Start Webcam" underneath the black canvas
 * Step 3: Wait a few moments for everything to start (the computer vision models are large)
 * Step 4: Pinch your fingers to paint 👌 The left index pointer (big black circle) is an eraser and the left pinky clears the whole screen
 *
 * ----------
 *
 * How it works (CTRL+F for "#n" to jump to that bit of code):
 * -- Add Handsfree.js to index.html
 * #1 Configure Handsfree.js
 * #2 Detect when fingers are pinched and then paint there
 * #3 Draw your hands landmarks onto the sketch
 *
 * ----------
 *
 * Docs: https://handsfree.js.org (old)
 * Docs: https://handsfree.dev (newer but missing examples)
 * GitHub: https://github.com/midiblocks/handsfree
 * Twitter (me + handsfree.js): https://github.com/pixelfelt
 * Twitter (just handsfree.js): https://github.com/handsfreejs
 *
 * ----------
 *
 * Ideas:
 * - Experiment with different input methods (like pinching to cycle through colors). Gestures are coming soon: https://handsfree.js.org/gesture/
 * - If you need 3D (but with a limit of 1 hand), see here: https://handsfree.js.org/ref/model/handpose.html
 * - Try the "palm pointer" for a different approach to painting: https://handsfree.js.org/ref/plugin/palmPointers.html
 * - This can support up to 4 hands: https://handsfree.js.org/ref/model/hands.html#with-config
 */


// This will contain all of our lines
paint = []

// This is like pmouseX and pmouseY...but for every finger [pointer, middle, ring, pinky]
let prevPointer = [
  // Left hand
  [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}],
  // Right hand
  [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}]
]

// Landmark indexes for fingertips [pointer, middle, ring, pinky]...these are the same for both hands
let fingertips = [8, 12, 16, 20]


/**
 * Setup
 * - Configure handsfree (set which models, plugins, and gestures you want to use)
 * - Create start/stop buttons. It's nice to always ask user for permission to start webcam :)
 */
function setup () {
  sketch = createCanvas(640, 480);
	//load handsfree.css
	var link = document.createElement( "link" );
	link.href = "https://unpkg.com/handsfree@8.4.2/build/lib/assets/handsfree.css";
	link.type = "text/css";
	link.rel = "stylesheet";
	link.media = "screen,print";

	document.getElementsByTagName( "head" )[0].appendChild( link );
  
  // Colors for each fingertip
  colorMap = [
    // Left fingertips
    [color(0, 0, 0), color(255, 0, 255), color(0, 0, 255), color(255, 255, 255)],
    // Right fingertips
    [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255), color(255, 255, 0)]
  ]
  
  // #1 Turn on some models (hand tracking) and the show debugger
  // @see https://handsfree.js.org/#quickstart-workflow
  handsfree = new Handsfree({
    showDebug: true, // Comment this out to hide the default webcam feed with landmarks
    hands: true
  })
  handsfree.enablePlugins('browser')
  handsfree.plugin.pinchScroll.disable()
  
  // Add webcam buttons under the canvas
  // Handsfree.js comes with a bunch of classes to simplify hiding/showing things when things are loading
  // @see https://handsfree.js.org/ref/util/classes.html#started-loading-and-stopped-states
  buttonStart = createButton('Start Webcam')
  buttonStart.class('handsfree-show-when-stopped')
  buttonStart.class('handsfree-hide-when-loading')
  buttonStart.mousePressed(() => handsfree.start())

  // Create a "loading..." button
  buttonLoading = createButton('...loading...')
  buttonLoading.class('handsfree-show-when-loading')

  // Create a stop button
  buttonStop = createButton('Stop Webcam')
  buttonStop.class('handsfree-show-when-started')
  buttonStop.mousePressed(() => handsfree.stop())
}






/**
 * Main draw loop
 */
function draw () {
  background(0)
  fingerPaint()
  mousePaint()
  drawHands()
}






/**
 * #2 Finger paint
 * Since p5.js already has it's own loop, we just check the data directly
 * @see https://handsfree.js.org/ref/plugin/pinchers.html
 */
// Whenever we pinch and move we'll store those points as a set of [x1, y1, handIndex, fingerIndex, size]
function fingerPaint () {
  // Canvas bounds to make drawing easier
  // Since the canvas is inside an Iframe, we reach out and get it's containing iframe's bounding rect
  let bounds = {
	bottom: windowHeight,
	height: windowHeight,
	left: 0,
	right: windowWidth,
	top: 0,
	width: windowWidth,
	x: 0,
	y: 0,}
  // Check for pinches and create dots if something is pinched
  const hands = handsfree.data?.hands

  // Paint with fingers
  if (hands?.pinchState) {
    // Loop through each hand
    hands.pinchState.forEach((hand, handIndex) => {
      // Loop through each finger
      hand.forEach((state, finger) => {
        if (hands.landmarks?.[handIndex]?.[fingertips[finger]]) {
          
          // Landmarks are in percentage, so lets scale up
          let x = sketch.width - hands.landmarks[handIndex][fingertips[finger]].x * sketch.width
          let y = hands.landmarks[handIndex][fingertips[finger]].y * sketch.height

          // Start line on the spot that we pinched
          if (state === 'start') {
            prevPointer[handIndex][finger] = {x, y}

          // Add a line to the paint array
          } else if (state === 'held') {
            paint.push([
              prevPointer[handIndex][finger].x,
              prevPointer[handIndex][finger].y,
              x,
              y,
              colorMap[handIndex][finger]
            ])
          }

          // Set the last position
          prevPointer[handIndex][finger] = {x, y}          
        }
      })
    })  
  } 

  // Clear everything if the left [0] pinky [3] is pinched
  if (hands?.pinchState && hands.pinchState[0][3] === 'released') {
    paint = []
  }
  
  // Draw Paint
  paint.forEach(p => {
    fill(p[4])
    stroke(p[4])
    strokeWeight(10)

    line(p[0], p[1], p[2], p[3])
  })
}



/**
 * Draw the mouse
 */
function mousePaint () {
  if (mouseIsPressed === true) {
    fill(colorMap[1][0])
    stroke(colorMap[1][0])
    strokeWeight(10)
    line(mouseX, mouseY, pmouseX, pmouseY)
  }
}


/**
 * #3 Draw the hands into the P5 canvas
 * @see https://handsfree.js.org/ref/model/hands.html#data
 */
function drawHands () {
  const hands = handsfree.data?.hands
  
  // Bail if we don't have anything to draw
  if (!hands?.landmarks) return
  
  // Draw keypoints
  hands.landmarks.forEach((hand, handIndex) => {
    hand.forEach((landmark, landmarkIndex) => {
      // Set color
      // @see https://handsfree.js.org/ref/model/hands.html#data
      if (colorMap[handIndex]) {
        switch (landmarkIndex) {
          case 8: fill(colorMap[handIndex][0]); break
          case 12: fill(colorMap[handIndex][1]); break
          case 16: fill(colorMap[handIndex][2]); break
          case 20: fill(colorMap[handIndex][3]); break
          default:
            fill(color(255, 255, 255))
        }                
      }
      // Set stroke
      if (handIndex === 0 && landmarkIndex === 8) {
        stroke(color(255, 255, 255))
        strokeWeight(5)
        circleSize = 40
      } else {
        stroke(color(0, 0, 0))
        strokeWeight(0)
        circleSize = 10
      }
      
      circle(
        // Flip horizontally
        sketch.width - landmark.x * sketch.width,
        landmark.y * sketch.height,
        circleSize
      )
    })
  })
}