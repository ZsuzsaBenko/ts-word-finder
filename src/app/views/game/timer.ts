import { map, Observable, Subject, Subscription, timer } from 'rxjs';

class Timer {
    timeIsUpGameOver: Observable<void>;
    private readonly TIMER_ELEMENT = document.querySelector('span.timer') as HTMLElement;
    private readonly TIME_LIMIT_IN_SEC = 180;
    private readonly timeIsUpGameOverSub = new Subject<void>();
    private timer?: Observable<number>;
    private timerSubscription?: Subscription;

    constructor() {
        this.timeIsUpGameOver = this.timeIsUpGameOverSub.asObservable();
    }

    start(): void {
        if (this.timer) {
            this.stop();
        }
        this.timer = timer(0, 1000);
        this.timerSubscription = this.timer
            .pipe(
                map(num => `${this.getMinutesLeft(num)}:${this.getSecondsLeft(num)}`))
            .subscribe(timeLeft => {
                this.TIMER_ELEMENT.textContent = timeLeft;
                if (timeLeft.startsWith('00:')) {
                    this.TIMER_ELEMENT.classList.add('warn');
                }
                if ('00:00' === timeLeft) {
                    this.stop();
                }
            });
    }

    stop(emit = true): void {
        if (emit) {
            this.timeIsUpGameOverSub.next();
        }
        this.timeIsUpGameOverSub.complete();
        this.timerSubscription?.unsubscribe();
        this.timer = undefined;
    }

    private getMinutesLeft(current: number): string {
        return `${Math.floor((this.TIME_LIMIT_IN_SEC - current) / 60)}`.padStart(2, '0');
    }

    private getSecondsLeft(current: number): string {
        return `${(this.TIME_LIMIT_IN_SEC - current) % 60}`.padStart(2, '0');
    }
}

export default Timer;
