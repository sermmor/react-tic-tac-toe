import { BoardInfo, CellInfo } from "./board";

export interface IAMovement {
    i: number,
    j: number,
};

const getAdjacentIndex = (
    board: BoardInfo,
    i: number,
    j: number,
    onFilter: ((cellInfo: CellInfo) => boolean) = (cellInfo) => true
): IAMovement[] => {
    return [{i: i-1, j: j-1}, {i: i-1, j: j}, {i: i-1, j: j+1},
        {i: i, j: j-1}, {i: i, j: j+1},
        {i: i+1, j: j-1}, {i: i+1, j: j}, {i: i+1, j: j+1},
    ].filter(pairs => pairs.i >= 0 && pairs.i < board.length && pairs.j >= 0 && pairs.j < board[0].length
        && onFilter(board[pairs.i][pairs.j]));
}

const hasAdjacent = (board: BoardInfo, i: number, j: number, onFilter: ((i: number, j: number) => boolean)): boolean => {
    const directions = getAdjacentIndex(board, i, j);
    let toReturn = false;

    for (let i = 0; i < directions.length; i++) {
        if (onFilter(directions[i].i, directions[i].j)) {
            toReturn = true;
            break;
        }
    }
    return toReturn;
}

const hasAdjacentMarkedMachine = (board: BoardInfo, i: number, j: number): boolean => 
    hasAdjacent(board, i, j, (i, j) => board[i][j] === CellInfo.MachineMark)

const hasAdjacentMarkedPlayer = (board: BoardInfo, i: number, j: number): boolean => 
    hasAdjacent(board, i, j, (i, j) => board[i][j] === CellInfo.PlayerMark)

const hasAdjacentMarked = (board: BoardInfo, i: number, j: number): boolean => 
    hasAdjacent(board, i, j, (i, j) => board[i][j] !== CellInfo.Empty)

const isADiagonalLine = (mov0: IAMovement, mov1: IAMovement, mov2: IAMovement): boolean => {
    const positions = [mov0, mov1, mov2].sort((a, b) => a.i - b.i);
    
    // is diagonal from left to right?
    if (positions[0].i === 0 && positions[0].j === 0
        && positions[1].i === 1 && positions[1].j === 1
        && positions[2].i === 2 && positions[2].j === 2) {
            return true;
    }
    // is diagonal from right to left?
    if (positions[0].i === 0 && positions[0].j === 2 
        && positions[1].i === 1 && positions[1].j === 1
        && positions[2].i === 2 && positions[2].j === 0) {
            return true;
    }

    return false;
}

const isALine = (mov0: IAMovement, mov1: IAMovement, mov2: IAMovement): boolean => {
    // is a horizontal line?
    if (mov0.i === mov1.i && mov1.i === mov2.i)
        return true;
    // is a vertical line?
    if (mov0.j === mov1.j && mov1.j === mov2.j)
        return true;
    // is a diagonal line?
    if (isADiagonalLine(mov0, mov1, mov2))
        return true;

    return false;
}

const canWin = (board: BoardInfo, mov0: IAMovement, mov1: IAMovement, onFilter: ((cellInfo: CellInfo) => boolean)): boolean => {
    const isRepetedMove = (i: number, j: number) => (mov0.i === i && mov0.j === j) || (mov1.i === i && mov1.j === j);
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            if (!isRepetedMove(i, j) && onFilter(board[i][j]) && isALine(mov0, mov1, {i, j})) {
                // console.log(`Player or machine winner combination: (${mov0.i} ${mov0.j}) (${mov1.i} ${mov1.j}) (${i} ${j})`);
                return true;
            }
        }
    }
    return false;
}

const canPlayerOrMachineWin = (board: BoardInfo, i: number, j: number, type: CellInfo): boolean => {
    // Can player or machine win if player marks this cell?
    const onFilter = (cellInfo: CellInfo) => cellInfo === type;
    const directions = getAdjacentIndex(board, i, j, onFilter);
    let toReturn = false, adj_i: number, adj_j: number;

    for (let index = 0; index < directions.length; index++) {
        [adj_i, adj_j] = [directions[index].i, directions[index].j];
        // With position (i, j) and position (adj_i, adj_j) can player or machine do a line?
        if (canWin(board, {i, j}, {i: adj_i, j: adj_j}, onFilter)) {
            // console.log(`Player or machine winner combination: (${i} ${j}) (${adj_i} ${adj_j})`);
            toReturn = true;
            break;
        }
    }
    return toReturn;
}

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
    
    console.log(weigthCells);

    return weigthCells;
}

const markMachineWinner = (weigthCells: number[][]): IAMovement | undefined => {
    const machineWinner: IAMovement[] = [];
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

const blockPlayerPosition = (weigthCells: number[][]): IAMovement | undefined => {
    const machineWinner: IAMovement[] = [];
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

const searchRandomMovement = (weigthCells: number[][]): IAMovement => {
    // Get list of empty cells and returns anyone.
    const empthyCells: IAMovement[] = [];
    weigthCells.forEach((row, i) =>
        row.forEach((weigth, j) => {
            if (weigth !== -1)
                empthyCells.push({i, j});
        })
    );

    const indexCellChoosed = Math.floor(Math.random() * empthyCells.length);

    return empthyCells[indexCellChoosed];
}

export const getNextMachineTurn = (board: BoardInfo): IAMovement => {
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
