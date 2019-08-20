import * as React from 'react';
import { createNewBoard } from '../model/board';
import { renderCell } from './cell-renderer';
import { GameStatus } from './game';

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

export const Board = (props: Props) => {
    const [boardState, setBoardState] = React.useState(createNewBoard());
    return (
        <div style={boardStyle}>
            {
                boardState.map((row, i) =>
                    row.map((cell, j) => 
                        renderCell({cell, i, j}, props.gameStatus)
                    )
                )
            }
        </div>
    );
}