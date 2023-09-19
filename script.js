const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    const _playerCells = [];

    const getPlayerCells = () => _playerCells;
    const setPlayerCells = (index) => {
        _playerCells.push(index);
    }
    const resetPlayerCells = () => {
        _playerCells.splice(0, _playerCells.length);
    }

    return {
        getName,
        getMarker, 
        getPlayerCells,
        setPlayerCells,
        resetPlayerCells
    };
}

const gameBoard = (() => {
    let board = Array(9).fill(null);

    const getBoard = () => board;

    const setCell = (index, marker) => {
        board[index] = marker;
    };

    const getCell = (index) => board[index];

    const reset = () => {
        for(let i = 0; i < board.length; i++) {
            board[i] = null;
        }
    };

    return { getBoard, setCell, getCell, reset };
})();

const gameController = (() => {
    const playerX = Player("Player X", "X");
    const playerO = Player("Player O", "O");

    let _currentPlayer = playerX;
    const getCurrentPlayer = () => _currentPlayer;

    const handleGridClick =(e) => {
        const index = e.target.getAttribute('data-key');
        if(gameBoard.getCell(index) == null) {
            const marker = _currentPlayer.getMarker();

            gameBoard.setCell(index, marker);
            _currentPlayer.setPlayerCells(index);
            displayController.updateGrid();

            if(checkForWinner(_currentPlayer)) {
                displayController.openGameEndModal(`${_currentPlayer.name} wins!`);
                return;
            }

            if(checkForTie(playerX, playerO)) {
                displayController.openGameEndModal(`It's a tie.`);
                return;
            }

            _currentPlayer = _currentPlayer == playerX ? playerO : playerX;
        }

    }

    const handleNameInput = (e) => {
        e.preventDefault();
        playerX.name = document.getElementById('playerX').value;
        playerO.name = document.getElementById('playerO').value;

        displayController.closeNameInputModal();

        displayController.updatePlayerNames(playerX.name, playerO.name);
        displayController.createGrid();
    }

    const handlePlayAgain = () => {
        gameBoard.reset();
        playerX.resetPlayerCells();
        playerO.resetPlayerCells();
        displayController.updateGrid();
        displayController.closeGameEndModal();
    }

    const checkForWinner = (player) => {
        let result = false;
        const winConditions = [
            ['0', '1', '2'],
            ['3', '4', '5'],
            ['6', '7', '8'],
            ['0', '3', '6'],
            ['1', '4', '7'],
            ['2', '5', '8'],
            ['0', '4', '8'],
            ['2', '4', '6']
        ];

        let playerCells = player.getPlayerCells();      

        for(let i = 0; i < winConditions.length; i++){
            if (winConditions[i].every((element) => playerCells.includes(element))) {
                result = true;
            }
        }

        return result;
    }

    const checkForTie = (playerX, playerO) => {
        return playerX.getPlayerCells().length + playerO.getPlayerCells().length === 9;

    }

    return {
        getCurrentPlayer,
        handleGridClick,
        handleNameInput,
        handlePlayAgain,
        checkForWinner,
        checkForTie
    };

})();

const displayController = (() => {
    const _gameGrid = document.getElementById('game-grid');
    const playBtn = document.getElementById('play-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    playBtn.addEventListener('click', gameController.handleNameInput);
    playAgainBtn.addEventListener('click', gameController.handlePlayAgain);

    const board = gameBoard.getBoard();

    const createGrid = () => {
        for(let i = 0; i < board.length; i++) {
            const _gameCell = document.createElement('button');
            _gameCell.textContent = board[i];
            _gameCell.setAttribute('data-key', `${i}`);
            _gameCell.addEventListener('click', gameController.handleGridClick);
            _gameGrid.appendChild(_gameCell);
        }
    };    

    const clearGrid = () => {
        _gameGrid.innerHTML = "";
    };

    const updateGrid = () => {
        clearGrid();
        createGrid();
    }

    const updatePlayerNames = (playerX, playerO) => {
        const names = document.getElementById('player-names');
        const nameX = document.createElement('h2');
        const nameO = document.createElement('h2');

        nameX.textContent = `${playerX} is X`;
        nameO.textContent = `${playerO} is O`;

        names.appendChild(nameX);
        names.appendChild(nameO);
    }

    const openNameInputModal = () => {
        const modal = document.getElementById('name-input-modal');
        modal.style.display = "block";
    }

    const closeNameInputModal = () => {
        const modal = document.getElementById('name-input-modal');
        modal.style.display = "none";
    }

    const openGameEndModal = (winnerText) => {
        const modal = document.getElementById('game-end-modal');
        modal.style.display = "block";

        const text = document.getElementById('game-end-text');
        text.textContent = winnerText;
    }

    const closeGameEndModal = () => {
        const modal = document.getElementById('game-end-modal');
        modal.style.display = "none";
    }

    return {
        createGrid,
        clearGrid,
        updateGrid,
        updatePlayerNames,
        openNameInputModal,
        closeNameInputModal,
        openGameEndModal,
        closeGameEndModal
    };

})();



displayController.openNameInputModal();
