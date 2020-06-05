// Select canvas
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

// create user paddle
const user = {
    x: 0,
    y: cvs.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "white",
    score: 0
};

// create com paddle
const com = {
    x: cvs.width - 10,
    y: cvs.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "white",
    score: 0
};

// create ball
const ball = {
    x: cvs.width/2,
    y: cvs.height/2,
    radius: 10,
    spped: 5,
    velocityX: 5,
    velocityY: 5,
    color: "white"
}

// Draw rect function
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

drawRect(0, 0, cvs.width, cvs.height, "black");

// create the net
const net = {
    x: cvs.width/2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
}

// draw net
function drawNet() {
    for(let i = 0; i <= cvs.height; i+=15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw circle
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

drawCircle(100, 100, 50, "White");

// draw Text
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

drawText("something", 300, 200, "white");

// render the game
function render() {
    // clear canvas
    drawRect(0, 0, cvs.width, cvs.height, "black");

    // draw the net
    drawNet();

    // drawScore
    drawText(user.score, cvs.width/4, cvs.height/5, "white");
    drawText(com.score, 3*cvs.width/4, cvs.height/5, "white");

    // draw Paddles of user and computer
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// control the user paddle
cvs.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = cvs.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}

// collision detection
function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// reset Ball 
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// update : pos, move, score,...
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // simple AI to control the computer paddle
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < cvs.width/2) ? user : com;

    if(collision(ball, player)) {
        // where ball hit the player
        let collidePoint = ball.y - (player.y + player.height/2);

        // normalization
        collidePoint = collidePoint/(player.height/2);

        // calculate angle in radian
        let angleRad = collidPoint * Math.PI/4;

        // X direction of the ball when its hit
        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        // change vel x and y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // everytime ball hit paddle we increase its speed
        ball.speed += 0.5; 
    }

    // update score
    if(ball.x - ball.radius < 0) {
        // the com wins
        com.score++;
        resetBall();
    } else if(ball.x + ball.radius > cvs.width) {
        // the user wins
        user.score++;
        resetBall();
    }
}

// game init
function game(){
    update();
    render();
}

// loop
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);