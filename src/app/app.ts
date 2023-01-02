import Board from './board';
import { Cell } from './models';

class App {
    private readonly BOARD_CELLS = document.querySelectorAll('.board div span');
    private readonly FOUND_WORDS_STAT = document.querySelector('.found-words-stat') as HTMLElement;
    private readonly LENGTHS = document.querySelector('.lengths') as HTMLElement;
    private readonly ITEMS = document.querySelector('.items') as HTMLElement;
    private readonly FOUND_WORDS = document.querySelector('.found-words') as HTMLElement;
    private readonly UNKNOWN_WORDS = document.querySelector('.unknown-words') as HTMLElement;
    private readonly board = new Board();
    private readonly foundWords: Array<string> = [];
    private readonly unknownWords: Array<string> = [];
    private readonly hiddenWordsStat: Map<number, number> = new Map<number, number>();
    private readonly mouseDownEventListener: EventListener;
    private readonly mouseEnterEventListener: EventListener;
    private readonly mouseUpEventListener: EventListener;
    private hiddenWords: Array<string> = [];
    private selectedCells: Array<HTMLElement> = [];

    constructor() {
        this.mouseDownEventListener = (event: Event): void => this.onMouseDown(event);
        this.mouseEnterEventListener = (event: Event): void => this.onMouseEnter(event);
        this.mouseUpEventListener = (): void => this.onMouseUp();
    }

    play = (): void => {
        const gameBoard = this.board.initBoard();
        this.drawBoard(gameBoard);
        this.initStats();
        this.listenToMouseEvents();
    };

    private drawBoard(gameBoard: Map<number, Cell>): void {
        this.BOARD_CELLS.forEach(span => {
            const id: number = +span.id;
            span.textContent = gameBoard.get(id)?.value ?? '';
        });
    }

    private initStats(): void {
        this.hiddenWords = this.board.getWordsInBoard();
        this.setFoundWordsStat();

        this.hiddenWords.forEach(word => {
            const wordLength = word.length;
            const prev: number = this.hiddenWordsStat.get(wordLength) ?? 0;
            this.hiddenWordsStat.set(wordLength, prev + 1);
        });
        this.showInitialStats();
    }

    private setFoundWordsStat(): void {
        this.FOUND_WORDS_STAT.children[0].textContent = `${this.foundWords.length}`;
        this.FOUND_WORDS_STAT.children[2].textContent = `${this.hiddenWords.length}`;
    }

    private showInitialStats(): void {
        Array.from(this.hiddenWordsStat.keys())
            .forEach(num => {
                const lengthSpan = document.createElement('span');
                lengthSpan.textContent = `${num}`;
                this.LENGTHS?.appendChild(lengthSpan);
                const itemSpan = document.createElement('span');
                itemSpan.textContent = `${this.hiddenWordsStat.get(num)}`;
                itemSpan.setAttribute('id', `letter-${num}`);
                this.ITEMS?.appendChild(itemSpan);
            });
    }

    private listenToMouseEvents(): void {
        this.BOARD_CELLS.forEach(cell => {
            cell.addEventListener('mousedown', this.mouseDownEventListener);
            cell.addEventListener('mouseenter', this.mouseEnterEventListener);
            cell.addEventListener('mouseup', this.mouseUpEventListener);
        });
    }

    private onMouseDown(event: Event): void {
        event.preventDefault();
        this.addSelectedCell(event.target as HTMLElement);
    }

    private onMouseEnter(event: Event): void {
        if (!this.selectedCells.length) {
            return;
        }
        const selectedCell = event.target as HTMLElement;
        if (!this.selectedCells.includes(selectedCell)) {
            this.addSelectedCell(selectedCell);
        } else {
            this.clearSelectedCells();
        }
    }

    private onMouseUp(): void {
        if (3 > this.selectedCells.length) {
            this.clearSelectedCells();
            return;
        }
        this.checkWord();
    }

    private readonly addSelectedCell = (selectedCell: HTMLElement): void => {
        this.selectedCells.push(selectedCell);
        (selectedCell.parentNode as HTMLElement).classList.add('selected');
    };

    private clearSelectedCells(): void {
        setTimeout(() => {
            this.selectedCells.forEach(item => (item.parentNode as HTMLElement).classList.remove('selected', 'already-found'));
            this.selectedCells = [];
        }, 500);

    }

    private checkWord(): void {
        const word: string = this.selectedCells.map(cell => cell.textContent)
            .join('');
        if (this.hiddenWords.includes(word) && !this.foundWords.includes(word)) {
            this.foundWords.push(word);
            this.setFoundWordsStat();
            this.updateHiddenWordStats(word.length);
            this.showWordList(this.FOUND_WORDS, this.foundWords.join(', '));
            this.clearSelectedCells();
            this.checkGameOver();
        } else if (this.foundWords.includes(word)) {
            this.selectedCells.forEach(item => (item.parentNode as HTMLElement).classList.add('already-found'));
            this.clearSelectedCells();
        } else {
            this.unknownWords.push(word);
            this.showWordList(this.UNKNOWN_WORDS, this.unknownWords.join(', '));
            this.clearSelectedCells();
        }
    }

    private checkGameOver(): void {
        if (this.hiddenWords.length === this.foundWords.length) {
            this.BOARD_CELLS.forEach(cell => {
                cell.removeEventListener('mousedown', this.mouseDownEventListener);
                cell.removeEventListener('mouseenter', this.mouseEnterEventListener);
                cell.removeEventListener('mouseup', this.mouseUpEventListener);
            });
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

    private updateHiddenWordStats(wordLength: number): void {
        const current = this.hiddenWordsStat.get(wordLength) ?? 0;
        this.hiddenWordsStat.set(wordLength, Math.max(0, current - 1));
        Array.from(this.hiddenWordsStat.keys())
            .forEach(num => {
                const itemSpan = this.ITEMS.querySelector(`#letter-${num}`) as HTMLElement;
                itemSpan.textContent = `${this.hiddenWordsStat.get(num)}`;
            });
    }

}

export default App;
