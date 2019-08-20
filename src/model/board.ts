export enum CellInfo {Empty, MachineMark, PlayerMark};

export type BoardInfo = CellInfo[][];

export const createNewBoard = (): CellInfo[][] => {
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
