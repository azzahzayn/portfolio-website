// RPG Portfolio Game Engine - Azzah Zayn H.

// --- 8-BIT SOUND EFFECT SYNTHESIZER (Web Audio API) ---
class AudioSynth {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    playTone(freq, type, duration, volume = 0.1) {
        if (this.muted) return;
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
        // Exponential decay for retro feel
        gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playSelect() {
        this.playTone(600, 'square', 0.1, 0.05);
    }

    playInteract() {
        this.playTone(400, 'triangle', 0.15, 0.08);
        setTimeout(() => this.playTone(550, 'triangle', 0.2, 0.08), 80);
    }

    playChest() {
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 'square', 0.3, 0.06);
            }, index * 100);
        });
    }

    playClose() {
        this.playTone(350, 'triangle', 0.1, 0.08);
        setTimeout(() => this.playTone(250, 'triangle', 0.15, 0.08), 60);
    }

    playWalk() {
        // Very low soft frequency for walking steps
        this.playTone(70, 'triangle', 0.05, 0.03);
    }
}

const soundFX = new AudioSynth();

// --- SPRITE PIXEL ART DATA (16x16 grid matrices) ---
// Keys: . = transparent, others map to HSL colors in color list
const SPRITES = {
    // Mage character frames
    mage_down: [
        "..44444444......",
        ".4499999944.....",
        "449888888944....",
        "498228822894....",
        "498881188894.7..",
        "449988889944.7..",
        ".4446666444.777.",
        "...633336...757.",
        "..63333336...5..",
        "..33333333...5..",
        "..33333333...5..",
        "..33333333...5..",
        "..3a3333a3...5..",
        "...a    a.......",
        "...2    2.......",
        "...22   22......"
    ],
    mage_up: [
        "..44444444......",
        ".4444444444.....",
        "444444444444....",
        "444444444444....",
        "444444444444.7..",
        "444444444444.7..",
        ".4446666444.777.",
        "...633336...757.",
        "..63333336...5..",
        "..33333333...5..",
        "..33333333...5..",
        "..33333333...5..",
        "..33333333...5..",
        "...a    a.......",
        "...2    2.......",
        "...22   22......"
    ],
    mage_left: [
        "...4444444......",
        "..449999944.....",
        ".4498888894.....",
        ".4982288894.....",
        ".4988811894..7..",
        ".4499888994..7..",
        "..444666444.777.",
        "...633336...757.",
        "..6333336....5..",
        "..3333333....5..",
        "..3333333....5..",
        "..3333333....5..",
        "..3a3333a....5..",
        "...a   a........",
        "...2   2........",
        "..22  22........"
    ],
    mage_right: [
        "......4444444...",
        ".....449999944..",
        ".....4988888944.",
        ".....4988822894.",
        "..7..4981188894.",
        "..7..4499888994.",
        ".777..444666444.",
        ".757...633336...",
        "..5....6333336..",
        "..5....3333333..",
        "..5....3333333..",
        "..5....3333333..",
        "..5....3a3333a..",
        "........a   a...",
        "........2   2...",
        ".......22  22..."
    ],

    // Knight character frames
    knight_down: [
        ".....88888......",
        "....8111118.....",
        "...811221118....",
        "..81126621118...",
        "..81169961118...",
        "..81111111118...",
        "...888338888....",
        "....8333383.....",
        "..4.3333333.4...",
        "..4.3333333.4...",
        "..44333333344...",
        "...433333334....",
        "....3333333.....",
        "....22   22.....",
        "....22   22.....",
        "....88   88....."
    ],
    knight_up: [
        ".....88888......",
        "....8111118.....",
        "...811111118....",
        "..81111111118...",
        "..81111111118...",
        "..81111111118...",
        "...888338888....",
        "....8333383.....",
        "....3333333.....",
        "....3333333.....",
        "....3333333.....",
        "....3333333.....",
        "....3333333.....",
        "....22   22.....",
        "....22   22.....",
        "....88   88....."
    ],
    knight_left: [
        "......88888.....",
        ".....8111118....",
        "....811221118...",
        "...8112662118...",
        "...8116996118...",
        "...8111111118...",
        "....88833888....",
        ".....8333383.4..",
        "....33333333.4..",
        "....33333333.44.",
        "....33333333.4..",
        "....33333333....",
        ".....333333.....",
        "....22   22.....",
        "....22   22.....",
        "....88   88....."
    ],
    knight_right: [
        ".....88888......",
        "....8111118.....",
        "...811111228....",
        "...8112662118...",
        "...8116996118...",
        "...8111111118...",
        "....88833888....",
        "..4..8333383....",
        "..4..3333333....",
        ".44..3333333....",
        "..4..3333333....",
        ".....3333333....",
        "......333333....",
        ".....22   22....",
        ".....22   22....",
        ".....88   88...."
    ],

    // Rogue character frames
    rogue_down: [
        ".....33333......",
        "....3377733.....",
        "...337888733....",
        "..3378228733....",
        "..3378888733....",
        "...33777733.....",
        "....333333......",
        "....114411.6....",
        "...111441116....",
        "...111111116....",
        "...11111111.....",
        "....111111......",
        "....111111......",
        "....22  22......",
        "....22  22......",
        "....22  22......"
    ],
    rogue_up: [
        ".....33333......",
        "....3333333.....",
        "...333333333....",
        "..33333333333...",
        "..33333333333...",
        "...33333333.....",
        "....333333......",
        "....114411......",
        "...11144111.....",
        "...11111111.....",
        "...11111111.....",
        "....111111......",
        "....111111......",
        "....22  22......",
        "....22  22......",
        "....22  22......"
    ],
    rogue_left: [
        "......33333.....",
        ".....3377733....",
        "....337888733...",
        "...3378228733...",
        "...3378888733...",
        "....33777733....",
        ".....333333.....",
        ".....114411.6...",
        "....111441116...",
        "....111111116...",
        "....11111111....",
        ".....111111.....",
        ".....111111.....",
        "....22  22......",
        "....22  22......",
        "....22  22......"
    ],
    rogue_right: [
        ".....33333......",
        "....3377733.....",
        "...337888733....",
        "...3378228733...",
        "...3378888733...",
        "....33777733....",
        ".....333333.....",
        "..6..114411.....",
        "..6.11144111....",
        "..6.11111111....",
        "....11111111....",
        ".....111111.....",
        ".....111111.....",
        "....22  22......",
        "....22  22......",
        "....22  22......"
    ],

    // Interactive assets
    chest_closed: [
        "................",
        "...2222222222...",
        "..21111111112...",
        ".2144444444412..",
        "214555555555412.",
        "214555555555412.",
        "221111111111122.",
        "233333333333332.",
        "233333888333332.",
        "233333898333332.",
        "233333888333332.",
        "233333333333332.",
        "233333333333332.",
        ".2222222222222..",
        "................",
        "................"
    ],
    chest_open: [
        "................",
        "....22222222....",
        "...2111111112...",
        "..214444444412..",
        "..214444444412..",
        "..221111111122..",
        "....99999999....",
        "...9888888889...",
        "..233333333332..",
        "..233333333332..",
        "..233333333332..",
        "..233333333332..",
        "..233333333332..",
        "...2222222222...",
        "................",
        "................"
    ],
    crystal: [
        "......99........",
        ".....9889.......",
        "....981189......",
        "....981189......",
        "...98111189.....",
        "...98111189.....",
        "..9811111189....",
        "..9811111189....",
        "...98111189.....",
        "...98111189.....",
        "....981189......",
        "....981189......",
        ".....9889.......",
        "......99........",
        "................",
        "................"
    ],
    mailbox: [
        "................",
        "....9999999.....",
        "...988888889....",
        "..98811118889.2.",
        "..98111111889.2.",
        "..98111111889.2.",
        "..9881111888922.",
        "...988888889.2.",
        "....9999999.....",
        "......33........",
        "......33........",
        "......33........",
        "......33........",
        "......33........",
        ".....3333.......",
        "................"
    ],
    bookshelf: [
        "2222222222222222",
        "2888888888888882",
        "2893949593959882",
        "2893949593959882",
        "2888888888888882",
        "2222222222222222",
        "2888888888888882",
        "2895939594939882",
        "2895939594939882",
        "2888888888888882",
        "2222222222222222",
        "2888888888888882",
        "2894959395949882",
        "2894959395949882",
        "2888888888888882",
        "2222222222222222"
    ],
    fireplace: [
        "2222222222222222",
        "2888888888888882",
        "2888888888888882",
        "2882222222228882",
        "2822bbbbbbbb2282",
        "222bbbbbbbbbb222",
        "22bbbb999bbbb222",
        "22bb99aa99bbbb22",
        "22b99aaaa99bbb22",
        "22b9aaaaaa99bb22",
        "22baa1111aab2222",
        "22ba111111ab2222",
        "2221133331122222",
        "2222233332222222",
        "2222222222222222",
        "2222222222222222"
    ],
    tree: [
        "......4444......",
        "....44333344....",
        "...4333333334...",
        "..433333333334..",
        ".43333333333334.",
        ".43333333333334.",
        "4333333333333334",
        "4333333333333334",
        ".43333333333334.",
        "..433333333334..",
        "....44333344....",
        "......2222......",
        "......2112......",
        "......2112......",
        "......2112......",
        ".....221122....."
    ]
};

