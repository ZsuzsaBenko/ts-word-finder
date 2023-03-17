import { fromEvent, Subject, take, takeUntil } from 'rxjs';
import { GAME_RESULTS_STORAGE_KEY, StoredResults, Language } from '../../models';
import { attachTemplateToDOM } from '../../util/template-util';
import Game from '../game/game';

class Intro {
    private readonly unsubscribeSub = new Subject<void>();

    start(): void {
        attachTemplateToDOM('intro');
        this.showResultStatistics();
        this.startGame();
        this.handleRulesBtnClick();
    }

    private showResultStatistics(): void {
        const storedResults = localStorage.getItem(GAME_RESULTS_STORAGE_KEY);
        if (storedResults) {
            const results: StoredResults = JSON.parse(storedResults);
            const sumHu = document.querySelector('td#sum-hu') as HTMLElement;
            sumHu.textContent = `${results.hu.length}`;
            const sumEn = document.querySelector('td#sum-en') as HTMLElement;
            sumEn.textContent = `${results.en.length}`;
            const averageHu = document.querySelector('td#average-hu') as HTMLElement;
            averageHu.textContent = `${this.countAveragePercentage(results.hu)}%`;
            const averageEn = document.querySelector('td#average-en') as HTMLElement;
            averageEn.textContent = `${this.countAveragePercentage(results.en)}%`;
        }
    }

    private readonly countAveragePercentage = (percentageArr: Array<number>): number => {
        if (percentageArr.length) {
            return Math.round((percentageArr.reduce((prev, cur) => prev + cur, 0)) / percentageArr.length);
        }
        return 0;
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
                rules.classList.remove('hidden');
            } else {
                rules.classList.add('hidden');
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
