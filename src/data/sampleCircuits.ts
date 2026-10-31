/**
 * Curated educational sample circuits for FixLens
 * Includes SVG schematic diagrams, symptoms, and pre-packaged context
 */

import { SampleCircuit } from '../types';

export const SAMPLE_CIRCUITS: SampleCircuit[] = [
  {
    id: 'sample-led-polarity',
    title: 'LED Does Not Illuminate',
    tagline: 'Classic beginner breadboard setup with no light emission when sketch runs.',
    badge: 'Beginner • Basic I/O',
    difficulty: 'Beginner',
    components: ['Arduino Uno', 'LED', 'Resistor', 'Breadboard', 'Jumper wires'],
    problemDescription: 'The red LED connected to digital pin 13 does not turn on even though the standard Blink sketch was uploaded and the onboard L LED is flashing. The circuit is powered via USB cable.',
    expectedBehavior: 'The external red LED should flash on for 1 second and off for 1 second in sync with digital pin 13 output.',
    actualBehavior: 'The external LED stays completely unlit at all times. The Arduino onboard L LED blinks as programmed.',
    isPowered: 'yes',
    educationalNotes: 'LEDs are polar semiconductor diodes. If the longer anode lead (+) is inserted into ground or if the cathode lead (-) does not bridge back to the Arduino GND pin through the resistor, no current can flow.',
    knownClues: [
      'Onboard Arduino power (ON) LED is lit green (Power is functional).',
      'Onboard L LED is blinking (Microcontroller code is running).',
      'External LED cathode (-) is placed in the blue rail, but the ground jumper wire is plugged into the wrong row.',
      'Resistor is 220Ω (correct current limiting range).',
    ],
    schematicSvg: `<svg viewBox="0 0 400 240" class="w-full h-auto text-slate-200">
      <rect width="400" height="240" rx="12" fill="#0b1329" stroke="#1e293b" stroke-width="2"/>
      <!-- Arduino Uno representation -->
      <rect x="25" y="35" width="120" height="170" rx="8" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
      <text x="85" y="60" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="12">ARDUINO UNO</text>
      <!-- USB port -->
      <rect x="15" y="70" width="15" height="30" fill="#94a3b8" rx="2"/>
      <text x="22" y="115" font-size="8" fill="#67e8f9">USB 5V</text>
      <!-- Pin 13 -->
      <circle cx="140" cy="85" r="4" fill="#fbbf24"/>
      <text x="110" y="88" fill="#ffffff" font-size="9">PIN 13</text>
      <!-- GND -->
      <circle cx="140" cy="140" r="4" fill="#f87171"/>
      <text x="115" y="143" fill="#ffffff" font-size="9">GND</text>
      
      <!-- Breadboard representation -->
      <rect x="190" y="35" width="185" height="170" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <text x="282" y="55" text-anchor="middle" fill="#94a3b8" font-size="10">HALF-SIZE BREADBOARD</text>
      <!-- Power rails -->
      <line x1="200" y1="70" x2="200" y2="190" stroke="#ef4444" stroke-width="2" stroke-dasharray="2,2"/>
      <line x1="208" y1="70" x2="208" y2="190" stroke="#3b82f6" stroke-width="2"/>
      
      <!-- Wire 1: Pin 13 to Breadboard Row 10 -->
      <path d="M 140 85 Q 165 75 240 85" fill="none" stroke="#eab308" stroke-width="2.5"/>
      
      <!-- 220 Ohm Resistor in Breadboard -->
      <rect x="240" y="82" width="40" height="8" rx="3" fill="#d97706"/>
      <text x="260" y="76" text-anchor="middle" fill="#fcd34d" font-size="8">220Ω</text>
      
      <!-- LED -->
      <circle cx="300" cy="86" r="8" fill="#ef4444" opacity="0.85"/>
      <text x="325" y="90" fill="#f87171" font-size="9">LED (Red)</text>
      
      <!-- Disconnected GND jumper wire showing problem -->
      <path d="M 140 140 Q 180 155 240 155" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4,3"/>
      <circle cx="240" cy="155" r="4" fill="#ef4444"/>
      <text x="250" y="158" fill="#f87171" font-size="8">❌ Wire not in LED row!</text>
    </svg>`,
  },
  {
    id: 'sample-ultrasonic-sensor',
    title: 'Ultrasonic Sensor Shows Zero Distance',
    tagline: 'HC-SR04 sonar module returning 0 cm or timing out on the serial monitor.',
    badge: 'Intermediate • Timing & Pulse',
    difficulty: 'Intermediate',
    components: ['Arduino Uno', 'Ultrasonic sensor', 'Breadboard', 'Jumper wires'],
    problemDescription: 'The HC-SR04 ultrasonic sensor reports either 0 cm or 1100+ cm continuously on the Serial Monitor. The sensor was wired to pins 9 and 10 as specified in the tutorial.',
    expectedBehavior: 'Serial monitor should display accurate distances in centimeters as an obstacle moves closer or further away.',
    actualBehavior: 'Distance readings freeze at 0 cm or trigger timeout error messages on every pulseIn() call.',
    isPowered: 'yes',
    educationalNotes: 'The HC-SR04 module has four pins: VCC, Trig, Echo, and GND. Trig requires a 10 microsecond trigger pulse, and Echo outputs high for the duration of sonic flight. Swapping the Trig and Echo leads is a very common beginner mistake that causes pulseIn() to hang.',
    knownClues: [
      'Arduino power rail is providing 5V.',
      'Sensor VCC and GND are connected to breadboard rails.',
      'Jumper wire from Arduino Pin 9 is connected to Echo instead of Trig.',
      'Jumper wire from Arduino Pin 10 is connected to Trig instead of Echo.',
    ],
    schematicSvg: `<svg viewBox="0 0 400 240" class="w-full h-auto text-slate-200">
      <rect width="400" height="240" rx="12" fill="#0b1329" stroke="#1e293b" stroke-width="2"/>
      <!-- Arduino Uno -->
      <rect x="25" y="35" width="110" height="170" rx="8" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
      <text x="80" y="60" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="11">ARDUINO</text>
      <text x="80" y="95" fill="#fcd34d" font-size="9">Pin 9 (Trig in code)</text>
      <text x="80" y="125" fill="#a7f3d0" font-size="9">Pin 10 (Echo in code)</text>
      <circle cx="135" cy="92" r="3.5" fill="#fbbf24"/>
      <circle cx="135" cy="122" r="3.5" fill="#34d399"/>
      
      <!-- HC-SR04 Sensor -->
      <rect x="220" y="45" width="150" height="145" rx="10" fill="#0f766e" stroke="#14b8a6" stroke-width="2"/>
      <text x="295" y="70" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="11">HC-SR04</text>
      <!-- Transducers -->
      <circle cx="255" cy="115" r="22" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
      <circle cx="335" cy="115" r="22" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
      <text x="255" y="118" text-anchor="middle" fill="#ffffff" font-size="8">TX</text>
      <text x="335" y="118" text-anchor="middle" fill="#ffffff" font-size="8">RX</text>
      
      <!-- Crossed wires -->
      <path d="M 135 92 C 170 92, 175 160, 260 165" fill="none" stroke="#fbbf24" stroke-width="2.5"/>
      <path d="M 135 122 C 170 122, 175 145, 240 145" fill="none" stroke="#34d399" stroke-width="2.5"/>
      <text x="145" y="175" fill="#f87171" font-size="9" font-weight="bold">⚠️ Swapped Pins!</text>
    </svg>`,
  },
  {
    id: 'sample-servo-brownout',
    title: 'Servo Motor Jitters & Arduino Resets',
    tagline: 'SG90 servo twitches randomly and the Arduino board resets continuously.',
    badge: 'Intermediate • Power Supply',
    difficulty: 'Intermediate',
    components: ['Arduino Uno', 'Servo motor', 'Breadboard', 'Jumper wires'],
    problemDescription: 'When the servo motor starts sweeping to 90 degrees, it buzzes violently, stutters, and the Arduino TX/RX and power LEDs flicker off and on as if the board is constantly restarting.',
    expectedBehavior: 'The servo horn should rotate smoothly from 0 to 180 degrees back and forth without restarting the Arduino.',
    actualBehavior: 'The motor moves slightly, twitches, and the Arduino resets back to the beginning of the setup() function in an infinite loop.',
    isPowered: 'yes',
    educationalNotes: 'Hobby servo motors draw substantial stall and in-rush current (often 500mA to 1A) when moving from a standstill. The Arduino onboard 5V regulator cannot supply this current alongside the microcontroller, causing the 5V rail to sag below 4.5V (a brownout reset). Servos should be powered by an external 5V source with shared GND.',
    knownClues: [
      'Servo red wire (VCC) is plugged directly into the Arduino 5V header.',
      'No decoupling capacitor (e.g. 100uF - 470uF) is present across the power rails.',
      'Brownout reset symptoms: Board re-runs setup() every time motor engages.',
      'USB host computer reports USB current surge warning.',
    ],
    schematicSvg: `<svg viewBox="0 0 400 240" class="w-full h-auto text-slate-200">
      <rect width="400" height="240" rx="12" fill="#0b1329" stroke="#1e293b" stroke-width="2"/>
      <!-- Arduino Uno -->
      <rect x="25" y="35" width="115" height="170" rx="8" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
      <text x="82" y="60" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="11">ARDUINO UNO</text>
      <!-- 5V pin warning -->
      <circle cx="140" cy="110" r="4" fill="#ef4444"/>
      <text x="95" y="113" fill="#fca5a5" font-size="9">5V (Sag!)</text>
      <!-- GND -->
      <circle cx="140" cy="140" r="4" fill="#94a3b8"/>
      <text x="110" y="143" fill="#94a3b8" font-size="9">GND</text>
      
      <!-- SG90 Micro Servo -->
      <rect x="230" y="55" width="130" height="120" rx="8" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
      <text x="295" y="80" text-anchor="middle" fill="#ffffff" font-weight="bold" font-size="11">SG90 SERVO</text>
      <!-- Servo Horn -->
      <circle cx="265" cy="115" r="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="265" y1="115" x2="285" y2="100" stroke="#0284c7" stroke-width="5" stroke-linecap="round"/>
      <text x="265" y="150" fill="#93c5fd" font-size="9">High Surge Current</text>
      
      <!-- Shared 5V power wire -->
      <path d="M 140 110 Q 185 85 230 100" fill="none" stroke="#ef4444" stroke-width="3"/>
      <text x="160" y="75" fill="#f87171" font-size="8" font-weight="bold">⚡ Current Overdraw</text>
      
      <!-- Brownout callout -->
      <rect x="150" y="180" width="220" height="36" rx="6" fill="#450a0a" stroke="#dc2626"/>
      <text x="260" y="202" text-anchor="middle" fill="#fecaca" font-size="9" font-weight="bold">Needs External 5V Power Supply</text>
    </svg>`,
  },
];
