import { take } from 'rxjs';
import Board from '../../game-logic/board';
import { Cell, GameResult, Language } from '../../models';
import { drawBoard } from '../../util/draw-board-util';
import { removeHiddenClass } from '../../util/hidden-class-util';
import { attachTemplateToDOM } from '../../util/template-util';
import GameOver from '../game-over/game-over';
import EventListeners from './event-listeners';
import GameStats from './game-stats';
import Timer from './timer';

class Game {
    private readonly MAIN = document.querySelector('main') as HTMLElement;
    private readonly FOUND_WORDS = document.querySelector('.word-list .found-words') as HTMLElement;
    private readonly ONE_EXTRA_MINUTE_ALLOWED_MAX_WORD_NUMBER = 18;
    private readonly TWO_EXTRA_MINUTES_ALLOWED_MAX_WORD_NUMBER = 24;
    private readonly board = new Board();
    private readonly timer = new Timer();
    private readonly gameStats = new GameStats();
    private readonly eventListeners = new EventListeners();
    private readonly foundWords: Array<string> = [];
    private readonly unknownWords: Array<string> = [];
    private boardCells: NodeListOf<HTMLElement>;
    private gameBoard!: Map<number, Cell>;
    private hiddenWords: Array<string> = [];
    private language!: Language;

    play = (language: Language): void => {
        window.scrollTo(0, 0);
        this.language = language;
        this.createBoard();
        this.hiddenWords = this.board.getWordsInBoard();
        this.timer.setAllowedExtraMinutes(this.getAllowedExtraMinutes());
        this.gameStats.initStats(this.hiddenWords, this.foundWords);
        this.subscribeToDOMEvents();
        this.subscribeToTimer();
    };

    private createBoard(): void {
        attachTemplateToDOM('board', false, this.MAIN);
        this.gameBoard = this.board.initBoard(this.language);
        this.boardCells = document.querySelectorAll('.board div span');
        drawBoard(this.gameBoard, this.boardCells);
    }

    private getAllowedExtraMinutes(): number {
        if (this.ONE_EXTRA_MINUTE_ALLOWED_MAX_WORD_NUMBER > this.hiddenWords.length) {
            return 1;
        }
        if (this.TWO_EXTRA_MINUTES_ALLOWED_MAX_WORD_NUMBER > this.hiddenWords.length) {
            return 2;
        }
        return 3;
    }

    private subscribeToDOMEvents(): void {
        this.eventListeners.listenToEvents(this.boardCells);
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
        const word = selectedCells.map(cell => cell.textContent)
            .join('');
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
            removeHiddenClass(parent);
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
        document.body.removeChild(this.MAIN);
        attachTemplateToDOM('game-over');
        this.showResult();
    }

    private showResult(): void {
        const gameOver = new GameOver();
        gameOver.showResult(this.createGameResult(), this.gameBoard, this.language);
    }

    private createGameResult(): GameResult {
        return {
            foundWords: this.foundWords,
            notFoundWords: this.hiddenWords.filter(word => !this.foundWords.includes(word)),
            unknownWords: this.unknownWords,
            time: this.timer.getTime()
        };
    }

}

export default Game;
