import { Cell } from '../models';

export const drawBoard = (gameBoard: Map<number, Cell>, boardCells: NodeListOf<HTMLElement>): void => {
    boardCells = document.querySelectorAll('.board div span');
    boardCells.forEach(span => {
        const id: number = +span.id;
        span.textContent = gameBoard.get(id)?.value ?? '';
    });
};
