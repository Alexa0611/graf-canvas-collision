const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Ball {
    constructor(x, y, radius, speedX, speedY, color = 'white') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
        this.originalColor = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        
        // Dibujar carita feliz
        ctx.fillStyle = 'black';
        // Ojos
        ctx.beginPath();
        ctx.arc(this.x - this.radius / 3, this.y - this.radius / 3, this.radius / 6, 0, Math.PI * 2);
        ctx.arc(this.x + this.radius / 3, this.y - this.radius / 3, this.radius / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        
        // Boca
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius / 2.5, 0, Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
            this.speedX = -this.speedX;
        }
    }
    detectCollision(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + other.radius;
    }
    handleCollision(other) {
        const tempSpeedX = this.speedX;
        const tempSpeedY = this.speedY;
        this.speedX = other.speedX;
        this.speedY = other.speedY;
        other.speedX = tempSpeedX;
        other.speedY = tempSpeedY;

        this.color = '#0000FF';
        other.color = '#0000FF';
        setTimeout(() => {
            this.color = this.originalColor;
            other.color = other.originalColor;
        }, 100);
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        this.balls = [];
        for (let i = 0; i < 10; i++) {
            this.balls.push(new Ball(
                Math.random() * (canvas.width - 80) + 40,
                Math.random() * (canvas.height - 80) + 40,
                30,
                (Math.random() * 4 + 1) * (Math.random() > 0.5 ? 1 : -1),
                (Math.random() * 4 + 1) * (Math.random() > 0.5 ? 1 : -1),
                `hsl(${Math.random() * 360}, 100%, 50%)`
            ));
        }
    }
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.balls.forEach(ball => ball.draw());
    }
    update() {
        this.balls.forEach(ball => {
            ball.move();
        });
        for (let i = 0; i < this.balls.length; i++) {
            for (let j = i + 1; j < this.balls.length; j++) {
                if (this.balls[i].detectCollision(this.balls[j])) {
                    this.balls[i].handleCollision(this.balls[j]);
                }
            }
        }
    }
    run() {
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();