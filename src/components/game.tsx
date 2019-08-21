import * as React from 'react';
import { Board } from './board';
import { getNextMachineTurn, CellPosition } from '../model/ia';
import { createNewBoard, CellInfo, BoardInfo, getGameResult, GameResult } from '../model/board';
import { GameOverDialog } from './game-over';

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

const turnManagement = (gameStatus: GameStatus, gameResult: GameResult): CellPosition => {

    let nextIAMovement: CellPosition = undefined;

    if (!gameStatus.isInPlayerTurn && gameResult === GameResult.Running) {
        nextIAMovement = getNextMachineTurn(gameStatus.boardState);
    }

    return nextIAMovement;
};

export const Game = () => {
    const gameStatus = useGameStatus();
    const gameResult = getGameResult(gameStatus.boardState);
    const nextIAMovement = turnManagement(gameStatus, gameResult);

    return (
        <>
            <Board gameStatus={gameStatus} nextIAMovement={nextIAMovement} onTurnChange={gameStatus.setGameStatus} />
            <GameOverDialog gameResult={gameResult}/>
        </>
    );
}
