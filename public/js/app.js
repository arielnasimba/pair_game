let grid_container = document.querySelector(".grid_container");
let cards = [];
let first_card, second_card;
let lock_board = false;
let score = 0;

document.querySelector(".score").textContent = score;
/**fetch consist to get all cards inside json file */
fetch("./public/data/cards.json")
    .then((res) => res.json())
    .then((data) => {
        cards = [...data, ...data];
        shuffleCards();
        generateCards();
    });

/** shuffle cards**/
function shuffleCards() {
    
    let current_index = cards.length,
    random_index, temporary_value;
    while( current_index !== 0){
        random_index = Math.floor( Math.random() * current_index);
        current_index -= 1;
        temporary_value = cards[current_index];
        cards[current_index] = cards[random_index];
        cards[random_index] = temporary_value;
    }
}

/**Generate card template */
function generateCards(){
    for (let card of cards) {
        let card_element = document.createElement("div");
        card_element.classList.add("card");
        card_element.setAttribute("data-name", card.name);
        card_element.innerHTML = `
            <div class="front">
                <img class="front-image" src=${card.image} />
            </div>
            <div class="back"></div>
        `;
        grid_container.appendChild(card_element);
        // when click on card it will be flipped 
        card_element.addEventListener("click", flipCard);
    }
}

/** Flip card */
function flipCard() {
    //return  if board is unlocked to flip
    if (lock_board) return;
    //return if when you click again to the same card
    if (this === first_card) return 
    
    this.classList.add("flipped");

    // return if isn't the first card so the current card is this
    if (!first_card) {
        first_card = this;
        return;
    }

    second_card = this;
    // score++;
    // document.querySelector(".score").textContent = score;
    lock_board = true;

    checForMatch();
}

function checForMatch() {
    let is_match = first_card.dataset.name === second_card.dataset.name;

    // is_match ? disableCards() : unflipCards();

    if (is_match) {
        disableCards();
        score++;
        document.querySelector(".score").textContent = score;
        if (document.querySelectorAll(".card.flipped").length === cards.length) {
            setTimeout(() => {
                alert("Congratulations! You found all the matches!");
                restart();
            }, 1000);
        }
    } else {
        unflipCards();
    }
}

/* disable card */
function disableCards() {
    // how ? removing their eventListener
    first_card.removeEventListener("click", flipCard);
    second_card.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards() {
    setTimeout( () =>{
        first_card.classList.remove("flipped");
        second_card.classList.remove("flipped");
        resetBoard();
    }, 1000 );
}

function resetBoard() {

    first_card = null;
    second_card = null;
    lock_board = false;
}

function restart() {
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    grid_container.innerHTML = "";
    generateCards();
}

