import * as React from 'react';
import { CellCleaned } from './cell/cell-cleaned';
import { CellType } from '../model/board';
import { GameStatus, Turn } from './game';

const cellStyle: React.CSSProperties = {
    width: 100,
    height: 100,
    border: "10px solid white",
}

interface CellStatus {
    cell: CellType; 
    i: number; 
    j: number;
}

export const renderCell = (status: CellStatus, gameStatus: GameStatus) => {
    if (status.cell === CellType.HumanMark) {
        // TODO:
    } else if (status.cell === CellType.MachineMark) {
        // TODO:
    }
    return (
        <CellCleaned
            key={`cell_${status.i}_${status.j}`}
            genericCellStyle={cellStyle}
            isPlayingMachine={gameStatus.currentTurn === Turn.Machine}
            onChangeCell={() => console.log(`cell (${status.i}, ${status.j}) changed!`)} // TODO: Create change of cell in BOARD.
        />
    );
}
