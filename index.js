// DOM
const pickXButton = document.querySelector("#pick-x");
const pickOButton = document.querySelector("#pick-o");
const restartButton = document.querySelector("#restart");
const gridItems = document.querySelectorAll(".grid-item");

// Objects & logic
const gameBoard = function() {
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    const clear = () => {
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
    }

    const indexToBoardXY = (index) => {
        let x = index % 3;
        let y = Math.floor(index / 3);
        return {x, y};
    };

    const getRowWinner = (row) => 
    {
        const rowWins = board[row][0] === board[row][1] && board[row][1] === board[row][2] && board[row][0];
        return rowWins ? board[row][0] : "";
    };

    const getColWinner = (col) => 
    {
        const rowWins = board[0][col] === board[1][col] && board[1][col] === board[2][col] && board[0][col];
        return rowWins ? board[0][col] : "";
    };

    const getDiagsWinner = () => 
    {
        const diagsWins = (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] || 
            board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[2][0]);
        return diagsWins ? (board[0][0] ? board[0][0] : board[2][0]) : "";
    };

    const getFreeSpaces = () => {
        let freeSpaces = [];
        for (let y = 0; y < board.length; y++)
        {
            for (let x = 0; x < board[0].length; x++)
            {
                if (!board[y][x])
                {
                    freeSpaces.push({x, y});
                }
            }
        }
        return freeSpaces;
    };

    const evaluateBoard = () => {
        for (let i = 0; i < 3; i++)
        {
            const rowWinner = getRowWinner(i);
            if (rowWinner)
            {
                return rowWinner;
            }
            const colWinner = getColWinner(i);
            if (colWinner)
            {
                return colWinner;
            }
        }
        const diagsWinner = getDiagsWinner();
        if (diagsWinner)
        {
            return diagsWinner;
        }
        if (getFreeSpaces().length === 0)
        {
            return 0; // draw
        }
        return "";
    };

    const place = (team, index) => {
        let {x, y} = indexToBoardXY(index);
        if (board[y][x] === "")
        {
            board[y][x] = team;
            gridItems[index].textContent = team;
            return true;
        }
        else
        {
            return false;
        }
    };

    const coordsToIndex = ({x, y}) => {
        return y * 3 + x;
    }

    const placeRandom = (team) => {
        const freeSpaces = getFreeSpaces();
        const randomPlace = freeSpaces[Math.floor(Math.random() * freeSpaces.length)];
        const index = coordsToIndex(randomPlace);
        place(team, index);
    };

    return {board, clear, place, evaluateBoard, placeRandom};
}();

const game = function() {
    let playerChoice = "O"; // default
    let currentTeam = "X";

    const tryAIMove = () => {
        if (playerChoice !== currentTeam)
        {
            gameBoard.placeRandom(currentTeam);
            if (checkForWin())
            {
                return;
            }
            changeTeam();
        }
    }

    const setPlayerChoice = (choice) => {
        playerChoice = choice;
    };

    const restart = () => {
        gameBoard.clear();
        gridItems.forEach(item => {
            item.textContent = "";
        });
        currentTeam = "X";
        tryAIMove();
    }

    const changeTeam = () => {
        if (currentTeam === "X")
        {
            currentTeam = "O";
        }
        else
        {
            currentTeam = "X";
        }
    }

    const checkForWin = () => {
        const result = gameBoard.evaluateBoard();
        if (result !== "")
        {
            if (result === 0)
            {
                console.log("It's a draw!");
            }
            else
            {
                if (result === playerChoice)
                {
                    console.log("Player wins!");
                }
                else
                {
                    console.log("AI wins!");
                }
            }
            restart();
            return true;
        }
        return false;
    };

    const place = (index) => {
        if (playerChoice !== currentTeam)
        {
            return;
        }
        if (gameBoard.place(currentTeam, index))
        {
            changeTeam();
            if (checkForWin())
            {
                return;
            }
        }
        tryAIMove();
    }

    tryAIMove();

    return {restart, place, setPlayerChoice};
}();

// Events
pickXButton.addEventListener("click", () => {
    pickXButton.disabled = true;
    pickOButton.disabled = false;

    game.setPlayerChoice("X");
    game.restart();
});

pickOButton.addEventListener("click", () => {
    pickXButton.disabled = false;
    pickOButton.disabled = true;

    game.setPlayerChoice("O");
    game.restart();
});

restartButton.addEventListener("click", () => {
    game.restart();
});

const numGridItems = gridItems.length;
for (let i = 0; i < numGridItems; i++)
{
    gridItems[i].addEventListener("click", () => {
        game.place(i);
    });
}