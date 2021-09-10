// Display Constants
let W = window.innerWidth;
let H = window.innerHeight;
let FR;
let LOOP = 0;

// Particle
let P;
let N = 4000;
let AREA = 0.2;
let R;
let COLLISION_CIRCLE = 0;
let arr = [];

// Quad-Tree 
let Q = 0;
let CAPACITY;
let TREE = 0;

// Sound
let SOUND = 0;
let A = 0.1;
let S = 0.7;
let DC = 1;
let RL = 0;

// Reset 
let RESET = 0;

function setup() {
    createCanvas(W, H);
    background(0);
    set_values();

    for (let i = 0; i < N; i++) {
        arr[i] = new Particle(random(W), random(H), R, i);
    }
}

function set_values() {
    R = Math.floor(Math.sqrt((AREA * W * H) / (N * Math.PI)));
    let D = Math.sqrt(Math.pow(W, 2)+Math.pow(H, 2));
    MAX_DEPTH = Math.floor((Math.log(D)-Math.log(R))/(Math.log(2))-2);
    CAPACITY = Math.ceil(0.01 * N)+1;
    P = random(0, 2 * Math.PI);
    return;
}

function keyPressed() {
    if (keyCode === 32) {
        if (LOOP === 0) {
            noLoop();
            LOOP = 1;
        } else {
            loop();
            LOOP = 0;
        }
    } else if (keyCode === 67) {
        if (COLLISION_CIRCLE === 0) {
            COLLISION_CIRCLE = 1;
        } else {
            COLLISION_CIRCLE = 0;
        }
    } else if (keyCode === 83) {
        if (SOUND === 0) {
            SOUND = 1;
        } else {
            SOUND = 0;
        }
    } else if (keyCode === 84) {
        if (TREE === 0) {
            TREE = 1;
        } else {
            TREE = 0;
        }
    } else if (keyCode === 82) {
        setup();
    }
}

function draw() {
    background(0);
    if (frameCount % 30 === 0) {
        FR = round(frameRate());
    }

    Q = new QTree(0, 0, W, H, 0, []);
    for (let i = 0; i < arr.length; i++) {
        Q.insert(arr[i]);
        arr[i].show();
        arr[i].update();
        arr[i].move();
    }
    Q.check_col();
    Q.show();

    colorMode(RGB, 255, 255, 255);
    fill(255);
    textSize(20);
    text(FR, 15, 30);
}