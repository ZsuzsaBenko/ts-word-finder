import { take } from 'rxjs';
import Board from './board';
import EventListeners from './event-listeners';
import GameOver from './game-over';
import GameStats from './game-stats';
import { Cell } from './models';
import Timer from './timer';

class Game {
    private readonly BOARD_CELLS = document.querySelectorAll('.board div span');
    private readonly FOUND_WORDS = document.querySelector('.found-words') as HTMLElement;
    private readonly board = new Board();
    private readonly timer = new Timer();
    private readonly gameStats = new GameStats();
    private readonly eventListeners = new EventListeners();
    private readonly gameOver = new GameOver();
    private readonly foundWords: Array<string> = [];
    private readonly unknownWords: Array<string> = [];
    private hiddenWords: Array<string> = [];

    play = (): void => {
        const gameBoard = this.board.initBoard();
        this.drawBoard(gameBoard);
        this.hiddenWords = this.board.getWordsInBoard();
        this.gameStats.initStats(this.hiddenWords, this.foundWords);
        this.subscribeToDOMEvents();
        this.subscribeToTimer();
    };

    private drawBoard(gameBoard: Map<number, Cell>): void {
        this.BOARD_CELLS.forEach(span => {
            const id: number = +span.id;
            span.textContent = gameBoard.get(id)?.value ?? '';
        });
    }

    private subscribeToDOMEvents(): void {
        this.eventListeners.listenToEvents();
        this.eventListeners.wordSelected
            .subscribe((selectedCells: Array<HTMLElement>) => this.checkWord(selectedCells));
    }

    private subscribeToTimer(): void {
        this.timer.start();
        this.timer.timeIsUpGameOver
            .pipe(take(1))
            .subscribe(() => {
                this.eventListeners.unsubscribeEvents();
                this.handleGameOver();
            });
    }

    private checkWord(selectedCells: Array<HTMLElement>): void {
        const word = selectedCells.map(cell => cell.textContent).join('');
        if (this.hiddenWords.includes(word) && !this.foundWords.includes(word)) {
            selectedCells.forEach(item => (item.parentNode as HTMLElement).classList.add('found'));
            this.foundWords.push(word);
            this.gameStats.updateStats(word.length, this.hiddenWords, this.foundWords);
            this.showWordList(this.FOUND_WORDS, this.foundWords.join(', '));
            this.checkGameOver();
        } else if (this.foundWords.includes(word)) {
            selectedCells.forEach(item => (item.parentNode as HTMLElement).classList.add('already-found'));
        } else {
            if (!this.unknownWords.includes(word)) {
                this.unknownWords.push(word);
            }
            selectedCells.forEach(item => (item.parentNode as HTMLElement).classList.add('unknown'));
        }
        this.eventListeners.clearSelectedCells();
    }

    private readonly showWordList = (element: HTMLElement, words: string): void => {
        element.textContent = words;
        const parent = element.parentNode as HTMLElement;
        if (parent.classList.contains('hidden')) {
            parent.classList.remove('hidden');
        }
    };

    private checkGameOver(): void {
        if (this.hiddenWords.length === this.foundWords.length) {
            this.timer.stop();
            this.eventListeners.unsubscribeEvents();
            this.handleGameOver();
        }
    }

    private handleGameOver(): void {
        const notFoundWords = this.hiddenWords.filter(word => !this.foundWords.includes(word));
        this.gameOver.showGameOverModal(this.foundWords, notFoundWords, this.unknownWords);
    }

}

export default Game;
