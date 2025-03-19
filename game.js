// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedY, color = 'white') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedY = speedY;
        this.color = color;
        this.originalColor = color;
        this.isVisible = true;
    }

    draw() {
        if (this.isVisible) {
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
    }

    move() {
        if (this.isVisible) {
            this.y += this.speedY;

            // Reiniciar círculo cuando llega al fondo
            if (this.y - this.radius > canvas.height) {
                this.y = -this.radius;
                this.x = Math.random() * (canvas.width - 80) + 40;
                this.isVisible = true;
            }
        }
    }

    isClicked(mouseX, mouseY) {
        const dist = Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2);
        return dist <= this.radius;
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        this.balls = [];
        this.deletedBallsCount = 0;
        this.initialBallsCount = 10;

        for (let i = 0; i < this.initialBallsCount; i++) {
            this.addBall();
        }

        // Escuchar eventos tanto para mouse como para toque
        canvas.addEventListener('click', (event) => this.handleClick(event)); // Mouse
        canvas.addEventListener('touchstart', (event) => this.handleTouch(event)); // Touch
    }

    addBall() {
        const radius = Math.random() * 20 + 20; // Tamaño aleatorio entre 20 y 40
        this.balls.push(new Ball(
            Math.random() * (canvas.width - 80) + 40,
            Math.random() * (canvas.height - 80) + 40,
            radius,
            Math.random() * 4 + 1,
            `hsl(${Math.random() * 360}, 100%, 50%)`
        ));
    }

    handleClick(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        this.checkBallClick(mouseX, mouseY);
    }

    handleTouch(event) {
        const rect = canvas.getBoundingClientRect();
        const touchX = event.touches[0].clientX - rect.left;
        const touchY = event.touches[0].clientY - rect.top;

        this.checkBallClick(touchX, touchY);
        event.preventDefault(); // Para evitar el comportamiento predeterminado del toque
    }

    checkBallClick(mouseX, mouseY) {
        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            if (ball.isVisible && ball.isClicked(mouseX, mouseY)) {
                ball.isVisible = false;
                this.deletedBallsCount++;
                this.replaceBall(i);
                break;
            }
        }
    }

    replaceBall(index) {
        const radius = Math.random() * 20 + 20; // Nuevo tamaño aleatorio
        this.balls[index] = new Ball(
            Math.random() * (canvas.width - 80) + 40,
            -radius,
            radius,
            Math.random() * 4 + 1,
            `hsl(${Math.random() * 360}, 100%, 50%)`
        );
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.balls.forEach(ball => ball.draw());

        // Mostrar contador de círculos eliminados
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Círculos eliminados: ${this.deletedBallsCount}`, canvas.width - 250, 30);
    }

    update() {
        this.balls.forEach(ball => {
            ball.move();
        });
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
