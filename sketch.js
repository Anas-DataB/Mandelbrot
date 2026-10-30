const r = require("raylib");

function running() {
    return !r.WindowShouldClose();
}

function setup() {
    const WIDTH = 800;
    const HEIGHT = 400;
    const title = "Mandelbrot";
    const fps = 60;

    r.SetConfigFlags(r.FLAG_WINDOW_HIGHDPI);
    r.SetTraceLogLevel(r.LOG_NONE);
    r.InitWindow(WIDTH, HEIGHT, title);
    r.SetTargetFPS(fps);

    const window = { width: WIDTH, height: WIDTH };

    const origin = {
        x: WIDTH / 2,
        y: HEIGHT / 2,
    };
    const scale = 0.01;
    const world = { window, origin, scale };


    return world;
}

function multiplyComplex(complexA, complexB) {
    return {
        r: complexA.r * complexB.r - complexA.i * complexB.i,
        i: complexA.r * complexB.i + complexA.i * complexB.r
    };
}

function toComplex(x, y) {
    return { r: x, i: y, };
}

function addComplex(a, b,) {
    return {
        r: a.r + b.r,
        i: a.i + b.i
    };
}

function isInMandelbrot(x, y) {

    let z = toComplex(0, 0);
    let c = toComplex(x, y);

    for (let k = 0; k < 20; k++) {

        z = addComplex(multiplyComplex(z, z), c);

        if (z.r * z.r + z.i * z.i > 4) {
            return false;
        }
    }

    return true;
}


function update(world) {
}

function drawMandelbrot(window, scale, origin) {
    const endX = window.width;
    const endY = window.height;

    for (let startX = 0; startX < endX; startX++) {
        for (let startY = 0; startY < endY; startY++) {
            const x = startX - origin.x;
            const y = startY - origin.y;

            if (isInMandelbrot(x * scale, y * scale))
                r.DrawPixel(startX, startY, r.BLACK);
        }
    }
}

function detectZoom(world) {
    const wheel = r.GetMouseWheelMove();
    if (wheel === 0) return;

    const mouse = {
        x: r.GetMouseX(),
        y: r.GetMouseY(),
    };

    const oldScale = world.scale;
    const zoomFactor = Math.pow(1.1, wheel);
    const maxZoomFactor = 0.0000000000001;
    const newScale = Math.max(maxZoomFactor, oldScale / zoomFactor);

    const scaleRatio = oldScale / newScale;

    world.origin = {
        x: mouse.x - (mouse.x - world.origin.x) * scaleRatio,
        y: mouse.y - (mouse.y - world.origin.y) * scaleRatio,
    };

    world.scale = newScale;
}



function draw(world) {
    const { window, origin, scale } = world;
    r.BeginDrawing();
    r.ClearBackground(r.BLUE);
    drawMandelbrot(window, scale, origin);
    detectZoom(world);
    r.EndDrawing();
}


function teardown() {
    r.CloseWindow();
}

module.exports = {
    running,
    setup,
    update,
    draw,
    teardown,
};