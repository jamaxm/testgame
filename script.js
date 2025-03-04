document.addEventListener("DOMContentLoaded", () => {
    const Telegram = window.Telegram.WebApp;
    Telegram.expand();

    const gameBoard = document.getElementById("game-board");
    const restartButton = document.getElementById("restart");
    const timerDisplay = document.getElementById("timer");
    const movesDisplay = document.getElementById("moves");
    const levelDisplay = document.getElementById("level-info");

    const allEmojis = ["🍎", "🍌", "🍇", "🍓", "🥝", "🍊", "🍍", "🥑", "🍉", "🥥", "🍋", "🍒", "🍔", "🍕", "🥗", "🍩", "🍫", "🧀", "🍪", "🥦"];
    let emojis, cards;
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timeLeft;
    let timer;
    let level = 1;

    function startTimer() {
        clearInterval(timer);
        timeLeft = Math.max(20, 60 - level * 2);
        timerDisplay.textContent = `⏳ ${timeLeft}s`;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `⏳ ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                Telegram.showAlert("⏳ Время вышло! Попробуйте снова.");
                resetGame();
            }
        }, 1000);
    }

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        gameBoard.innerHTML = "";
        matchedPairs = 0;
        flippedCards = [];
        moves = 0;
        movesDisplay.textContent = `🔄 ${moves}`;
        levelDisplay.textContent = `Уровень: ${level}`;

        let difficulty = Math.min(4 + Math.floor(level / 2), 6);
        emojis = allEmojis.slice(0, difficulty);
        cards = shuffle([...emojis, ...emojis]);
        gameBoard.style.gridTemplateColumns = `repeat(${difficulty >= 10 ? 5 : 4}, 1fr)`;

        cards.forEach((emoji, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.addEventListener("click", flipCard);
            gameBoard.appendChild(card);
        });

        startTimer();
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
            this.textContent = this.dataset.emoji;
            this.classList.add("flipped");
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                moves++;
                movesDisplay.textContent = `🔄 ${moves}`;
                setTimeout(checkMatch, 1000);
            }
        }
    }

    function checkMatch() {
        if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
            matchedPairs++;
            flippedCards = [];

            if (matchedPairs === cards.length / 2) {
                clearInterval(timer);
                if (level < 20) {
                    Telegram.showAlert(`🎉 Уровень ${level} пройден!`);
                    level++;
                    setTimeout(createBoard, 1500);
                } else {
                    Telegram.showAlert("🏆 Вы прошли все 20 уровней! Поздравляем!");
                }
            }
        } else {
            flippedCards.forEach(card => {
                card.textContent = "";
                card.classList.remove("flipped");
            });
            flippedCards = [];
        }
    }

    function resetGame() {
        level = 1;
        createBoard();
    }

    restartButton.addEventListener("click", resetGame);

    createBoard();
});