// Colors mapping for sprite pixels
const SPRITE_COLORS = {
    mage: {
        '1': '#f39c12', // Yellow belt
        '2': '#f1c40f', // Skin/Face
        '3': '#6c5ce7', // Robes purple
        '4': '#4834d4', // Dark purple hood / shadow
        '5': '#ffeaa7', // Staff glowing orb
        '6': '#30336b', // Dark blue belt/trim
        '7': '#8c7ae6', // Staff wood
        '8': '#ffeaa7', // Eye white
        '9': '#000000', // Eye pupil
        'a': '#2f3542'  // Shoes
    },
    knight: {
        '1': '#dcdde1', // Steel light
        '2': '#7f8fa6', // Steel shadow
        '3': '#2f3640', // Armor dark trim
        '4': '#00a8ff', // Neon blue visor glow
        '6': '#718093', // Visor background
        '8': '#353b48', // Iron plate dark
        '9': '#00a8ff', // Plume blue
        '22': '#192a56', // Leg shadow
        '33': '#192a56'
    },
    rogue: {
        '1': '#27ae60', // Cloak dark green
        '2': '#1e272e', // Pants / dark boots
        '3': '#2ecc71', // Hood light green
        '4': '#d1ccc0', // Face skin
        '6': '#2ecc71', // Dagger glowing green
        '7': '#ffeaa7', // Hair highlights
        '8': '#2f3542', // Head mask/shadow
        '11': '#8e44ad'
    },
    chest_closed: {
        '1': '#8c5d3f', // Medium wood
        '2': '#1b0e07', // Dark outline
        '3': '#4a301f', // Dark wood
        '4': '#f1c40f', // Gold trim
        '5': '#ba9000', // Gold trim shadow
        '8': '#2f3640', // Metal locks
        '9': '#1e272e'
    },
    chest_open: {
        '1': '#8c5d3f',
        '2': '#1b0e07',
        '3': '#4a301f',
        '4': '#f1c40f',
        '8': '#ffd32a', // Gold coins
        '9': '#ffc048'  // Gold coins bright
    },
    crystal: {
        '9': '#00d2d3', // Glowing borders cyan
        '8': '#48dbfb', // Main crystal cyan
        '1': '#ffffff'  // Crystal highlights
    },
    mailbox: {
        '9': '#1e272e', // Outline
        '8': '#ea2027', // Red mailbox body
        '1': '#ffffff', // Mail letter paper
        '2': '#ffc312', // Mailbox flag yellow
        '3': '#57606f'  // Iron pole post
    },
    bookshelf: {
        '2': '#1b0e07', // Outline
        '8': '#8c5d3f', // Wood
        '9': '#4a301f', // Dark shelf spaces
        '3': '#ea2027', // Red book
        '4': '#1b9cfc', // Blue book
        '5': '#2ecc71'  // Green book
    },
    fireplace: {
        '2': '#3d3d3d', // Dark stone
        '8': '#4b4b4b', // Light stone
        '1': '#1e272e', // Hearth black
        '3': '#8c5d3f', // Fire logs wood
        '9': '#e67e22', // Flame orange
        'a': '#f1c40f', // Flame yellow
        'b': '#e74c3c'  // Flame red
    },
    tree: {
        '2': '#1b0e07', // Outline
        '1': '#8c5d3f', // Trunk light wood
        '3': '#27ae60', // Leaves light green
        '4': '#1e824c'  // Leaves dark green
    }
};

