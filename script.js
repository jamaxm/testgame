document.addEventListener("DOMContentLoaded", () => {
    const Telegram = window.Telegram.WebApp;
    Telegram.ready();
    Telegram.WebApp.setHeaderColor("secondary_bg_color");
    Telegram.WebApp.expand();

    const gameBoard = document.getElementById("game-board");
    const restartButton = document.getElementById("restart");
    const timerDisplay = document.getElementById("timer");
    const movesDisplay = document.getElementById("moves");
    const difficultySelect = document.getElementById("difficulty");

    let emojis = ["🍎", "🍌", "🍇", "🍓", "🥝", "🍊", "🍍", "🥑"];
    let cards = [];
    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;
    let timer;
    let timeLeft = 60;

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        clearInterval(timer);
        timeLeft = 60;
        timerDisplay.textContent = `Время: ${timeLeft}s`;
        moves = 0;
        movesDisplay.textContent = `Ходы: ${moves}`;
        matchedCards = [];
        flippedCards = [];

        const difficulty = parseInt(difficultySelect.value);
        cards = shuffle([...emojis.slice(0, difficulty), ...emojis.slice(0, difficulty)]);

        gameBoard.innerHTML = "";
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
                movesDisplay.textContent = `Ходы: ${moves}`;
                setTimeout(checkMatch, 800);
            }
        }
    }

    function checkMatch() {
        if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
            matchedCards.push(...flippedCards);
            if (matchedCards.length === cards.length) {
                clearInterval(timer);
                Telegram.WebApp.showAlert(`Поздравляем! Вы выиграли за ${moves} ходов! 🎉`);
            }
        } else {
            flippedCards.forEach(card => {
                card.textContent = "";
                card.classList.remove("flipped");
            });
        }
        flippedCards = [];
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Время: ${timeLeft}s`;
            if (timeLeft === 0) {
                clearInterval(timer);
                Telegram.WebApp.showAlert("Время вышло! 😢 Попробуйте снова.");
                createBoard();
            }
        }, 1000);
    }

    restartButton.addEventListener("click", createBoard);
    difficultySelect.addEventListener("change", createBoard);

    createBoard();
});
