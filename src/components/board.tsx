import * as React from 'react';
import { CellInfo, BoardInfo, getGameResult } from '../model/board';
import { GameStatus } from './game';
import { Cell } from './cell';
import { CellPosition } from '../model/ia';

type OnChangeCellCalback = (i: number, j: number) => void;

const boardStyle: React.CSSProperties = {
    display:"grid",
    gridTemplateColumns: "auto auto auto",
    width: 360,
    height: 360,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "10px solid #383838",
}

interface Props {
    gameStatus: GameStatus;
    nextIAMovement: CellPosition;
    onTurnChange: (nextBoardState: BoardInfo, newIsInPlayerTurn: boolean) => void;
}

interface CellStatus {
    cell: CellInfo; 
    i: number; 
    j: number;
}

const renderCell = (status: CellStatus, gameStatus: GameStatus, onChangeCell: OnChangeCellCalback) => {
    const onChangeEmptyCell = React.useCallback(() => onChangeCell(status.i, status.j), []);

    return (
        <Cell
            key={`cell_${status.i}_${status.j}`}
            cellType={status.cell}
            isInPlayerTurn={gameStatus.isInPlayerTurn}
            onChangeCell={onChangeEmptyCell}
            gameStatus={gameStatus}
        />
    );
}

const turnManager = (props: Props): ((i: number, j: number) => void) => {
    const [isInMachineMovement, setIsInMachineMovement] = React.useState(false);
    const markCellAsHuman = React.useCallback((i: number, j: number) => {
        if (props.gameStatus.isInPlayerTurn && props.gameStatus.boardState[i][j] === CellInfo.Empty) {
            props.gameStatus.boardState[i][j] = CellInfo.PlayerMark;
            props.onTurnChange(props.gameStatus.boardState, false);
            setIsInMachineMovement(true);
        }
    }, []);

    if (!props.gameStatus.isInPlayerTurn && isInMachineMovement && props.nextIAMovement) {
        // Waiting 200 milliseconds for more jugability.
        setTimeout(() => {
            props.gameStatus.boardState[props.nextIAMovement.i][props.nextIAMovement.j] = CellInfo.MachineMark;
            props.onTurnChange(props.gameStatus.boardState, true);
        }, 200);
        setIsInMachineMovement(false);
    }
    return markCellAsHuman;
}

export const Board = (props: Props) => {
    const markCellAsHuman = turnManager(props);

    return (
        <div style={boardStyle}>
            {
                props.gameStatus.boardState.map((row, i) =>
                    row.map((cell, j) => 
                        renderCell({cell, i, j}, props.gameStatus, markCellAsHuman)
                    )
                )
            }
        </div>
    );
}