// --- GAME WORLD DATA ---
const TILE_SIZE = 32;
const MAP_COLS = 32;
const MAP_ROWS = 24;
const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 450;

// Grid representation of Cozy Village
// . = Grass (walkable)
// , = Dirt path (walkable)
// W = Wall / building boundary (collision)
// F = Floor (walkable, interior)
// T = Tree (collision)
// S = Water (collision)
// B = Bridge (walkable, overrides water)
// E = Fence (collision)
// interactive triggers:
// D = About Desk (Tavern)
// K = About Bookshelf (Tavern)
// C = Chests (Projects)
// Y = Crystals (Skills)
// M = Mailbox (Contact)
// X = Fireplace (Decoration)
const GRID_MAP = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWKKKKKWWWWWWWSSWWWWWWWWWWWWWWWW",
    "WWF..D.WWWWWWWSSWWWWWY...Y.WWWWW",
    "WWF....WW,,,,,SS,,,,......WWWWW",
    "WWF....FF,,,,BBBB,,,,,,......WWWWW",
    "WWFFF..FF,,,,BBBB,,,,,,..Y...WWWWW",
    "WWWWWWWWWW,,,,SS,,,,,,.....WWWWW",
    "WWWWWWWWWW,,,,SSWWWWWWWWWWWWWWWW",
    "WWWWWWWWWW,,,,SSWWWWWWWWWWWWWWWW",
    "WWWWWWWWWW,,,,SSWWWWWWWWWWWWWWWW",
    "WW,,,,,,,,,,,,SS,,,,,,,,,,,,,,WW",
    "WW,,,,,,,,,,,,SS,,,,,,,,,,,,,,WW",
    "WWWWWWWWWW,,,,SSWWWWWWWWWWWWWWWW",
    "WWWWWWWWWW,,,,SSWWWWWWWWWWWWWWWW",
    "WWWWWWWWWW,,,,SSWWWWWWWWWWWWWWWW",
    "WWCCCCCCWW,,,,SSWWWWWWWWWWWWWWWW",
    "WWF....WW,,,,,,SS,,,,,.....WWWWW",
    "WWF....FF,,,,,BBBB,,,,..M..WWWWW",
    "WWF....FF,,,,,BBBB,,,,.....WWWWW",
    "WWFFF..WW,,,,,,SS,,,,,.....WWWWW",
    "WWWWWWWWWWWWWWWWSSWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

