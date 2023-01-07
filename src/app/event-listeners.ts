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

    listenToMouseEvents(): void {
        this.BOARD_CELLS.forEach(cell => {
            fromEvent(cell, 'mousedown', this.onMouseDown.bind(this))
                .pipe(takeUntil(this.unsubscribeSub))
                .subscribe();
            fromEvent(cell, 'mouseenter', this.onMouseEnter.bind(this))
                .pipe(takeUntil(this.unsubscribeSub))
                .subscribe();
            fromEvent(cell, 'mouseup', this.onMouseUp.bind(this))
                .pipe(takeUntil(this.unsubscribeSub))
                .subscribe();
        });

    }

    listenToTouchEvents(): void {
        // TODO
    }

    clearSelectedCells(): void {
        of(true)
            .pipe(delay(300))
            .subscribe(() => {
                this.selectedCells.forEach(item => (item.parentNode as HTMLElement).classList.remove('selected', 'already-found'));
                this.selectedCells = [];
            });
    }

    unsubscribeEvents(): void {
        this.unsubscribeSub.next();
        this.unsubscribeSub.complete();
        this.wordSelectedSub.complete();
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
        this.wordSelectedSub.next(this.selectedCells);
    }

    private readonly addSelectedCell = (selectedCell: HTMLElement): void => {
        this.selectedCells.push(selectedCell);
        (selectedCell.parentNode as HTMLElement).classList.add('selected');
    };
}

export default EventListeners;
