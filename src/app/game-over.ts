import { fromEvent } from 'rxjs';

class GameOver {
    private readonly OVERLAY = document.querySelector('.game-over-overlay') as HTMLElement;
    private readonly MODAL = document.querySelector('.game-over') as HTMLElement;
    private readonly WIN_MESSAGE = document.querySelector('.game-over .win') as HTMLElement;
    private readonly LOST_GAME = document.querySelector('.game-over .lost') as HTMLElement;
    private readonly FOUND_WORDS = document.querySelector('.game-over .found-words') as HTMLElement;
    private readonly NOT_FOUND_WORDS = document.querySelector('.game-over .not-found-words') as HTMLElement;
    private readonly UNKNOWN_WORDS = document.querySelector('.game-over .unknown-words') as HTMLElement;
    private readonly NEW_GAME_BTN = document.querySelector('.game-over button') as HTMLElement;

    showGameOverModal(foundWords: Array<string>, notFoundWords: Array<string>, unknownWords: Array<string>): void {
        if (notFoundWords.length) {
            this.removeHiddenClass(this.NOT_FOUND_WORDS.parentNode as HTMLElement);
            this.NOT_FOUND_WORDS.textContent = notFoundWords.join(', ');
            if (foundWords.length) {
                this.removeHiddenClass(this.FOUND_WORDS.parentNode as HTMLElement);
                this.FOUND_WORDS.textContent = foundWords.join(', ');
            }
            if (unknownWords.length) {
                this.removeHiddenClass(this.UNKNOWN_WORDS.parentNode as HTMLElement);
                this.UNKNOWN_WORDS.textContent = unknownWords.join(', ');
            }
            this.removeHiddenClass(this.LOST_GAME);
        } else {
            this.removeHiddenClass(this.WIN_MESSAGE);
        }
        this.removeHiddenClass(this.OVERLAY);
        this.removeHiddenClass(this.MODAL);
        this.handleBtnClick();
    }

    private handleBtnClick(): void {
        fromEvent(this.NEW_GAME_BTN, 'click', () => {
            window.location.reload();
        })
            .subscribe();
    }

    private readonly removeHiddenClass = (element: HTMLElement): void => {
        element.classList.remove('hidden');
    };
}

export default GameOver;
