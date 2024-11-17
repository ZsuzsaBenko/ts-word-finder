import { fromEvent, Subject, take, takeUntil } from 'rxjs';
import { GAME_RESULTS_STORAGE_KEY, Language, StoredResults } from '../../models';
import { addHiddenClass, removeHiddenClass } from '../../util/hidden-class-util';
import { attachTemplateToDOM } from '../../util/template-util';
import { getMinutes, getSeconds } from '../../util/time-formatter-util';
import Game from '../game/game';

class Intro {
    private readonly unsubscribeSub = new Subject<void>();

    start(): void {
        window.scrollTo(0, 0);
        setTimeout(() => {
            attachTemplateToDOM('intro');
            this.showResultStatistics();
            this.startGame();
            this.handleRulesBtnClick();
        });
    }

    private showResultStatistics(): void {
        const storedResults = localStorage.getItem(GAME_RESULTS_STORAGE_KEY);
        if (!storedResults) {
            return;
        }
        const results: StoredResults = JSON.parse(storedResults);
        const huResults = results.hu;
        const enResults = results.en;

        const sumHu = document.querySelector('td#sum-hu') as HTMLElement;
        sumHu.textContent = `${huResults.games.length}`;
        const sumEn = document.querySelector('td#sum-en') as HTMLElement;
        sumEn.textContent = `${enResults.games.length}`;

        const winHu = document.querySelector('td#win-hu') as HTMLElement;
        winHu.textContent = `${this.countWinNumber(huResults.games)}`;
        const winEn = document.querySelector('td#win-en') as HTMLElement;
        winEn.textContent = `${this.countWinNumber(enResults.games)}`;

        const averageHu = document.querySelector('td#average-hu') as HTMLElement;
        averageHu.textContent = huResults.games.length ? `${this.countAveragePercentage(huResults.games)}%` : '-';
        const averageEn = document.querySelector('td#average-en') as HTMLElement;
        averageEn.textContent = enResults.games.length ? `${this.countAveragePercentage(enResults.games)}%` : '-';

        const bestTimeHu = document.querySelector('td#best-time-hu') as HTMLElement;
        bestTimeHu.textContent = 0 < huResults.bestTime ? this.formatTime(huResults.bestTime) : '-';
        const bestTimeEn = document.querySelector('td#best-time-en') as HTMLElement;
        bestTimeEn.textContent = 0 < enResults.bestTime ? this.formatTime(enResults.bestTime) : '-';
    }

    private readonly countWinNumber = (percentageArr: Array<number>): number => {
        if (percentageArr.length) {
            return percentageArr.filter(value => 100 === value).length;
        }
        return 0;
    };

    private readonly countAveragePercentage = (percentageArr: Array<number>): number => {
        if (percentageArr.length) {
            return Math.round((percentageArr.reduce((prev, cur) => prev + cur, 0)) / percentageArr.length);
        }
        return 0;
    };

    private readonly formatTime = (time: number): string => {
        if (60 > time) {
            return `00:${time}`;
        }
        return `${getMinutes(time)}:${getSeconds(time)}`;
    };

    private startGame(): void {
        const startBtn = document.querySelector('#start-btn') as HTMLButtonElement;
        fromEvent(startBtn, 'click', this.handleStartBtnClick.bind(this))
            .pipe(take(1))
            .subscribe();
    }

    private handleStartBtnClick(): void {
        this.removeSubscription();
        const main = document.querySelector('main') as HTMLElement;
        const formData = new FormData(main.querySelector('form') as HTMLFormElement);
        const selectedLang = Language.EN === formData.get('language') ? Language.EN : Language.HU;

        document.body.removeChild(main);
        attachTemplateToDOM('game');

        const app = new Game();
        app.play(selectedLang);
    }

    private handleRulesBtnClick(): void {
        const rulesBtn = document.querySelector('.rules-btn') as HTMLElement;
        const rules = document.querySelector('div.rules') as HTMLElement;

        fromEvent(rulesBtn, 'click', () => {
            if (rules.classList.contains('hidden')) {
                removeHiddenClass(rules);
            } else {
                addHiddenClass(rules);
            }
        })
            .pipe(takeUntil(this.unsubscribeSub))
            .subscribe();
    }

    private removeSubscription(): void {
        this.unsubscribeSub.next();
        this.unsubscribeSub.complete();
    }
}

export default Intro;
