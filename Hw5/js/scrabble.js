/*
Assignment 5: File: scrabble.js
Assignment 5: Details: Putting it altogether in making a one line Scrabble Borad Game
Ayoub Darkaoui, UMass Lowell Computer Science Student, Ayoub_Darkaoui@student.uml.edu

Copyright (c) 2024 by Ayoub Darkaoui. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by AD on June 28, 2024 at 11:45 PM
*/

$(document).ready(() => {
    // Initialize arrays and variables for game state
    let scrabblePieces = [];
    let droppedTiles = [];
    let submittedWords = [];
    let validWords = 0;
    let invalidWords = 0;
    let totalScore = 0;
    let score = 0;

    // Static data for game tiles and board
    const gameTiles = [
        { "id": "tile0", "letter": "" },
        { "id": "tile1", "letter": "" },
        { "id": "tile2", "letter": "" },
        { "id": "tile3", "letter": "" },
        { "id": "tile4", "letter": "" },
        { "id": "tile5", "letter": "" },
        { "id": "tile6", "letter": "" }
    ];

    const gameBoard = [
        { "id": "drop0", "tile": "tileX" },
        { "id": "drop1", "tile": "tileX" },
        { "id": "drop2", "tile": "tileX" },
        { "id": "drop3", "tile": "tileX" },
        { "id": "drop4", "tile": "tileX" },
        { "id": "drop5", "tile": "tileX" },
        { "id": "drop6", "tile": "tileX" },
        { "id": "drop7", "tile": "tileX" },
        { "id": "drop8", "tile": "tileX" },
        { "id": "drop9", "tile": "tileX" },
        { "id": "drop10", "tile": "tileX" },
        { "id": "drop11", "tile": "tileX" },
        { "id": "drop12", "tile": "tileX" },
        { "id": "drop13", "tile": "tileX" },
        { "id": "drop14", "tile": "tileX" }
    ];

    // Load scrabble pieces data from JSON file
    $.getJSON("graphics_data/pieces.json", (data) => {
        console.log("Loading scrabble pieces data...");
        scrabblePieces = data.pieces; // Store loaded pieces data
        initializeGame(); // Initialize the game after pieces are loaded
    }).fail(() => {
        console.error("Failed to load scrabble pieces data from JSON.");
    });

    // Event handlers for game buttons
    $('#submitWord').click(handleWordSubmission);
    $('#resetBoard').click(resetBoard);
    $('#newTiles').click(getNewTiles);

    // Game initialization function
    function initializeGame() {
        loadScrabblePieces(); // Load initial set of tiles
        loadDroppableTargets(); // Set up droppable board positions
    }

    // Function to load scrabble pieces (tiles) onto the rack
    function loadScrabblePieces() {
        const baseUrl = "graphics_data/Scrabble_Tiles/Scrabble_Tile_";
        $("#rackTiles").empty(); // Clear any existing tiles

        for (let i = 0; i < 7; i++) {
            let randomNum;
            let letter;

            // Select a random piece that hasn't been exhausted
            do {
                randomNum = getRandomInt(0, scrabblePieces.length - 1);
                letter = scrabblePieces[randomNum].letter;
            } while (scrabblePieces[randomNum].amount === 0);

            scrabblePieces[randomNum].amount--; // Decrease available count

            // Create HTML for tile and append to rack
            const pieceHtml = `<img class="tile" id="tile${i}" src="${baseUrl}${letter}.jpg" alt="${letter}">`;
            $("#rackTiles").append(pieceHtml);

            // Make tiles draggable using jQuery UI
            $(`#tile${i}`).draggable({
                revert: "invalid"
            });

            gameTiles[i].letter = letter; // Store tile letter in game state
        }
    }

    // Function to set up droppable targets on the game board
    function loadDroppableTargets() {
        const imgUrl = "graphics_data/Scrabble_Blank.png";

        for (let i = 0; i < 15; i++) {
            // Create droppable target and append to board
            const dropHtml = `<div class="droppable" id="drop${i}"></div>`;
            $("#scrabbleBoard").append(dropHtml);

            // Make each board position droppable using jQuery UI
            $(`#drop${i}`).droppable({
                accept: ".tile",
                drop: function (event, ui) {
                    const draggableId = ui.draggable.attr("id");
                    const droppableId = $(this).attr("id");

                    // Log tile drop event
                    console.log(`Tile: ${draggableId} - dropped on ${droppableId}`);

                    // Adjust position of dropped tile
                    ui.draggable.position({
                        of: $(this),
                        my: 'center',
                        at: 'center'
                    });

                    // Update game board state with dropped tile
                    gameBoard[findBoardPosition(droppableId)].tile = draggableId;

                    // Handle word validation and scoring
                    droppedTiles.push({ id: draggableId, letter: findLetter(draggableId), value: findScore(draggableId) });
                    findWord();
                    updateScore();
                },
                out: function (event, ui) {
                    const draggableId = ui.draggable.attr("id");
                    const droppableId = $(this).attr("id");

                    // Handle tile removal from board
                    if (draggableId !== gameBoard[findBoardPosition(droppableId)].tile) {
                        console.log("FALSE ALARM DETECTED.");
                        return;
                    }

                    console.log(`Tile: ${draggableId} - removed from ${droppableId}`);
                    gameBoard[findBoardPosition(droppableId)].tile = "tileX";
                    droppedTiles.pop();
                    findWord();
                    updateScore();
                }
            });
        }
    }

    // Function to find letter of a tile by its ID
    function findLetter(tileId) {
        return gameTiles.find(tile => tile.id === tileId).letter;
    }

    // Function to find score value of a tile by its ID
    function findScore(tileId) {
        const letter = findLetter(tileId);
        const piece = scrabblePieces.find(piece => piece.letter === letter);
        return piece ? piece.value : 0;
    }

    // Function to find position index of a board position by its ID
    function findBoardPosition(dropId) {
        return gameBoard.findIndex(board => board.id === dropId);
    }

    // Function to validate and score the current set of dropped tiles as a word
    function findWord() {
        droppedTiles.sort((a, b) => a.id.localeCompare(b.id));
        const word = droppedTiles.map(tile => tile.letter).join("");

        // Validate the word using an API and update score accordingly
        validateWord(word).then(isValid => {
            if (isValid) {
                $("#validationMessage").text(`Word "${word}" is valid!`).css("color", "green");
                score = droppedTiles.reduce((acc, tile) => acc + tile.value, 0);
            } else {
                $("#validationMessage").text(`Word "${word}" is invalid!`).css("color", "red");
                score = 0;
            }

            updateScore(); // Update displayed score
        });
    }

    // Function to update the displayed score
    function updateScore() {
        $("#currentScore").text(score);
    }

    // Function to reset the game board
    function resetBoard() {
        droppedTiles = []; // Clear dropped tiles
        score = 0; // Reset score
        $("#validationMessage").text(""); // Clear validation message
        updateScore(); // Update displayed score
        $("#scrabbleBoard").empty(); // Clear game board
        loadDroppableTargets(); // Reload droppable board positions
    }

    // Function to get new tiles for the rack
    function getNewTiles() {
        resetBoard(); // Reset the board
        loadScrabblePieces(); // Load new tiles onto the rack
    }

    // Function to handle word submission button click
    function handleWordSubmission() {
        const word = droppedTiles.map(tile => tile.letter).join("");
        const wordScore = droppedTiles.reduce((acc, tile) => acc + tile.value, 0);

        // Validate the word and update game state accordingly
        validateWord(word).then(isValid => {
            submittedWords.push({ word, isValid, score: wordScore }); // Store submitted word data
            updateSubmittedWords(); // Update displayed submitted words
            updateGameSummary(); // Update game summary statistics

            resetBoard(); // Reset the board
            getNewTiles(); // Get new tiles for the rack
        });
    }

    // Function to update displayed submitted words
    function updateSubmittedWords() {
        const rows = submittedWords.map(({ word, isValid, score }) => `
            <tr>
                <td>${word}</td>
                <td>${isValid ? "Yes" : "No"}</td>
                <td>${score}</td>
            </tr>
        `);

        $("#submittedWords").html(rows.join("")); // Update HTML content of submitted words table
    }

    // Function to update game summary statistics
    function updateGameSummary() {
        validWords = submittedWords.filter(word => word.isValid).length; // Count valid words
        invalidWords = submittedWords.filter(word => !word.isValid).length; // Count invalid words
        totalScore = submittedWords.filter(word => word.isValid).reduce((acc, word) => acc + word.score, 0); // Calculate total score

        // Update HTML content of game summary table
        $("#gameSummary").html(`
            <tr>
                <td>${validWords}</td>
                <td>${invalidWords}</td>
                <td>${totalScore}</td>
            </tr>
        `);
    }

    // Function to validate a word using an API
    function validateWord(word) {
        return $.ajax({
            url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
            method: 'GET'
        }).then(function() {
            return true; // The word exists
        }).catch(function() {
            return false; // The word does not exist
        });
    }

    // Function to generate random integer within a range
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});
