import { fromEvent, take } from 'rxjs';
import { GAME_RESULTS_STORAGE_KEY, StoredResults, Language, GameResult, Cell } from '../../models';
import { drawBoard } from '../../util/draw-board-util';
import { removeHiddenClass } from '../../util/hidden-class-util';
import { attachTemplateToDOM } from '../../util/template-util';

class GameOver {
    private readonly RESULTS = document.querySelector('.results') as HTMLElement;
    private readonly WIN_MESSAGE = document.querySelector('.results .win') as HTMLElement;
    private readonly PERCENTAGE = document.querySelector('.results .percentage > span') as HTMLElement;
    private readonly LOST_GAME = document.querySelector('.results .lost') as HTMLElement;
    private readonly FOUND_WORDS = document.querySelector('.results .found-words') as HTMLElement;
    private readonly NOT_FOUND_WORDS = document.querySelector('.results .not-found-words') as HTMLElement;
    private readonly UNKNOWN_WORDS = document.querySelector('.results .unknown-words') as HTMLElement;
    private readonly NEW_GAME_BTN = document.querySelector('.game-over button') as HTMLElement;

    showResult(gameResult: GameResult, gameBoard: Map<number, Cell>, language: Language): void {
        window.scrollTo(0, 0);
        this.saveResult(gameResult, language);
        const win = !gameResult.notFoundWords.length;
        if (!win) {
            this.showLostGame(gameResult);
        } else {
            removeHiddenClass(this.WIN_MESSAGE);
        }
        this.showBoard(gameBoard, win);
        removeHiddenClass(this.RESULTS);
        this.handleBtnClick();
    }

    private showLostGame(gameResult: GameResult): void {
        const {foundWords, notFoundWords, unknownWords} = gameResult;
        removeHiddenClass(this.NOT_FOUND_WORDS.parentNode as HTMLElement);
        this.NOT_FOUND_WORDS.textContent = notFoundWords.join(', ');
        if (foundWords.length) {
            removeHiddenClass(this.FOUND_WORDS.parentNode as HTMLElement);
            this.FOUND_WORDS.textContent = foundWords.join(', ');
        }
        if (unknownWords.length) {
            removeHiddenClass(this.UNKNOWN_WORDS.parentNode as HTMLElement);
            this.UNKNOWN_WORDS.textContent = unknownWords.join(', ');
        }
        const percentage = Math.round(foundWords.length / (foundWords.length + notFoundWords.length) * 100);
        this.PERCENTAGE.textContent = `${percentage}%`;
        removeHiddenClass(this.LOST_GAME);
        removeHiddenClass(this.PERCENTAGE.parentNode as HTMLElement);
    }

    private readonly showBoard = (gameBoard: Map<number, Cell>, win: boolean): void => {
        attachTemplateToDOM('board', true, this.RESULTS);
        const board = document.querySelector('.board') as HTMLElement;
        if (win) {
            board.classList.add('win');
        }
        const boardCells: NodeListOf<HTMLElement> = document.querySelectorAll('.board div span');
        drawBoard(gameBoard, boardCells);
    };

    private handleBtnClick(): void {
        fromEvent(this.NEW_GAME_BTN, 'click', () => {
            window.location.reload();
        })
            .pipe(take(1))
            .subscribe();
    }

    private readonly saveResult = (gameResult: GameResult, language: Language): void => {
        const foundWordsNum = gameResult.foundWords.length;
        const notFoundWordsNum = gameResult.notFoundWords.length;
        const currentPercentage = foundWordsNum / (foundWordsNum + notFoundWordsNum) * 100;

        const formerResults = localStorage.getItem(GAME_RESULTS_STORAGE_KEY);
        const results: StoredResults | undefined = formerResults ? JSON.parse(formerResults) : undefined;

        let result: StoredResults;
        if (results) {
            result = {
                hu: Language.HU === language ? {
                    games: [...results.hu.games, currentPercentage],
                    bestTime: this.getBestTime(results.hu.bestTime, gameResult.time)
                } : results.hu,
                en: Language.EN === language ? {
                    games: [...results.en.games, currentPercentage],
                    bestTime: this.getBestTime(results.en.bestTime, gameResult.time)
                } : results.en
            };
        } else {
            result = {
                hu: Language.HU === language ? {games: [currentPercentage], bestTime: gameResult.time} : {games: [], bestTime: 0},
                en: Language.EN === language ? {games: [currentPercentage], bestTime: gameResult.time} : {games: [], bestTime: 0}
            };
        }
        localStorage.setItem(GAME_RESULTS_STORAGE_KEY, JSON.stringify(result));
    };

    private readonly getBestTime = (time1: number, time2: number): number => {
        if (0 === time1) {
            return time2;
        } else if (0 === time2) {
            return time1;
        }
        return Math.min(time1, time2);
    };
}

export default GameOver;
