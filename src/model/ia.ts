export interface IAMovement {
    i: number,
    j: number,
};

export const getNextMachineTurn = (): IAMovement => {
    return {i: 2, j: 0};
}