/*
  ============================================================
  YOUR SITE CONTENT LIVES IN THIS FILE
  ============================================================

  SITE     = your name, links and about text.
  PROJECTS = one entry per project. The order here is the order
             on the home page, so put your best project first.

  To add a project:
    1. Put its photos/videos in a new folder, e.g. assets/img/my-project/
    2. Copy the TEMPLATE at the bottom of this file, fill it in,
       and paste it into the PROJECTS list.
    3. Save, upload to GitHub, done.

  Images: "media" can be a flat list, or a list of groups like
    media: [ [schematic], [render-top, render-bottom] ]
  Each group gets its own rows, so related pictures stay together.

  Any field you leave out (or set to "") is simply not shown.
*/

window.SITE = {
  name: "Abdulhakim Amtouti",
  tagline:
    "Electronic and Electrical Engineering at UCL, with interests spanning embedded systems, robotics, FPGAs and power electronics.",
  location: "London",

  // Leave any of these as "" to hide it.
  email: "abdulamto26@icloud.com",
  github: "https://github.com/Zceeamt",
  linkedin: "https://www.linkedin.com/in/abdulhakim-amtouti-85b795283/",
  phone: "+44 7576 065599",
  cv: "",

  about: [
    "I'm a third-year Electronic and Electrical Engineering student at UCL.",
    "I work on embedded hardware: multilayer PCBs, microcontrollers, FPGAs and power electronics. I like taking a project from schematic to a board that actually works, whether that means flying a drone, driving a motor or streaming data.",
    "My interests span embedded systems, digital design and power electronics, with a particular interest in robotics."
  ]
};

