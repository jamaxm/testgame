document.addEventListener("DOMContentLoaded", () => {
    const Telegram = window.Telegram.WebApp;
    Telegram.ready();
    
    const gameBoard = document.getElementById("game-board");
    const restartButton = document.getElementById("restart");

    const emojis = ["🍎", "🍌", "🍇", "🍓", "🥝", "🍊", "🍍", "🥑"];
    let cards = [...emojis, ...emojis];
    let flippedCards = [];
    let matchedCards = [];

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        gameBoard.innerHTML = "";
        shuffledCards = shuffle(cards);
        shuffledCards.forEach((emoji, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.addEventListener("click", flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
            this.textContent = this.dataset.emoji;
            this.classList.add("flipped");
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
        }
    }

    function checkMatch() {
        if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
            matchedCards.push(...flippedCards);
            if (matchedCards.length === cards.length) {
                Telegram.showAlert("You win!");
            }
        } else {
            flippedCards.forEach(card => {
                card.textContent = "";
                card.classList.remove("flipped");
            });
        }
        flippedCards = [];
    }

    restartButton.addEventListener("click", () => {
        matchedCards = [];
        flippedCards = [];
        createBoard();
    });

    createBoard();
});
