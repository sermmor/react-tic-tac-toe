import * as React from 'react';
import { Board } from './board';

export enum Turn {Machine, Human};

export interface GameStatus {
    currentTurn: Turn;
}

const createGameStatus = (): GameStatus => (
    {
        currentTurn: Turn.Human,
    }
)

export const Game = () => {
    const [gameStatus, setGameStatus] = React.useState(createGameStatus());
    return (
        <>
            <Board gameStatus={gameStatus} />
        </>
    );
}
