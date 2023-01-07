import { take } from 'rxjs';
import Board from './board';
import EventListeners from './event-listeners';
import GameStats from './game-stats';
import { Cell } from './models';
import Timer from './timer';

class Game {
    private readonly BOARD_CELLS = document.querySelectorAll('.board div span');
    private readonly FOUND_WORDS = document.querySelector('.found-words') as HTMLElement;
    private readonly UNKNOWN_WORDS = document.querySelector('.unknown-words') as HTMLElement;
    private readonly board = new Board();
    private readonly timer = new Timer();
    private readonly gameStats = new GameStats();
    private readonly eventListeners = new EventListeners();
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
        this.eventListeners.listenToMouseEvents();
        this.eventListeners.wordSelected
            .subscribe((selectedCells: Array<HTMLElement>) => this.checkWord(selectedCells));
    }

    private subscribeToTimer(): void {
        this.timer.start();
        this.timer.timeIsUpGameOver
            .pipe(take(1))
            .subscribe(() => this.eventListeners.unsubscribeEvents());
    }

    private checkWord(selectedCells: Array<HTMLElement>): void {
        const word = selectedCells.map(cell => cell.textContent)
            .join('');
        if (this.hiddenWords.includes(word) && !this.foundWords.includes(word)) {
            this.foundWords.push(word);
            this.gameStats.updateStats(word.length, this.hiddenWords, this.foundWords);
            this.showWordList(this.FOUND_WORDS, this.foundWords.join(', '));
            this.checkGameOver();
        } else if (this.foundWords.includes(word)) {
            selectedCells.forEach(item => (item.parentNode as HTMLElement).classList.add('already-found'));
        } else {
            if (!this.unknownWords.includes(word)) {
                this.unknownWords.push(word);
                this.showWordList(this.UNKNOWN_WORDS, this.unknownWords.join(', '));
            }
        }
        this.eventListeners.clearSelectedCells();
    }

    private checkGameOver(): void {
        if (this.hiddenWords.length === this.foundWords.length) {
            this.timer.stop();
            this.eventListeners.unsubscribeEvents();
            alert('Congratulations!');
        }
    }

    private readonly showWordList = (element: HTMLElement, words: string): void => {
        element.textContent = words;
        const parent = element.parentNode as HTMLElement;
        if (parent.classList.contains('hidden')) {
            parent.classList.remove('hidden');
        }
    };

}

export default Game;
