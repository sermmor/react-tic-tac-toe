import * as React from 'react';
import { Board } from './board';
import { getNextMachineTurn, IAMovement } from '../model/ia';
import { createNewBoard, CellType, BoardInfo } from '../model/board';

export interface GameStatus {
    isInPlayerTurn: boolean;
    boardState: BoardInfo;
    setGameStatus: (newBoardState: BoardInfo, isInHumanTurn: boolean) => void;
}

const useGameStatus = (): GameStatus => {
    const [boardState, setBoardState] = React.useState(createNewBoard());
    const [isInPlayerTurn, setIsInPlayerTurn] = React.useState(true);

    const setGameStatus = React.useCallback((newBoardState: BoardInfo, newIsInPlayerTurn: boolean) => {
        setBoardState(newBoardState);
        setIsInPlayerTurn(newIsInPlayerTurn);
    }, []);

    return { boardState, isInPlayerTurn, setGameStatus, };
};

const turnManagement = (isInPlayerTurn: boolean): IAMovement => {

    let nextIAMovement: IAMovement = undefined;

    if (!isInPlayerTurn) {
        nextIAMovement = getNextMachineTurn();
    }

    return nextIAMovement;
};

export const Game = () => {
    const gameStatus = useGameStatus();
    const nextIAMovement = turnManagement(gameStatus.isInPlayerTurn);

    return (
        <>
            <Board gameStatus={gameStatus} nextIAMovement={nextIAMovement} onTurnChange={gameStatus.setGameStatus} />
        </>
    );
}
