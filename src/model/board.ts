export type BoardInfo = CellType[][];

export enum CellType {Empty, MachineMark, HumanMark};

export const createNewBoard = (): CellType[][] => {
    const numberColums = 3, numberRows = 3;
    const newBoard: CellType[][] = [];
    let row = [];
    for (let i = 0; i < numberRows; i++) {
        row = [];
        for (let j = 0; j < numberColums; j++) {
            row.push(CellType.Empty);
        }
        newBoard.push(row);
    }
    return newBoard;
}
