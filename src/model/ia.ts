import { BoardInfo, CellInfo, isALine, getAdjacentIndex,
    hasAdjacentMarked, hasAdjacentMarkedPlayer, hasAdjacentMarkedMachine, canPlayerOrMachineWin } from "./board";

export interface CellPosition {
    i: number,
    j: number,
};

// If cell is not empty WeigthCell === -1
// If player can do a line with the empthy cell, weigthCell === 2
// If machine can do a line with the empthy cell, weigthCell === 3
// If player or machine has only a adjacent cell selected, weigthCell === 1
// Other case (empty cell and no alert), weigthCell === 0
const updateWeigths = (board: BoardInfo): number[][] => {
    // 1) -1 to not empty cells and 0 to empty cells
    const weigthCells: number[][] = board.map(row => (
        row.map(value => (value === CellInfo.Empty ? 0 : -1))
    ));

    // 2) Put 1 in cells with adjactent cell selected.
    for (let i = 0; i < weigthCells.length; i++) {
        const row = weigthCells[i];
        for (let j = 0; j < row.length; j++) {
            const element = row[j];
            if (element === 0 && hasAdjacentMarked(board, i, j)) {
                row[j] = 1;
            }
        }
    }
    
    // 3) About cells with 1, see if the cell needs a 2 (will be a line with player).
    for (let i = 0; i < weigthCells.length; i++) {
        const row = weigthCells[i];
        for (let j = 0; j < row.length; j++) {
            const element = row[j];
            if (element === 1 && hasAdjacentMarkedPlayer(board, i, j) && canPlayerOrMachineWin(board, i, j, CellInfo.PlayerMark)) {
                row[j] = 2;
            }
        }
    }

    // 3) About cells with 1, see if the cell needs a 3 (will be a line with machine).
    for (let i = 0; i < weigthCells.length; i++) {
        const row = weigthCells[i];
        for (let j = 0; j < row.length; j++) {
            const element = row[j];
            if (element === 1 && hasAdjacentMarkedMachine(board, i, j) && canPlayerOrMachineWin(board, i, j, CellInfo.MachineMark)) {
                row[j] = 3;
            }
        }
    }

    return weigthCells;
}

const markMachineWinner = (weigthCells: number[][]): CellPosition | undefined => {
    const machineWinner: CellPosition[] = [];
    weigthCells.forEach((row, i) =>
        row.forEach((weigth, j) => {
            if (weigth === 3)
                machineWinner.push({i, j});
        })
    );
    if (machineWinner.length > 0) {
        return machineWinner[0];
    }
    return undefined;
}

const blockPlayerPosition = (weigthCells: number[][]): CellPosition | undefined => {
    const machineWinner: CellPosition[] = [];
    weigthCells.forEach((row, i) =>
        row.forEach((weigth, j) => {
            if (weigth === 2)
                machineWinner.push({i, j});
        })
    );
    if (machineWinner.length > 0) {
        return machineWinner[0];
    }
    return undefined;
}

const searchRandomMovement = (weigthCells: number[][]): CellPosition => {
    // Get list of empty cells and returns anyone.
    const empthyCells: CellPosition[] = [];
    weigthCells.forEach((row, i) =>
        row.forEach((weigth, j) => {
            if (weigth !== -1)
                empthyCells.push({i, j});
        })
    );

    const indexCellChoosed = Math.floor(Math.random() * empthyCells.length);

    return empthyCells[indexCellChoosed];
}

export const getNextMachineTurn = (board: BoardInfo): CellPosition => {
    const weigthCells: number[][] = updateWeigths(board);
    if (board[1][1] === CellInfo.Empty) {
        return {i: 1, j: 1};
    } else {
        const machineWinnerMovement = markMachineWinner(weigthCells);
        if (machineWinnerMovement) {
            return machineWinnerMovement;
        } else {
            const blockPlayerWin = blockPlayerPosition(weigthCells);
            if (blockPlayerWin) {
                return blockPlayerWin;
            }
        }
    }
    return searchRandomMovement(weigthCells);
}