window.PROJECTS = [
  {
    id: "quadcopter",
    file: "quadcopter.exe",
    title: "Custom quadcopter and flight controller",
    year: "2026",
    type: "Hardware",
    summary:
      "A bespoke four-layer STM32H743 flight controller, integrated into a custom airframe and validated in outdoor flight.",
    cover: "assets/img/quadcopter/cover.jpg",

    intro:
      "End-to-end development of a quadcopter around a bespoke flight controller. The four-layer board combines an STM32H743 processor with a six-axis inertial measurement unit and a barometric pressure sensor. The project spans schematic capture and layout in KiCad, fabrication, hardware bring-up in Betaflight and an airframe designed in Fusion 360, culminating in a successful outdoor flight.",

    facts: [
      ["Year", "2026"],
      ["Role", "Sole designer: electronics, mechanical design, assembly and validation"],
      ["Status", "Flight-tested"],
      ["Tools", "KiCad, Fusion 360, Betaflight, 3D printing"]
    ],

    hero: [
      { src: "assets/img/quadcopter/drone-battery.jpg", alt: "The finished quadcopter from above, battery strapped on top", caption: "Top" },
      { src: "assets/img/quadcopter/drone-top.jpg", alt: "The quadcopter from below, showing the motors and TPU guards", caption: "Underside" }
    ],

    sections: [
      {
        heading: "The flight controller",
        text: [
          "The board is built around an STM32H743, a 480 MHz Arm Cortex-M7. The ICM-42688-P IMU occupies a dedicated SPI bus with its own data-ready interrupt, allowing each sample to be serviced with minimal latency; a DPS368 barometer on a second SPI bus provides altitude estimation without contending for the IMU's bandwidth.",
          "Four hardware timer channels generate the motor commands, routed through an 8-pin JST-SH connector to a four-in-one ESC. Three UARTs are reserved for a radio receiver, GPS and telemetry, while SWD and a boot-select button support programming and debugging. A 25 MHz crystal provides the system clock reference.",
          "Battery power passes through a P-channel MOSFET for reverse-polarity protection before an AP63203 synchronous buck converter generates the 3.3 V rail. USB-C can power the board independently via a Schottky-diode power path, and a USBLC6 array protects the USB data lines against electrostatic discharge."
        ],
        media: [
          [
            { src: "assets/img/quadcopter/schematic.jpg", caption: "Schematic" }
          ],
          [
            { src: "assets/img/quadcopter/kicad-3d-top.jpg", caption: "3D render, top" },
            { src: "assets/img/quadcopter/kicad-3d-bottom.jpg", caption: "3D render, bottom" }
          ],
          [
            { src: "assets/img/quadcopter/pcb-top.jpg", caption: "Manufactured board" },
            { src: "assets/img/quadcopter/pcb-side.jpg", caption: "Manufactured board, rotated" }
          ]
        ]
      },
      {
        heading: "Four-layer layout",
        text: [
          "The stack-up places components and signal routing on the outer layers, with a continuous ground plane and a dedicated 3.3 V plane on the inner layers. The uninterrupted ground provides a tight return path beneath every signal, reducing loop area and noise coupling, while the power plane distributes the supply at substantially lower impedance than discrete traces.",
          "Placement was driven by signal integrity: the crystal sits immediately beside the processor, the USB pair is routed as a controlled differential pair, the IMU interface is kept short, and each supply pin is decoupled at the point of use."
        ],
        media: [
          { src: "assets/img/quadcopter/layer-fcu.jpg", caption: "Top layer (F.Cu)" },
          { src: "assets/img/quadcopter/layer-in1.jpg", caption: "Inner layer 1: ground" },
          { src: "assets/img/quadcopter/layer-in2.jpg", caption: "Inner layer 2: 3.3 V" },
          { src: "assets/img/quadcopter/layer-bcu.jpg", caption: "Bottom layer (B.Cu)" }
        ]
      },
      {
        heading: "Airframe",
        text: [
          "The airframe was designed in Fusion 360 and printed in two materials. A PLA chassis provides structural rigidity, while TPU motor mounts absorb impact loads and attenuate motor vibration before it reaches the inertial sensors. The ESC and flight controller are stacked on isolated mounts within a ventilated central bay, with the battery secured above."
        ],
        media: [
          { src: "assets/img/quadcopter/frame-esc.jpg", caption: "Four-in-one ESC in the frame" },
          { src: "assets/img/quadcopter/frame-fc.jpg", caption: "Flight controller stacked above it" }
        ]
      },
      {
        heading: "Bring-up and flight",
        text: [
          "Bring-up followed a staged sequence, so that each fault would be isolated to the step that introduced it."
        ],
        steps: [
          "Visual inspection of the assembled board for fabrication and soldering defects.",
          "Verification of the power rails prior to any further connection.",
          "Enumeration over USB-C and confirmation of firmware communication in Betaflight.",
          "Validation of IMU response and board orientation against Betaflight's live attitude model.",
          "ESC integration and mapping of each motor output to its physical position.",
          "Airframe integration, with motor direction and propeller orientation confirmed.",
          "Outdoor flight test."
        ],
        media: [
          [
            { src: "assets/img/quadcopter/pcb-powered-1.png", alt: "Flight-controller PCB powered over USB-C with the red power LED illuminated", caption: "First power-up over USB-C: power LED (red)" },
            { src: "assets/img/quadcopter/pcb-powered-2.png", alt: "Flight-controller PCB powered over USB-C with the red power LED and green MCU status LED illuminated", caption: "Firmware running from USB power: power LED (red) and MCU status LED (green)" }
          ],
          [
            { src: "assets/img/quadcopter/betaflight-1.jpg", caption: "Betaflight recognising the board" },
            { src: "assets/img/quadcopter/betaflight-2.jpg", caption: "The model following the board's orientation" }
          ],
          [
            { video: "assets/video/quadcopter/flight-test.mp4", poster: "assets/img/quadcopter/flight-poster.jpg", caption: "Outdoor flight test" }
          ]
        ]
      }
    ],

    specs: [
      ["Processor", "STM32H743, Arm Cortex-M7 at 480 MHz"],
      ["Motion sensor", "ICM-42688-P six-axis IMU, SPI with interrupt"],
      ["Barometer", "DPS368, on a second SPI bus"],
      ["Clock", "25 MHz crystal"],
      ["Interfaces", "USB-C, SWD, three UARTs"],
      ["Motor outputs", "Four timer channels to a four-in-one ESC via JST-SH"],
      ["Power", "Reverse-polarity MOSFET, AP63203 buck to 3.3 V, USB power path"],
      ["Protection", "USBLC6 ESD protection on USB"],
      ["PCB", "Four layers: signal, ground, 3.3 V, signal"],
      ["Firmware", "Betaflight"],
      ["Airframe", "PLA frame with TPU motor mounts"]
    ],

    skills: [
      "Schematic capture", "Four-layer PCB layout", "KiCad", "STM32 hardware",
      "SPI and UART", "USB-C", "Power design", "Soldering and bring-up",
      "Fusion 360", "3D printing", "Betaflight", "Flight testing"
    ],

    gallery: [],
    links: [
      { label: "View on GitHub", url: "https://github.com/Zceeamt/custom-stm32-drone-flight-controller" }
    ]
  },

  {
    id: "esc",
    file: "bldc_esc.exe",
    title: "AM32 brushless motor speed controller PCB",
    year: "2026",
    type: "Hardware",
    summary:
      "A complex four-layer PCB implementation of the AM32 sensorless BLDC ESC reference design, centred on an STM32F051 and DRV8300 three-phase gate driver.",
    cover: "assets/img/esc/render-top.jpg",

    intro:
      "This project translates the AM32 reference schematic for a sensorless brushless-motor controller into a manufacturable four-layer PCB. My work focused on component placement, high-current power routing, mixed-signal separation, grounding and thermal management around the STM32F051, DRV8300 gate driver and six-MOSFET bridge.",

    facts: [
      ["Year", "2026"],
      ["Role", "Four-layer PCB implementation and routing from the AM32 reference schematic"],
      ["Status", "PCB layout complete; design-only project"],
      ["Tools", "KiCad"]
    ],

    hero: [
      { src: "assets/img/esc/render-top.jpg", alt: "3D render of the top side: six MOSFETs and the bulk capacitors", caption: "Top: power stage" },
      { src: "assets/img/esc/render-bottom.jpg", alt: "3D render of the underside: microcontroller and gate driver", caption: "Bottom: control" }
    ],

    sections: [
      {
        heading: "Power stage",
        text: [
          "The adopted AM32 architecture uses six PSMN5R2-60YL MOSFETs as three half-bridges, one per motor phase, with a DRV8300 providing the high-side and low-side gate drive.",
          "Routing the switching stage required short gate paths, wide phase and battery pours, controlled separation from sensitive signals and close placement of seven 47 µF bulk capacitors to contain the bridge's pulsed current demand."
        ]
      },
      {
        heading: "Control and sensing",
        text: [
          "The reference circuitry infers rotor position from the zero-crossing of the undriven phase against a synthesised virtual neutral. These analogue paths were routed away from high-dv/dt switching nodes and returned to a stable ground reference.",
          "The layout also accommodates a 1 mΩ shunt and INA180 current-sense amplifier, battery-voltage monitoring, separate 5 V and 3.3 V regulation, analogue-supply filtering, throttle, telemetry, SWD and dedicated test points."
        ],
        media: [
          { src: "assets/img/esc/schematic.jpg", caption: "AM32 reference schematic used for the PCB implementation" }
        ]
      },
      {
        heading: "Four-layer layout",
        text: [
          "The power stage occupies the top side and the control circuitry the bottom, physically separating high-dv/dt switching nodes from the sensitive measurement paths. Battery and phase currents are carried in wide copper pours, with zone priorities ensuring clean isolation from the surrounding ground fill.",
          "An array of 0.2 mm thermal vias beneath the gate driver's exposed pad conducts heat into the internal planes, and ground stitching maintains a low-impedance reference across all four layers. The design adheres to standard fabrication capabilities: 0.15 mm clearance and 0.3 mm vias on 0.6 mm pads."
        ],
        media: [
          { src: "assets/img/esc/layout-top.jpg", caption: "Top layer (F.Cu)" },
          { src: "assets/img/esc/layout-inner-1.jpg", caption: "Inner layer 1" },
          { src: "assets/img/esc/layout-inner-2.jpg", caption: "Inner layer 2" },
          { src: "assets/img/esc/layout-bottom.jpg", caption: "Bottom layer (B.Cu)" }
        ]
      }
    ],

    specs: [
      ["Microcontroller", "STM32F051, Arm Cortex-M0"],
      ["Gate driver", "TI DRV8300, three-phase"],
      ["MOSFETs", "Six Nexperia PSMN5R2-60YL, 60 V"],
      ["Commutation", "Sensorless, back-EMF with a virtual neutral"],
      ["Current sensing", "1 mΩ low-side shunt and INA180"],
      ["Voltage sensing", "Battery divider"],
      ["Regulators", "LM3480, 5 V and 3.3 V"],
      ["Bulk capacitance", "Seven 47 µF capacitors"],
      ["Interfaces", "Throttle in, telemetry out, SWD"],
      ["PCB", "Four layers, 0.15 mm clearance, 0.3/0.6 mm vias"]
    ],

    skills: [
      "AM32 hardware architecture", "High-current PCB routing", "Mixed-signal placement",
      "Four-layer stack-up", "Grounding", "Thermal-via design", "KiCad", "Design for manufacture"
    ],

    gallery: [],
    links: [
      { label: "View on GitHub", url: "https://github.com/Zceeamt/four-layer-bldc-esc" }
    ]
  },

  {
    id: "fpga-uart",
    file: "uart_tx.sv",
    title: "UART transmitter on an FPGA",
    year: "2026",
    type: "Digital hardware",
    summary:
      "A UART transmitter implemented in SystemVerilog on a Cyclone IV FPGA and verified against an external receiver in hardware.",
    cover: "assets/img/uart/cover.jpg",

    intro:
      "A UART transmitter implemented in SystemVerilog without vendor IP and deployed on a DE0-Nano (Cyclone IV) FPGA. The design derives 9600 baud timing from the 50 MHz system clock and was verified in hardware against an independent microcontroller receiver, sustaining a continuous error-free data stream.",

    facts: [
      ["Year", "2026"],
      ["Role", "Sole designer: RTL, synthesis, pin assignment and testing"],
      ["Status", "Working on hardware"],
      ["Tools", "SystemVerilog, Quartus Prime, DE0-Nano, Arduino"]
    ],

    hero: [
      { src: "assets/img/uart/board-setup.jpg", alt: "DE0-Nano FPGA board wired to an Arduino Uno", caption: "Test setup: FPGA and Arduino" },
      { src: "assets/img/uart/serial-monitor.jpg", alt: "Arduino Serial Monitor showing a continuous A to Z stream", caption: "The alphabet arriving at the Serial Monitor" }
    ],

    sections: [
      {
        heading: "How it works",
        text: [
          "A top-level module binds the RTL to the device pins, distributes the 50 MHz oscillator and drives the serial output onto a GPIO header. Reset is held inactive within the design rather than assigned to an external FPGA pin.",
          "Within the transmitter, a parameterised counter divides the system clock to the bit period: approximately 5,208 cycles per bit at 9600 baud, a rate error below 0.01%. As the link is asynchronous, this precision alone keeps transmitter and receiver aligned across each frame.",
          "Data is serialised in standard 8N1 framing: a start bit, eight data bits least significant first, and a stop bit. A finite-state machine sequences the ASCII characters A to Z, loading the next character on completion of each frame to produce a continuous test pattern."
        ]
      },
      {
        heading: "Synthesis and pin assignment",
        text: [
          "The design was synthesised and fitted in Intel Quartus Prime, with the clock and serial I/O constrained to the EP4CE22F17C6's package pins through the Pin Planner; reset remains held inactive in the RTL."
        ],
        media: [
          { src: "assets/img/uart/pin-planner.jpg", caption: "Pin Planner for the EP4CE22F17C6" }
        ]
      },
      {
        heading: "Testing on hardware",
        text: [
          "Verification extended beyond simulation to hardware in the loop. The FPGA output was connected to an Arduino Uno sharing a common ground, which received at 9600 baud and relayed each byte to a host PC.",
          "The character sequence was received continuously without corruption, confirming bit timing, frame structure and physical-layer integrity together."
        ]
      }
    ],

    specs: [
      ["Board", "Terasic DE0-Nano"],
      ["FPGA", "Intel Cyclone IV E, EP4CE22F17C6"],
      ["Language", "SystemVerilog"],
      ["Toolchain", "Intel Quartus Prime"],
      ["System clock", "50 MHz"],
      ["Baud rate", "9600"],
      ["Frame", "8N1, least significant bit first"],
      ["Test receiver", "Arduino Uno, SoftwareSerial"]
    ],

    skills: [
      "SystemVerilog", "RTL design", "State machines", "Clock division",
      "UART protocol", "Quartus Prime", "Pin assignment", "Hardware testing"
    ],

    gallery: [],
    links: [
      { label: "View on GitHub", url: "https://github.com/Zceeamt/fpga-uart-transmitter" }
    ]
  },

  {
    id: "power-supply",
    file: "dc_dc_supply.exe",
    title: "Dual-output DC-DC power supply",
    year: "2026",
    type: "Power electronics",
    summary:
      "A dual-output MC34063A power supply designed for a 5–12 V input range, with regulated 5 V and 12 V rails and discrete output-current limiting.",
    cover: "assets/img/power-supply/cover.jpg",

    intro:
      "An intensive group design project responding to a customer specification for the power subsystem of an Antarctic weather station. Designed for a 5–12 V input range, the supply delivers regulated 5 V and 12 V rails with discrete short-circuit protection. I developed the circuit and Multisim model, then contributed to hardware bring-up, verification and the engineering tender.",

    facts: [
      ["Year", "2026"],
      ["Role", "Circuit design, simulation and hardware validation within a group project"],
      ["Outcome", "Working hardware prototype and nine-document engineering tender"],
      ["Tools", "NI Multisim, multimeter and oscilloscope"]
    ],

    hero: [
      { src: "assets/img/power-supply/pcb.jpg", alt: "The assembled power supply board, with 12 V, 5 V and input header", caption: "The assembled board" }
    ],

    sections: [
      {
        heading: "The brief",
        text: [
          "The customer specification required the supply to:"
        ],
        steps: [
          "Accept a 5–12 V battery input and provide regulated 5 V and 12 V outputs.",
          "Withstand storage at −40 °C and meet specification from 0 °C to 70 °C.",
          "Exceed 60% efficiency at a 20 mA load on either output.",
          "Limit short-circuit current to 30 mA on either output.",
          "Maintain regulation with the input ±20% from nominal.",
          "Weigh no more than 25 g."
        ]
      },
      {
        heading: "Circuit design",
        text: [
          "Independent MC34063A stages provide the two regulated rails across the 5–12 V design input range. At the 6 V nominal operating point, the 12 V rail uses a boost topology and the 5 V rail a buck topology, each with a 150 µH inductor and a 1N5819 Schottky rectifier. The feedback networks set the outputs at 1.25 V × (1 + 17.2/2) ≈ 12.0 V and 1.25 V × (1 + 3/1) = 5.0 V, while low-value sense resistors bound the peak switch current within each converter.",
          "Each output is protected by a discrete BC817 current limiter. Load current develops a voltage across a 24 Ω sense resistor; as this approaches 0.6 V, a second transistor diverts base drive from the pass device, giving a calculated limit of approximately 25 mA against the 30 mA short-circuit requirement."
        ],
        media: [
          { src: "assets/img/power-supply/schematic.jpg", caption: "Multisim schematic with probe readings" }
        ]
      },
      {
        heading: "Simulation",
        text: [
          "Transient analysis shows both rails reaching regulation within approximately 1.2 ms of power-up. At a load of about 20 mA, the 12 V output exhibits roughly 55 mV peak-to-peak ripple and the 5 V output less than 1 mV.",
          "Temperature and input-voltage sweeps characterised behaviour across operating conditions. The 12 V rail remained stable throughout the input range, while the 5 V rail showed modest variation, identifying where the buck stage had least headroom and informing the selection of nominal battery voltage."
        ],
        media: [
          { src: "assets/img/power-supply/transient.jpg", caption: "Start-up transient: 12 V above, 5 V below" },
          { src: "assets/img/power-supply/temperature-sweep.jpg", caption: "Temperature sweep" },
          { src: "assets/img/power-supply/input-sweep.jpg", caption: "Input voltage sweep, 5.0 to 5.7 V" }
        ]
      },
      {
        heading: "Verification and documentation",
        text: [
          "The team realised and brought up multiple hardware prototypes, selected the strongest candidate through a weighted decision matrix, and verified it against each requirement. The outcome was presented as a nine-document engineering tender in competition with 22 other teams for a proposed 200-unit production order.",
          "The tender comprised a refined requirements specification, project plan, decision matrix, risk register, verification report, manufacturing test procedure, product datasheet and production costing at quantities of 1 and 200. The product datasheet was commended for its presentation."
        ]
      }
    ],

    specs: [
      ["Outputs", "5 V and 12 V"],
      ["Input", "Designed for 5–12 V; 6 V nominal analysis point"],
      ["Converters", "Two MC34063A: buck for 5 V, boost for 12 V"],
      ["Power components", "150 µH inductors, 1N5819 Schottky diodes"],
      ["Current limiting", "BC817 limiter per output, about 25 mA"],
      ["Ripple (simulated)", "About 55 mV p-p at 12 V, under 1 mV p-p at 5 V"],
      ["Start-up (simulated)", "About 1.2 ms to regulation"],
      ["Simulation", "Multisim transient, temperature and input sweeps"]
    ],

    skills: [
      "DC-DC converters", "Buck and boost design", "Current limiting", "Multisim",
      "Datasheet analysis", "Requirements engineering", "Verification", "Technical writing", "Teamwork"
    ],

    gallery: [],
    links: [
      { label: "View on GitHub", url: "https://github.com/Zceeamt/dual-output-dc-dc-power-supply" }
    ]
  }

  /*
  ,{
    id: "my-project",                 // short, lowercase, no spaces (used in the link)
    title: "Project title",
    year: "2026",
    type: "Software",                 // e.g. Hardware, Software, Simulation
    summary: "One sentence for the home page card.",
    cover: "assets/img/my-project/cover.jpg",

    intro: "A short paragraph at the top of the project page.",

    facts: [
      ["Year", "2026"],
      ["Role", "What you did"],
      ["Status", "Finished / In progress"],
      ["Tools", "..."]
    ],

    hero: [
      { src: "assets/img/my-project/front.jpg", alt: "Describe the photo", caption: "Front" },
      { src: "assets/img/my-project/back.jpg", alt: "Describe the photo", caption: "Back" }
    ],

    sections: [
      {
        heading: "Section heading",
        text: ["First paragraph.", "Second paragraph."],
        media: [
          [ { src: "assets/img/my-project/schematic.jpg", caption: "Schematic" } ],
          [
            { src: "assets/img/my-project/photo.jpg", caption: "Caption" },
            { video: "assets/video/my-project/clip.mp4", caption: "A short clip (MP4)" },
            { youtube: "https://youtu.be/VIDEO_ID", caption: "A longer video on YouTube" }
          ]
        ]
      }
    ],

    specs: [["Label", "Value"]],
    skills: ["Skill one", "Skill two"],
    gallery: [],
    links: [
      { label: "Code on GitHub", url: "https://github.com/..." }
    ]
  }
  */
];
