/*
 * Create a list that holds all of your cards
 */

const cardsDeck = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let start = false;
let openCards = [];
let moves = 0;
let timeCo = 0;
let solvedCounter = 0;
let timerPtr;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/**Start the timer*/
function startTimer() {
    timeCo += 1;
    $("#timer").html(timeCo);
    timerPtr = setTimeout(startTimer, 1000);
}


/**Class value from card DOM!*/
function getClassFromCard(card) {
    return card[0].firstChild.className;
}

/** Open cards when count=2!!*/
function checkOpenCards() {
    if (getClassFromCard(openCards[0]) === getClassFromCard(openCards[1])) {
        solvedCounter++;
        openCards.forEach(function(card) {
            card.animateCss('tada', function() {
                card.toggleClass("open show match");
            });
        });
    } else {
        openCards.forEach(function(card) {
            card.animateCss('shake', function() {
                card.toggleClass("open show");
            });
        });
    }
    openCards = [];
    incrementMove();
    if (solvedCounter === 8) {
        endGame();
    }
}

/** Increment moves*/
function incrementMove() {
    moves += 1;
    $("#moves").html(moves);
    if (moves === 14 || moves === 20) {
        reduceStar();
    }
}

/**Event listener */
function cardClick(event) {
    let classes = $(this).attr("class"); // check opened or matched card
    if (classes.search('open') * classes.search('match') !== 1) {
        return;
    }
    /**Start Game! */
    if (!start) {
        start = true;
        timeCount = 0;
        timerPtr = setTimeout(startTimer, 1000);
    }
    /**Flipp cards! 
     */
    if (openCards.length < 2) {
        $(this).toggleClass("open show");
        openCards.push($(this));
    }
    /**Check Match
     */
    if (openCards.length === 2) {
        checkOpenCards();
    }
}

/**Creates Individual Card*/
function createCard(cardClass) {
    $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

// Populate cards
function populateCards() {
    shuffle(cardsDeck.concat(cardsDeck)).forEach(createCard);
}

/** Reset Game */
function resetGame() {
    $("ul.deck").html("");
    $(".stars").html("");
    moves = -1;
    incrementMove();
    start = false;
    openCards = [];
    timeCo = 0;
    solvedCounter = 0;
    clearTimeout(timerPtr);
    $("#timer").html(0);
    initGame();
}

// Load animateCss
// Taken from https://github.com/daneden/animate.css/#usage
$.fn.extend({
    animateCss: function(animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});
// When is game won!
function endGame() {
    clearTimeout(timerPtr); // stop timer
    let stars = $(".fa-star").length; // show prompt
    vex.dialog.confirm({
        message: `Thanks for playing.You have finish in ${timeCo} seconds with ${stars}/3 star. Try again?`,
        callback: function(value) {
            if (value) {
                resetGame();
            }
        }
    });
}

//Stars display
function initStars() {
    for (let i = 0; i < 3; i++) {
        $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
    }
}

// Minus stars 
function reduceStar() {
    let stars = $(".fa-star");
    $(stars[stars.length - 1]).toggleClass("fa-star fa-star-o");
}

//  Initgame
function initGame() {
    populateCards();
    initStars();
    $(".card").click(cardClick);
}

// DOM is loaded for the first time
$(document).ready(function() {
    initGame();
    $("#restart").click(resetGame);
    vex.defaultOptions.className = 'vex-theme-os';
    vex.dialog.buttons.YES.text = 'Yes!';
    vex.dialog.buttons.NO.text = 'No';
});




/** 
// load animateCss
// taken from https://github.com/daneden/animate.css/#usage
$.fn.extend({
    animateCss: function(animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});*/