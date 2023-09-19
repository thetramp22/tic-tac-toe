const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    const _playerCells = [];

    const getPlayerCells = () => _playerCells;
    const setPlayerCells = (index) => {
        _playerCells.push(index);
    }

    return {getName, getMarker, getPlayerCells, setPlayerCells};
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
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let _currentPlayer = player1;

    

    const getCurrentPlayer = () => _currentPlayer;

    const handleClick =(e) => {
        const index = e.target.getAttribute('data-key');
        if(gameBoard.getCell(index) == null) {
            const marker = _currentPlayer.getMarker();

            gameBoard.setCell(index, marker);
            _currentPlayer.setPlayerCells(index);
            displayController.updateGrid();

            _currentPlayer = _currentPlayer == player1 ? player2 : player1;
        }
    }

    const checkForWinner = (player) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        let playerCells = player.getPlayerCells();

        const isSubset = (playerCells, winCondition) => {
            winCondition.every((element) => playerCells.includes(element));
        }

        for(let i = 0; i < winConditions.length; i++){
            if(isSubset(playerCells, winConditions[i])){
                return _currentPlayer;
            }
        }
        return null;        
    }

    return { getCurrentPlayer, handleClick, checkForWinner };

})();

const displayController = (() => {
    const _gameGrid = document.getElementById('game-grid');

    const board = gameBoard.getBoard();

    const createGrid = () => {
        for(let i = 0; i < board.length; i++) {
            const _gameCell = document.createElement('button');
            _gameCell.textContent = board[i];
            _gameCell.setAttribute('data-key', `${i}`);
            _gameCell.addEventListener('click', gameController.handleClick);
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

    return { createGrid, clearGrid, updateGrid };

})();



displayController.createGrid();
