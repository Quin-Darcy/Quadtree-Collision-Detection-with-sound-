// Display Constants
let W = window.innerWidth;
let H = window.innerHeight;
let FR;

// Particle
let P;
let R = 1;
let N = 1000;
let arr = [];

// Quad-Tree 
let Q = 0;
let CAPACITY = 2;

let osc;
let C = 0;

function setup() {
    createCanvas(W, H);
    background(0);
    let D = Math.sqrt(Math.pow(W, 2)+Math.pow(H, 2));
    MAX_DEPTH = Math.ceil((Math.log(D)-Math.log(R))/Math.log(2));
    P = random(0, 2 * Math.PI);

    for (let i = 0; i < N; i++) {
        arr[i] = new Particle(random(W), random(H), R, i);
    }
}

function mouseClicked() {
    C = 1;
}

function doubleClicked() {
    noLoop();
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