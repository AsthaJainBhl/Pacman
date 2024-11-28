const width = 28;  // Number of columns
const grid = document.querySelector('.grid');
let squares = [];
const scoreDisplay = document.querySelector('.score');
let score = 0;
let pacmanIndex = 490;  // Default starting position of Pacman
let gameOver = false;  // Flag to check if the game is over

// Default grid layout setup (for simplicity, you can enhance this later)
const layout = Array(width * width).fill(4);  // Start with empty space (4)

// Adding some pac-dots and walls (random example)
for (let i = 0; i < layout.length; i++) {
    if (Math.random() > 0.8) layout[i] = 1;  // Wall
    else if (Math.random() > 0.7) layout[i] = 0;  // Pac-dot
    else if (Math.random() > 0.9) layout[i] = 3;  // Power-pellet
}

// Starting position of Pacman (center position in the grid)
layout[pacmanIndex] = 0;  // Pacman starts on a pac-dot

// Dot style variable to toggle between 'dot' and 'dash'
let dotStyle = "dot";  // Default to 'dot' style

// Get the select element for dot style
const dotStyleSelect = document.getElementById('dotStyle');
dotStyleSelect.addEventListener('change', (event) => {
    dotStyle = event.target.value;  // Update dot style based on user selection
    createBoard();  // Regenerate the board with the selected dot style
});

// Create the board/grid
function createBoard() {
    grid.innerHTML = '';  // Clear the grid
    squares = [];  // Reset squares array

    // Create grid squares based on layout
    for (let i = 0; i < layout.length; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);

        // Apply styles based on layout values
        switch (layout[i]) {
            case 0:
                if (dotStyle === "dot") {
                    squares[i].classList.add('pac-dot');  // Small dot style
                } else {
                    squares[i].classList.add('pac-dot-dash');  // Dash style
                }
                break;
            case 1:
                squares[i].classList.add('wall');
                break;
            case 3:
                squares[i].classList.add('power-pallet');
                break;
            default:
                break;
        }
    }

    // Ensure Pacman is placed at the starting position
    if (pacmanIndex >= 0 && pacmanIndex < squares.length) {
        squares[pacmanIndex].classList.add('pacman');
    }

    console.log('Grid Created:', squares);
}

createBoard();

// Ghost class with logic for scared state
class Ghost {
  constructor(startIndex, speed) {
    this.startIndex = startIndex;
    this.speed = speed;
    this.currentIndex = startIndex;
    this.isScared = false;  // Default state is not scared
    this.timerId = NaN;
    this.emoji = '👿';  // All ghosts will use the same emoji
  }
}

// Initialize ghosts with the same emoji
const ghosts = [
  new Ghost(348, 250),  // Red ghost
  new Ghost(376, 400),   // Pink ghost
  new Ghost(351, 300),    // Blue ghost
  new Ghost(379, 500)    // Yellow ghost
];

// Add ghosts to the grid and move them
ghosts.forEach(ghost => {
  squares[ghost.currentIndex].textContent = ghost.emoji; // Set the emoji in the ghost position
  squares[ghost.currentIndex].classList.add('ghost'); // Mark ghost position
  moveGhost(ghost); // Start moving the ghost
});

// Ghost movement logic
function moveGhost(ghost) {
  const directions = [-1, 1, -width, width]; // Left, Right, Up, Down
  let direction = directions[Math.floor(Math.random() * directions.length)];

  ghost.timerId = setInterval(function () {
    if (
      !squares[ghost.currentIndex + direction].classList.contains('wall') &&
      !squares[ghost.currentIndex + direction].classList.contains('ghost')
    ) {
      // Move ghost
      squares[ghost.currentIndex].textContent = ''; // Clear old ghost position
      squares[ghost.currentIndex].classList.remove('ghost');
      ghost.currentIndex += direction;
      squares[ghost.currentIndex].textContent = ghost.emoji;  // Set the emoji for the new position
      squares[ghost.currentIndex].classList.add('ghost');
    } else {
      direction = directions[Math.floor(Math.random() * directions.length)]; // Change direction if blocked
    }

    // Check for collision between Pacman and ghosts
    if (squares[ghost.currentIndex].classList.contains('pacman')) {
      endGame();
    }
  }, ghost.speed);
}

// Handle movement and control (example with arrow keys)
function control(e) {
  if (gameOver) return;  // Prevent movement after game over

  squares[pacmanIndex].classList.remove('pacman');  // Remove Pacman from current position

  switch (e.keyCode) {
    case 37: // Left arrow key
      if (pacmanIndex % width !== 0 && !squares[pacmanIndex - 1].classList.contains('wall')) {
        pacmanIndex -= 1;  // Move left
      }
      break;
    case 38: // Up arrow key
      if (pacmanIndex - width >= 0 && !squares[pacmanIndex - width].classList.contains('wall')) {
        pacmanIndex -= width;  // Move up
      }
      break;
    case 39: // Right arrow key
      if (pacmanIndex % width !== width - 1 && !squares[pacmanIndex + 1].classList.contains('wall')) {
        pacmanIndex += 1;  // Move right
      }
      break;
    case 40: // Down arrow key
      if (pacmanIndex + width < squares.length && !squares[pacmanIndex + width].classList.contains('wall')) {
        pacmanIndex += width;  // Move down
      }
      break;
  }

  // Update Pacman's position
  if (pacmanIndex >= 0 && pacmanIndex < squares.length) {
    squares[pacmanIndex].classList.add('pacman');
  }

  // Handle Pacman eating pac-dots and power pellets
  pacDotEating();
  pacPowerPalletEating();
}

document.addEventListener('keyup', control);

// Logic to handle Pacman eating pac-dots
function pacDotEating() {
  if (squares[pacmanIndex].classList.contains('pac-dot')) {
    squares[pacmanIndex].classList.remove('pac-dot');  // Remove pac-dot
    score++;
    scoreDisplay.innerHTML = score;
  }
}

// Logic to handle Pacman eating power-pellets
function pacPowerPalletEating() {
  if (squares[pacmanIndex].classList.contains('power-pallet')) {
    squares[pacmanIndex].classList.remove('power-pallet');  // Remove power pellet
    score += 10;
    scoreDisplay.innerHTML = score;

    // Logic to turn ghosts to scared mode (if applicable)
    ghosts.forEach(ghost => ghost.isScared = true);
  }
}

// End the game
function endGame() {
  gameOver = true;  // Set the game over flag
  alert("Game Over!");  // Show a simple game over alert
  clearInterval(ghosts[0].timerId);  // Stop ghost movement
  document.removeEventListener('keyup', control);  // Stop Pacman control
}
