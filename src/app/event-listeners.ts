import { delay, fromEvent, Observable, of, Subject, takeUntil } from 'rxjs';

class EventListeners {
    wordSelected: Observable<Array<HTMLElement>>;
    private readonly BOARD_CELLS = document.querySelectorAll('.board div span');
    private readonly wordSelectedSub = new Subject<Array<HTMLElement>>();
    private readonly unsubscribeSub = new Subject<void>();
    private selectedCells: Array<HTMLElement> = [];

    constructor() {
        this.wordSelected = this.wordSelectedSub.asObservable();
    }

    listenToEvents(): void {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.listenToTouchEvents();
        } else {
            this.listenToMouseEvents();
        }
    }

    private listenToMouseEvents(): void {
        this.BOARD_CELLS.forEach(cell => {
            fromEvent(cell, 'mousedown', this.onStart.bind(this))
                .pipe(takeUntil(this.unsubscribeSub))
                .subscribe();
            fromEvent(cell, 'mouseenter', this.onMouseEnter.bind(this))
                .pipe(takeUntil(this.unsubscribeSub))
                .subscribe();
            fromEvent(cell, 'mouseup', this.onFinish.bind(this))
                .pipe(takeUntil(this.unsubscribeSub))
                .subscribe();
        });

    }

    private listenToTouchEvents(): void {
        this.BOARD_CELLS.forEach(cell => {
            fromEvent(cell, 'touchstart', this.onStart.bind(this))
                .pipe(takeUntil(this.unsubscribeSub))
                .subscribe();
            fromEvent(cell, 'touchmove', this.onTouchMove.bind(this))
                .pipe(takeUntil(this.unsubscribeSub))
                .subscribe();
            fromEvent(cell, 'touchend', this.onFinish.bind(this))
                .pipe(takeUntil(this.unsubscribeSub))
                .subscribe();
        });
    }

    clearSelectedCells(cells?: Array<HTMLElement>): void {
        of(true)
            .pipe(delay(200))
            .subscribe(() => {
                const classesToRemove = ['selected', 'found', 'already-found', 'unknown'];
                if (cells) {
                    cells.forEach(item => (item.parentNode as HTMLElement).classList.remove(...classesToRemove));
                } else {
                    this.selectedCells.forEach(item => (item.parentNode as HTMLElement).classList.remove(...classesToRemove));
                    this.selectedCells = [];
                }
            });
    }

    unsubscribeEvents(): void {
        this.unsubscribeSub.next();
        this.unsubscribeSub.complete();
        this.wordSelectedSub.complete();
    }

    private onStart(event: Event): void {
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
            this.checkNeighbours();
        } else if (selectedCell === this.selectedCells[this.selectedCells.length - 2]) {
            const lastCell = this.selectedCells.pop() as HTMLElement;
            this.clearSelectedCells([lastCell]);
        } else {
            this.clearSelectedCells();
        }
    }

    private onTouchMove(event: Event): void {
        event.preventDefault();
        if (!this.selectedCells.length) {
            return;
        }
        const xPos = (event as TouchEvent).touches[0].clientX;
        const yPos = (event as TouchEvent).touches[0].clientY;
        const selectedCell = Array.from(this.BOARD_CELLS)
            .find(cell => {
                const clientRect = cell.getBoundingClientRect();
                return xPos > clientRect.left && xPos < clientRect.right && yPos > clientRect.top && yPos < clientRect.bottom;
            }) as HTMLElement;
        if (!selectedCell) {
            return;
        }
        if (!this.selectedCells.includes(selectedCell)) {
            this.addSelectedCell(selectedCell);
            this.checkNeighbours();
        } else if (selectedCell === this.selectedCells[this.selectedCells.length - 2]) {
            const lastCell = this.selectedCells.pop() as HTMLElement;
            this.clearSelectedCells([lastCell]);
        } else if (selectedCell !== this.selectedCells[this.selectedCells.length - 1]) {
            this.clearSelectedCells();
        }
    }

    private readonly addSelectedCell = (selectedCell: HTMLElement): void => {
        this.selectedCells.push(selectedCell);
        (selectedCell.parentNode as HTMLElement).classList.add('selected');
    };

    private checkNeighbours(): void {
        const neighbours = new Map<string, Array<string>>(
            [
                ['0', ['1', '3', '4']],
                ['1', ['0', '2', '3', '4', '5']],
                ['2', ['1', '4', '5']],
                ['3', ['0', '1', '4', '6', '7']],
                ['4', ['0', '1', '2', '3', '5', '6', '7', '8']],
                ['5', ['1', '2', '4', '7', '8']],
                ['6', ['3', '4', '7']],
                ['7', ['3', '4', '5', '6', '8']],
                ['8', ['4', '5', '7']]
            ]
        );
        for (let i = 1; i < this.selectedCells.length; i++) {
            const neighboursOfPrevCell = neighbours.get(this.selectedCells[i - 1].id);
            if (!neighboursOfPrevCell?.includes(this.selectedCells[i].id)) {
                this.clearSelectedCells();
                return;
            }
        }
    }

    private onFinish(): void {
        if (3 > this.selectedCells.length) {
            this.clearSelectedCells();
            return;
        }
        this.wordSelectedSub.next(this.selectedCells);
    }
}

export default EventListeners;
