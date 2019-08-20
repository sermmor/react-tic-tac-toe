import * as React from 'react';
import { createNewBoard, CellType } from '../model/board';
import { GameStatus, Turn } from './game';
import { Cell } from './cell';

type OnChangeCellCalback = (i: number, j: number) => void;

const boardStyle: React.CSSProperties = {
    display:"grid",
    gridTemplateColumns: "auto auto auto",
    width: 300,
    height: 300,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-60%, -50%)",
}

interface Props {
    gameStatus: GameStatus;
}

interface CellStatus {
    cell: CellType; 
    i: number; 
    j: number;
}

const renderCell = (status: CellStatus, gameStatus: GameStatus, onChangeCell: OnChangeCellCalback) => {
    const onChangeEmptyCell = React.useCallback(() => onChangeCell(status.i, status.j), []);

    return (
        <Cell
            key={`cell_${status.i}_${status.j}`}
            cellType={status.cell}
            isPlayingMachine={gameStatus.currentTurn === Turn.Machine}
            onChangeCell={onChangeEmptyCell}
        />
    );
}

export const Board = (props: Props) => {
    const [boardState, setBoardState] = React.useState(createNewBoard());
    
    const markCellAsHuman = React.useCallback((i: number, j: number) => {
        if (boardState[i][j] === CellType.Empty) {
            boardState[i][j] = CellType.HumanMark;
            setBoardState(boardState);
        }
    }, []);
    
    // TODO: USE setGameStatus FOR currentTurn: Turn TO MACHINE TURN
    // TODO: USE setBoardState FOR currentTurn: Turn TO MACHINE TURN

    return (
        <div style={boardStyle}>
            {
                boardState.map((row, i) =>
                    row.map((cell, j) => 
                        renderCell({cell, i, j}, props.gameStatus, markCellAsHuman)
                    )
                )
            }
        </div>
    );
}