// Interactive items position in world coordinates (tile index)
const INTERACTIVES = [
    { tileX: 5, tileY: 3, type: "desk", label: "Inspect Desk (About Me)", triggerId: "about" },
    { tileX: 2, tileY: 2, type: "bookshelf", label: "Browse Books (About Me)", triggerId: "about" },
    { tileX: 5, tileY: 2, type: "bookshelf", label: "Browse Books (About Me)", triggerId: "about" },

    // Chests (Projects, index 0 to 5 mapped to projects)
    { tileX: 2, tileY: 16, type: "chest", label: "Open Chest (CWE Security Analyzer)", projectIndex: 0, isOpen: false },
    { tileX: 3, tileY: 16, type: "chest", label: "Open Chest (Brain Tumor Detection)", projectIndex: 1, isOpen: false },
    { tileX: 4, tileY: 16, type: "chest", label: "Open Chest (AI Sustainable Groceries)", projectIndex: 2, isOpen: false },
    { tileX: 5, tileY: 16, type: "chest", label: "Open Chest (College Navigation)", projectIndex: 3, isOpen: false },
    { tileX: 6, tileY: 16, type: "chest", label: "Open Chest (Password Breach Checker)", projectIndex: 4, isOpen: false },
    { tileX: 7, tileY: 16, type: "chest", label: "Open Chest (Multi-threaded Port Scanner)", projectIndex: 5, isOpen: false },

    // Crystals (Skills)
    { tileX: 21, tileY: 3, type: "crystal", label: "Gaze at Crystal (Technical Skills)", triggerId: "skills" },
    { tileX: 25, tileY: 3, type: "crystal", label: "Gaze at Crystal (Technical Skills)", triggerId: "skills" },
    { tileX: 23, tileY: 6, type: "crystal", label: "Gaze at Crystal (Technical Skills)", triggerId: "skills" },

    // Mailbox (Contact)
    { tileX: 24, tileY: 18, type: "mailbox", label: "Check Mailbox (Contact & Socials)", triggerId: "contact" }
];

// Map grid index translations: check if coordinates block character
function checkCollision(tileX, tileY) {
    if (tileX < 0 || tileX >= MAP_COLS || tileY < 0 || tileY >= MAP_ROWS) return true;

    const tileSymbol = GRID_MAP[tileY][tileX];

    // Colliders symbols:
    // W = building wall, S = water, T = tree, E = fence
    if (tileSymbol === 'W' || tileSymbol === 'S' || tileSymbol === 'T' || tileSymbol === 'E') {
        return true;
    }

    // Also block movement onto interactive elements so players don't overlap them
    const hasInteractive = INTERACTIVES.some(item => item.tileX === tileX && item.tileY === tileY);
    if (hasInteractive) return true;

    return false;
}

