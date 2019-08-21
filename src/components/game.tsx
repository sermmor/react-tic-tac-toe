import * as React from 'react';
import { Board } from './board';
import { getNextMachineTurn, CellPosition } from '../model/ia';
import { createNewBoard, CellInfo, BoardInfo, getGameResult } from '../model/board';

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

const turnManagement = (gameStatus: GameStatus): CellPosition => {

    let nextIAMovement: CellPosition = undefined;

    if (!gameStatus.isInPlayerTurn) {
        nextIAMovement = getNextMachineTurn(gameStatus.boardState);
    }

    return nextIAMovement;
};

export const Game = () => {
    const gameStatus = useGameStatus();
    const nextIAMovement = turnManagement(gameStatus);

    // TODO: Send callbacks for game finished and show result in modal https://material-ui.com/es/components/dialogs/
    console.log(`Game Result: ${getGameResult(gameStatus.boardState)}`);

    return (
        <>
            <Board gameStatus={gameStatus} nextIAMovement={nextIAMovement} onTurnChange={gameStatus.setGameStatus} />
        </>
    );
}
