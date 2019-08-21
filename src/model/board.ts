import { CellPosition } from "./ia";

export enum GameResult {PlayerWins, MachineWins, Draw, Running};
export enum CellInfo {Empty, MachineMark, PlayerMark};

export type BoardInfo = CellInfo[][];

export const createNewBoard = (): BoardInfo => {
    const numberColums = 3, numberRows = 3;
    const newBoard: CellInfo[][] = [];
    let row = [];
    for (let i = 0; i < numberRows; i++) {
        row = [];
        for (let j = 0; j < numberColums; j++) {
            row.push(CellInfo.Empty);
        }
        newBoard.push(row);
    }
    return newBoard;
}

export const getAdjacentIndex = (
    board: BoardInfo,
    i: number,
    j: number,
    onFilter: ((cellInfo: CellInfo) => boolean) = (cellInfo) => true
): CellPosition[] => {
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

export const hasAdjacentMarkedMachine = (board: BoardInfo, i: number, j: number): boolean => 
    hasAdjacent(board, i, j, (i, j) => board[i][j] === CellInfo.MachineMark);

export const hasAdjacentMarkedPlayer = (board: BoardInfo, i: number, j: number): boolean => 
    hasAdjacent(board, i, j, (i, j) => board[i][j] === CellInfo.PlayerMark);

export const hasAdjacentMarked = (board: BoardInfo, i: number, j: number): boolean => 
    hasAdjacent(board, i, j, (i, j) => board[i][j] !== CellInfo.Empty);

const isADiagonalLine = (mov0: CellPosition, mov1: CellPosition, mov2: CellPosition): boolean => {
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

export const isALine = (mov0: CellPosition, mov1: CellPosition, mov2: CellPosition): boolean => {
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

const canWin = (board: BoardInfo, mov0: CellPosition, mov1: CellPosition, onFilter: ((cellInfo: CellInfo) => boolean)): boolean => {
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

export const canPlayerOrMachineWin = (board: BoardInfo, i: number, j: number, type: CellInfo): boolean => {
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

export const getGameResult = (board: BoardInfo) => {
    // Are all the cells filled?
    let isAllCellsFilled: boolean = true;
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            if (row[j] === CellInfo.Empty) {
                isAllCellsFilled = false;
                break;
            }
        }
    }
    if (isAllCellsFilled) {
        return GameResult.Draw;
    }

    // Is in machine winner?
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            const element = row[j];
            if (element === CellInfo.MachineMark && hasAdjacentMarkedMachine(board, i, j) 
                && canPlayerOrMachineWin(board, i, j, CellInfo.MachineMark)) {
                    return GameResult.MachineWins;
            }
        }
    }

    // Is in player winner?
    for (let i = 0; i < board.length; i++) {
        const row = board[i];
        for (let j = 0; j < row.length; j++) {
            const element = row[j];
            if (element === CellInfo.PlayerMark && hasAdjacentMarkedPlayer(board, i, j) 
                && canPlayerOrMachineWin(board, i, j, CellInfo.PlayerMark)) {
                    return GameResult.PlayerWins;
            }
        }
    }

    return GameResult.Running;
}