// --- GAME STATE MANAGER ---
const game = {
    canvas: null,
    ctx: null,
    started: false,

    player: {
        x: 12 * TILE_SIZE, // Start in center paths
        y: 11 * TILE_SIZE,
        gridX: 12,
        gridY: 11,
        targetX: 12 * TILE_SIZE,
        targetY: 11 * TILE_SIZE,
        dir: "down",
        isMoving: false,
        speed: 3, // movement speed
        frame: 0,
        frameTimer: 0,
        classSelected: "mage",
        path: [] // Pathfinding list of coordinate nodes
    },

    camera: {
        x: 0,
        y: 0
    },

    keys: {},
    mouseDest: null,
    activeTrigger: null,
    animationFrameId: null,

    // Initialize all visual hooks
    init() {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");

        // Set dimensions
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());

        // Setup input bindings
        this.setupInputs();

        // Setup DOM event listeners
        this.setupDOMEvents();

        // Load project lists into UI pause inventory
        this.populateInventoryData();

        // Start screen click trigger
        this.setupStartScreen();
    },

    resizeCanvas() {
        // Keep 16:9 ratio
        let w = window.innerWidth;
        let h = window.innerHeight;

        // Scale canvas drawing buffer to retro resolution 800x450
        this.canvas.width = VIEW_WIDTH;
        this.canvas.height = VIEW_HEIGHT;

        // CSS display scaling
        const aspect = VIEW_WIDTH / VIEW_HEIGHT;
        if (w / h > aspect) {
            this.canvas.style.width = `${h * aspect}px`;
            this.canvas.style.height = `${h}px`;
        } else {
            this.canvas.style.width = `${w}px`;
            this.canvas.style.height = `${w / aspect}px`;
        }
    },

    setupInputs() {
        // Keyboard inputs
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // Tab or I open inventory
            if (e.key === "Tab" || e.key.toLowerCase() === "i") {
                e.preventDefault();
                if (this.started) {
                    this.toggleModal("modal-pause");
                }
            }

            // Space or E to interact
            if (e.key === " " || e.key.toLowerCase() === "e") {
                if (this.started && this.activeTrigger) {
                    e.preventDefault();
                    this.triggerInteraction(this.activeTrigger);
                }
            }
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Mouse clicks on canvas
        this.canvas.addEventListener("mousedown", (e) => {
            if (!this.started) return;
            soundFX.playSelect();

            // Calculate exact click inside logical canvas coordinate
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = VIEW_WIDTH / rect.width;
            const scaleY = VIEW_HEIGHT / rect.height;
            const canvasX = (e.clientX - rect.left) * scaleX;
            const canvasY = (e.clientY - rect.top) * scaleY;

            // Map relative coordinates to world coordinate
            const worldX = canvasX + this.camera.x;
            const worldY = canvasY + this.camera.y;

            const clickGridX = Math.floor(worldX / TILE_SIZE);
            const clickGridY = Math.floor(worldY / TILE_SIZE);

            // Compute shortest path via BFS pathfinding
            this.findPath(clickGridX, clickGridY);
        });
    },

    setupStartScreen() {
        const startBtn = document.getElementById("start-btn");
        const cards = document.querySelectorAll(".class-card");

        cards.forEach(card => {
            card.addEventListener("click", () => {
                soundFX.playSelect();
                cards.forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");
                this.player.classSelected = card.dataset.class;
            });
        });

        startBtn.addEventListener("click", () => {
            soundFX.playInteract();

            // Apply selected class details to HUD
            const classKey = this.player.classSelected;
            const classInfo = PORTFOLIO_DATA.player.classInfo[classKey];

            document.getElementById("hud-char-class").textContent = classInfo.className;
            document.getElementById("hud-char-portrait").style.backgroundImage = `url('assets/${classKey}_portrait.png')`;

            // Inventory portrait
            document.getElementById("inv-avatar").style.backgroundImage = `url('assets/${classKey}_portrait.png')`;
            document.getElementById("inv-level-label").textContent = `Level ${PORTFOLIO_DATA.player.level} ${classInfo.className}`;

            // Hide start screen, show HUD
            document.getElementById("start-screen").classList.add("hidden");
            document.getElementById("hud").classList.remove("hidden");

            this.started = true;
            this.runGameLoop();
        });
    },

    setupDOMEvents() {
        // Sound toggle button
        const soundBtn = document.getElementById("sound-btn");
        soundBtn.addEventListener("click", () => {
            const isMuted = soundFX.toggleMute();
            soundBtn.textContent = isMuted ? "🔇 Muted" : "🔊 Sound";
            soundFX.playSelect();
        });

        // Inventory toggle button
        const menuBtn = document.getElementById("hud-btn");
        document.getElementById("menu-btn").addEventListener("click", () => {
            soundFX.playInteract();
            this.toggleModal("modal-pause");
        });

        // Modal close buttons
        const closeBtns = document.querySelectorAll(".close-btn");
        closeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                soundFX.playClose();
                btn.closest(".modal").classList.add("hidden");
            });
        });

        // Click outside modal closes it
        const modals = document.querySelectorAll(".modal");
        modals.forEach(modal => {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    soundFX.playClose();
                    modal.classList.add("hidden");
                }
            });
        });

        // Skills tabs
        const skillTabs = document.querySelectorAll(".skill-tab-btn");
        skillTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                soundFX.playSelect();
                skillTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                this.renderSkills(tab.dataset.skillCat);
            });
        });

        // Inventory tabs
        const invTabs = document.querySelectorAll(".inv-tab-btn");
        invTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                soundFX.playSelect();
                invTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");

                const tabContents = document.querySelectorAll(".inv-tab-content");
                tabContents.forEach(c => c.classList.remove("active"));
                document.getElementById(`inv-tab-${tab.dataset.invTab}`).classList.add("active");
            });
        });

        // Contact pigeon form submit mock handler
        const form = document.getElementById("contact-form");
        const feedback = document.getElementById("form-feedback");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            soundFX.playInteract();

            feedback.classList.remove("hidden", "success", "error");
            feedback.textContent = "Casting communication spell...";
            feedback.classList.add("success");

            setTimeout(() => {
                feedback.textContent = "Courier pigeon successfully sent to Azzah!";
                form.reset();
            }, 1000);
        });
    },

    toggleModal(id) {
        const modal = document.getElementById(id);
        if (modal.classList.contains("hidden")) {
            // Close other modals
            document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
            modal.classList.remove("hidden");

            // If Skills Modal, trigger animation
            if (id === "modal-skills") {
                const activeTab = document.querySelector(".skill-tab-btn.active");
                this.renderSkills(activeTab.dataset.skillCat);
            }
        } else {
            modal.classList.add("hidden");
            soundFX.playClose();
        }
    },

    populateInventoryData() {
        // Bio summary
        document.getElementById("bio-summary-text").textContent = PORTFOLIO_DATA.about.summary;
        document.getElementById("bio-avatar").style.backgroundImage = `url('https://raw.githubusercontent.com/azzahzayn/portfolio-website/main/${this.player.classSelected}_portrait.png')`;

        // Education
        const eduContainer = document.getElementById("education-timeline-container");
        eduContainer.innerHTML = PORTFOLIO_DATA.about.education.map(edu => `
            <div class="education-node">
                <div class="edu-title">${edu.degree}</div>
                <div class="edu-degree">${edu.institution}</div>
                <div class="edu-period">${edu.period}</div>
                <div class="edu-details">${edu.details}</div>
            </div>
        `).join('');

        // Stats attributes
        const p = PORTFOLIO_DATA.player;
        document.getElementById("attr-str").textContent = p.stats.strength;
        document.getElementById("attr-agi").textContent = p.stats.agility;
        document.getElementById("attr-int").textContent = p.stats.intelligence;
        document.getElementById("attr-def").textContent = p.stats.defense;
        document.getElementById("attr-lck").textContent = p.stats.luck;

        // Equipments detail bindings
        document.getElementById("eq-weapon-name").textContent = p.equipment.weapon.name;
        document.getElementById("eq-weapon-desc").textContent = p.equipment.weapon.desc;

        document.getElementById("eq-shield-name").textContent = p.equipment.shield.name;
        document.getElementById("eq-shield-desc").textContent = p.equipment.shield.desc;

        document.getElementById("eq-armor-name").textContent = p.equipment.armor.name;
        document.getElementById("eq-armor-desc").textContent = p.equipment.armor.desc;

        document.getElementById("eq-acc-name").textContent = p.equipment.accessory.name;
        document.getElementById("eq-acc-desc").textContent = p.equipment.accessory.desc;

        // Inventory Projects items
        const itemsContainer = document.getElementById("inv-items-container");
        itemsContainer.innerHTML = PORTFOLIO_DATA.projects.map((proj, idx) => `
            <div class="item-row">
                <div class="item-left">
                    <div class="item-title">${proj.title}</div>
                    <div class="item-sub">${proj.category} • [${proj.rarity}]</div>
                </div>
                <div class="item-actions">
                    <button class="retro-btn" onclick="game.openProjectCard(${idx})">USE ITEM</button>
                </div>
            </div>
        `).join('');

        // Quest Logs completed internships
        const questsContainer = document.getElementById("inv-quests-container");
        questsContainer.innerHTML = PORTFOLIO_DATA.quests.map(q => `
            <div class="quest-row">
                <div class="quest-left">
                    <div class="item-title">${q.title}</div>
                    <div class="item-sub">${q.company} • ${q.period}</div>
                </div>
                <div class="quest-status">${q.status}</div>
            </div>
        `).join('');
    },

    openProjectCard(index) {
        soundFX.playInteract();
        const proj = PORTFOLIO_DATA.projects[index];

        document.getElementById("project-modal-title").textContent = "💎 ITEM SPECIFICATION";
        document.getElementById("proj-rarity").textContent = proj.rarity;

        // Rarity color class
        const rarityElem = document.getElementById("proj-rarity");
        rarityElem.className = "project-rarity";
        if (proj.rarity.includes("Legendary")) rarityElem.classList.add("rarity-legendary");
        else if (proj.rarity.includes("Epic")) rarityElem.classList.add("rarity-epic");
        else if (proj.rarity.includes("Rare")) rarityElem.classList.add("rarity-rare");
        else rarityElem.classList.add("rarity-common");

        document.getElementById("proj-title").textContent = proj.title;
        document.getElementById("proj-category").textContent = proj.category;
        document.getElementById("proj-desc").textContent = proj.desc;

        const techContainer = document.getElementById("proj-tech-container");
        techContainer.innerHTML = proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

        document.getElementById("proj-link").href = proj.questLink;

        // Toggle project details modal
        this.toggleModal("modal-projects");
    },

    renderSkills(category) {
        const skillsList = PORTFOLIO_DATA.skills[category];
        const listContainer = document.getElementById("skills-list");

        listContainer.innerHTML = skillsList.map(skill => `
            <div class="skill-row">
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-val-text">Lvl ${skill.value}</span>
                </div>
                <div class="skill-bar-container">
                    <div class="skill-bar-fill" id="skill-bar-${skill.name.replace(/[^a-zA-Z0-9]/g, '')}" style="width: 0%;"></div>
                </div>
            </div>
        `).join('');

        // Trigger animation fill width
        setTimeout(() => {
            skillsList.forEach(skill => {
                const bar = document.getElementById(`skill-bar-${skill.name.replace(/[^a-zA-Z0-9]/g, '')}`);
                if (bar) bar.style.width = `${skill.value}%`;
            });
        }, 50);
    },

    // --- BFS GRID PATHFINDER ---
    findPath(destX, destY) {
        // Don't find path if click target is collision
        if (checkCollision(destX, destY)) return;

        const startX = this.player.gridX;
        const startY = this.player.gridY;

        if (startX === destX && startY === destY) return;

        const queue = [[startX, startY]];
        const parent = {};
        const visited = new Set();
        visited.add(`${startX},${startY}`);

        let found = false;

        while (queue.length > 0) {
            const [cx, cy] = queue.shift();

            if (cx === destX && cy === destY) {
                found = true;
                break;
            }

            // 4 directional neighbours (no diagonals in retro grid RPGs!)
            const neighbors = [
                [cx, cy - 1], // Up
                [cx, cy + 1], // Down
                [cx - 1, cy], // Left
                [cx + 1, cy]  // Right
            ];

            for (const [nx, ny] of neighbors) {
                const key = `${nx},${ny}`;
                if (!visited.has(key) && !checkCollision(nx, ny)) {
                    visited.add(key);
                    parent[key] = [cx, cy];
                    queue.push([nx, ny]);
                }
            }
        }

        if (found) {
            // Reconstruct path
            const path = [];
            let curr = [destX, destY];
            while (curr[0] !== startX || curr[1] !== startY) {
                path.push(curr);
                curr = parent[`${curr[0]},${curr[1]}`];
            }
            // Path is in reverse order, reverse to walk in forward direction
            this.player.path = path.reverse();
        }
    },

    // Triggered on keyboard space/E or clicking nearby triggers
    triggerInteraction(trigger) {
        soundFX.playInteract();

        if (trigger.type === "chest") {
            // Open chest animation
            trigger.isOpen = true;
            soundFX.playChest();

            // Mark items in quest inventory completed if needed or just display details
            setTimeout(() => {
                this.openProjectCard(trigger.projectIndex);
            }, 400);
        } else {
            this.toggleModal(`modal-${trigger.triggerId}`);
        }
    },

    // --- GAME LOOP PROCESSOR ---
    runGameLoop() {
        const loop = () => {
            this.update();
            this.render();
            this.animationFrameId = requestAnimationFrame(loop);
        };
        this.animationFrameId = requestAnimationFrame(loop);
    },

    update() {
        const p = this.player;

        // Reset movement flags
        p.isMoving = false;

        // If pathfinding path is active
        if (p.path.length > 0) {
            const nextNode = p.path[0];
            const targetX = nextNode[0] * TILE_SIZE;
            const targetY = nextNode[1] * TILE_SIZE;

            // Move towards next node coordinate
            const dx = targetX - p.x;
            const dy = targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            p.isMoving = true;

            if (dist <= p.speed) {
                // Arrived at next path node grid position
                p.x = targetX;
                p.y = targetY;
                p.gridX = nextNode[0];
                p.gridY = nextNode[1];
                p.path.shift(); // remove node
            } else {
                // Step towards it
                p.x += (dx / dist) * p.speed;
                p.y += (dy / dist) * p.speed;

                // Set walking direction
                if (Math.abs(dx) > Math.abs(dy)) {
                    p.dir = dx > 0 ? "right" : "left";
                } else {
                    p.dir = dy > 0 ? "down" : "up";
                }
            }
        }
        // Keyboard movement overrides pathfinding
        else {
            let dx = 0;
            let dy = 0;

            if (this.keys["w"] || this.keys["arrowup"]) {
                dy = -1;
                p.dir = "up";
            } else if (this.keys["s"] || this.keys["arrowdown"]) {
                dy = 1;
                p.dir = "down";
            }

            if (this.keys["a"] || this.keys["arrowleft"]) {
                dx = -1;
                p.dir = "left";
            } else if (this.keys["d"] || this.keys["arrowright"]) {
                dx = 1;
                p.dir = "right";
            }

            if (dx !== 0 || dy !== 0) {
                p.isMoving = true;

                // Target step coordinate
                const speed = p.speed;
                const nextX = p.x + dx * speed;
                const nextY = p.y + dy * speed;

                // Simple sliding collision: check boundary bounding box of player (16x16 box inside tile)
                const margin = 6;
                const checkPoints = [
                    { x: nextX + margin, y: nextY + margin },
                    { x: nextX + TILE_SIZE - margin, y: nextY + margin },
                    { x: nextX + margin, y: nextY + TILE_SIZE - margin },
                    { x: nextX + TILE_SIZE - margin, y: nextY + TILE_SIZE - margin }
                ];

                let collides = false;
                for (const pt of checkPoints) {
                    const gx = Math.floor(pt.x / TILE_SIZE);
                    const gy = Math.floor(pt.y / TILE_SIZE);
                    if (checkCollision(gx, gy)) {
                        collides = true;
                        break;
                    }
                }

                if (!collides) {
                    p.x = nextX;
                    p.y = nextY;
                }

                p.gridX = Math.floor((p.x + TILE_SIZE / 2) / TILE_SIZE);
                p.gridY = Math.floor((p.y + TILE_SIZE / 2) / TILE_SIZE);
            }
        }

        // Animate walk frames
        if (p.isMoving) {
            p.frameTimer++;
            if (p.frameTimer % 10 === 0) {
                p.frame = (p.frame + 1) % 2; // Cycle walk frames
                soundFX.playWalk();
            }
        } else {
            p.frame = 0;
        }

        // Camera follow player (smooth clamping inside map boundaries)
        this.camera.x = p.x + TILE_SIZE / 2 - VIEW_WIDTH / 2;
        this.camera.y = p.y + TILE_SIZE / 2 - VIEW_HEIGHT / 2;

        const maxCamX = MAP_COLS * TILE_SIZE - VIEW_WIDTH;
        const maxCamY = MAP_ROWS * TILE_SIZE - VIEW_HEIGHT;

        this.camera.x = Math.max(0, Math.min(maxCamX, this.camera.x));
        this.camera.y = Math.max(0, Math.min(maxCamY, this.camera.y));

        // Interaction ranges check
        this.checkInteractions();
    },

    checkInteractions() {
        const p = this.player;
        let nearbyTrigger = null;

        // Loop triggers
        for (const trigger of INTERACTIVES) {
            const distTiles = Math.abs(p.gridX - trigger.tileX) + Math.abs(p.gridY - trigger.tileY);
            if (distTiles <= 1) {
                nearbyTrigger = trigger;
                break;
            }
        }

        // Update interaction HUD prompt
        const prompt = document.getElementById("interaction-prompt");
        if (nearbyTrigger) {
            this.activeTrigger = nearbyTrigger;
            prompt.querySelector(".prompt-text").textContent = nearbyTrigger.isOpen ? "Inspect Details" : nearbyTrigger.label;
            prompt.classList.remove("hidden");
        } else {
            this.activeTrigger = null;
            prompt.classList.add("hidden");
        }

        // Update active area indicator HUD
        const areaIndicator = document.getElementById("area-indicator");
        const px = p.gridX;
        const py = p.gridY;

        if (px >= 2 && px <= 9 && py >= 2 && py <= 7) {
            areaIndicator.textContent = "Cozy Tavern (Bio)";
        } else if (px >= 2 && px <= 9 && py >= 15 && py <= 21) {
            areaIndicator.textContent = "Treasure Vault (Projects)";
        } else if (px >= 21 && px <= 30 && py >= 2 && py <= 8) {
            areaIndicator.textContent = "Mystic Grove (Skills)";
        } else if (px >= 21 && px <= 30 && py >= 15 && py <= 21) {
            areaIndicator.textContent = "Post Office (Contact)";
        } else {
            areaIndicator.textContent = "Village Paths";
        }
    },

    // --- GAME CANVAS RENDERING ---
    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

        ctx.save();
        // Translate drawing context for camera movement offset
        ctx.translate(-this.camera.x, -this.camera.y);

        // 1. Draw Grid Tilemap Grass & Dirt paths
        for (let r = 0; r < MAP_ROWS; r++) {
            for (let c = 0; c < MAP_COLS; c++) {
                const sym = GRID_MAP[r][c];
                const tx = c * TILE_SIZE;
                const ty = r * TILE_SIZE;

                if (sym === 'W') {
                    // Wall border or building exterior
                    ctx.fillStyle = "#140d0a";
                    ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = "#22140d";
                    ctx.fillRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
                } else if (sym === 'F') {
                    // Tavern Indoor Wood floor
                    ctx.fillStyle = "#4a2d1f";
                    ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = "#764b35";
                    ctx.fillRect(tx + 1, ty + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                } else if (sym === 'S') {
                    // Blue animated flowing river water
                    const cycle = Math.sin(Date.now() / 200 + c) * 2;
                    ctx.fillStyle = "#1e272e";
                    ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = cycle > 0 ? "#1b9cfc" : "#25a2fc";
                    ctx.fillRect(tx + 1, ty + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                } else if (sym === 'B') {
                    // River Wooden Bridge Planks
                    ctx.fillStyle = "#4a301f";
                    ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = "#8c5d3f";
                    ctx.fillRect(tx + 2, ty, TILE_SIZE - 4, TILE_SIZE);
                } else if (sym === ',') {
                    // Winding Dirt Road paths
                    ctx.fillStyle = "#a87255";
                    ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
                    // Add subtle road details
                    ctx.fillStyle = "#8c5d3f";
                    if ((c + r) % 3 === 0) ctx.fillRect(tx + 8, ty + 12, 4, 4);
                    if ((c - r) % 5 === 0) ctx.fillRect(tx + 22, ty + 18, 3, 3);
                } else {
                    // Default Grass
                    ctx.fillStyle = "#1e381e";
                    ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
                    ctx.fillStyle = "#2e592e";
                    ctx.fillRect(tx + 1, ty + 1, TILE_SIZE - 2, TILE_SIZE - 2);
                    // Add grass blades pixels
                    ctx.fillStyle = "#4c8c4c";
                    if ((c * r) % 4 === 0) {
                        ctx.fillRect(tx + 6, ty + 10, 2, 4);
                        ctx.fillRect(tx + 20, ty + 24, 2, 4);
                    }
                }
            }
        }

        // 2. Draw Trees along borders
        for (let r = 0; r < MAP_ROWS; r++) {
            for (let c = 0; c < MAP_COLS; c++) {
                const sym = GRID_MAP[r][c];
                if (sym === 'W') {
                    // Draw outer border trees decoration where appropriate
                    if ((r === 1 || r === MAP_ROWS - 2) && c % 4 === 0) {
                        this.drawSprite(ctx, c * TILE_SIZE, (r - 1) * TILE_SIZE, SPRITES.tree, SPRITE_COLORS.tree);
                    }
                }
            }
        }

        // 3. Draw Building Walls and interiors (Tavern / Vault)
        // Draw fireplace in tavern
        this.drawSprite(ctx, 4 * TILE_SIZE, 1 * TILE_SIZE, SPRITES.fireplace, SPRITE_COLORS.fireplace);

        // Draw bookshelves in tavern
        this.drawSprite(ctx, 2 * TILE_SIZE, 2 * TILE_SIZE, SPRITES.bookshelf, SPRITE_COLORS.bookshelf);
        this.drawSprite(ctx, 5 * TILE_SIZE, 2 * TILE_SIZE, SPRITES.bookshelf, SPRITE_COLORS.bookshelf);

        // Draw desk in tavern
        this.drawSprite(ctx, 5 * TILE_SIZE, 3 * TILE_SIZE, SPRITES.chest_closed, SPRITE_COLORS.chest_closed); // Mock desk object

        // 4. Draw Interactive Objects
        for (const trigger of INTERACTIVES) {
            const tx = trigger.tileX * TILE_SIZE;
            const ty = trigger.tileY * TILE_SIZE;

            if (trigger.type === "chest") {
                const sprite = trigger.isOpen ? SPRITES.chest_open : SPRITES.chest_closed;
                const colors = trigger.isOpen ? SPRITE_COLORS.chest_open : SPRITE_COLORS.chest_closed;
                this.drawSprite(ctx, tx, ty, sprite, colors);
            }
            else if (trigger.type === "crystal") {
                this.drawSprite(ctx, tx, ty, SPRITES.crystal, SPRITE_COLORS.crystal);
            }
            else if (trigger.type === "mailbox") {
                this.drawSprite(ctx, tx, ty, SPRITES.mailbox, SPRITE_COLORS.mailbox);
            }
        }

        // 5. Draw Player Character
        const p = this.player;
        const playerSpriteName = `${p.classSelected}_${p.dir}`;
        const playerSprite = SPRITES[playerSpriteName] || SPRITES[`${p.classSelected}_down`];
        const playerColors = SPRITE_COLORS[p.classSelected];
        this.drawSprite(ctx, p.x, p.y, playerSprite, playerColors);

        ctx.restore();
    },

    // Helper method to draw a retro sprite matrix
    drawSprite(ctx, px, py, spriteMatrix, colors) {
        const scale = 2; // 16x16 sprite scaled by 2 fits 32x32 tiles
        for (let r = 0; r < 16; r++) {
            for (let c = 0; c < 16; c++) {
                const char = spriteMatrix[r][c];
                if (char !== '.' && colors[char]) {
                    ctx.fillStyle = colors[char];
                    ctx.fillRect(px + c * scale, py + r * scale, scale, scale);
                }
            }
        }
    }
};

// --- INITIALIZE GAME ON LOAD ---
window.addEventListener("DOMContentLoaded", () => {
    game.init();
});
