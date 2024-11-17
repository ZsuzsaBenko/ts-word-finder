import { fromEvent, Observable, Subject, Subscription, take, timer } from 'rxjs';
import { addHiddenClass, removeHiddenClass } from '../../util/hidden-class-util';
import { getMinutes, getSeconds } from '../../util/time-formatter-util';

class Timer {
    timeIsUpGameOver: Observable<void>;
    private readonly TIMER_ELEMENT = document.querySelector('span.timer') as HTMLElement;
    private readonly EXTRA_TIME_ELEMENT = document.querySelector('.extra-time') as HTMLElement;
    private readonly TIME_LIMIT_IN_SEC = 120;
    private readonly EXTRA_TIME_IN_SEC = 60;
    private readonly secondsSinceStart: Array<number> = [0];
    private readonly timeIsUpGameOverSub = new Subject<void>();
    private timeLimitInSec = this.TIME_LIMIT_IN_SEC;
    private timer?: Observable<number>;
    private timerSubscription?: Subscription;
    private extraTimeClickSubscription?: Subscription;
    private extraTimeAllowedNumber = 0;

    constructor() {
        this.timeIsUpGameOver = this.timeIsUpGameOverSub.asObservable();
    }

    start(): void {
        if (this.timer) {
            this.stop();
        }
        this.timer = timer(0, 1000);
        this.timerSubscription = this.timer
            .subscribe(num => {
                this.secondsSinceStart[this.secondsSinceStart.length - 1] = num;
                const timeLeft = `${this.getMinutesLeft()}:${this.getSecondsLeft()}`;
                this.TIMER_ELEMENT.textContent = timeLeft;

                if (timeLeft.startsWith('00:')) {
                    this.TIMER_ELEMENT.classList.add('warn');
                    if (this.secondsSinceStart.length <= this.extraTimeAllowedNumber) {
                        removeHiddenClass(this.EXTRA_TIME_ELEMENT);
                        this.handleExtraTimeClick();
                    }
                }
                if ('00:00' === timeLeft) {
                    this.stop();
                    this.timeIsUpGameOverSub.next();
                    this.timeIsUpGameOverSub.complete();
                }
            });
    }

    stop(): void {
        this.timerSubscription?.unsubscribe();
        this.timer = undefined;
        this.extraTimeClickSubscription?.unsubscribe();
        this.extraTimeClickSubscription = undefined;
    }

    getTime(): number {
        return this.sumSecondsSinceStart();
    }

    setAllowedExtraMinutes(extraAllowed: number): void {
        this.extraTimeAllowedNumber = extraAllowed;
    }

    private getMinutesLeft(): string {
        return getMinutes(this.timeLimitInSec - this.sumSecondsSinceStart());
    }

    private getSecondsLeft(): string {
        return getSeconds(this.timeLimitInSec - this.sumSecondsSinceStart());
    }

    private readonly sumSecondsSinceStart = (): number => this.secondsSinceStart.reduce((acc, curr) => acc + curr, 0);

    private handleExtraTimeClick(): void {
        if (this.extraTimeClickSubscription) {
            return;
        }
        this.extraTimeClickSubscription = fromEvent(this.EXTRA_TIME_ELEMENT, 'click', this.addExtraTime.bind(this))
            .pipe(take(1))
            .subscribe();
    }

    private addExtraTime(): void {
        this.stop();
        this.secondsSinceStart.push(0);
        this.timeLimitInSec = this.timeLimitInSec + this.EXTRA_TIME_IN_SEC;
        this.start();
        this.TIMER_ELEMENT.classList.remove('warn');
        addHiddenClass(this.EXTRA_TIME_ELEMENT);
    }
}

export default Timer;
