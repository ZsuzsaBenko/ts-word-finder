import { fromEvent } from 'rxjs';
import { GAME_RESULTS_STORAGE_KEY, StoredResults, Language, GameResult, Cell } from '../../models';
import { drawBoard } from '../../util/draw-board-util';
import { attachTemplateToDOM } from '../../util/template-util';

class GameOver {
    private readonly RESULTS = document.querySelector('.results') as HTMLElement;
    private readonly WIN_MESSAGE = document.querySelector('.results .win') as HTMLElement;
    private readonly LOST_GAME = document.querySelector('.results .lost') as HTMLElement;
    private readonly FOUND_WORDS = document.querySelector('.results .found-words') as HTMLElement;
    private readonly NOT_FOUND_WORDS = document.querySelector('.results .not-found-words') as HTMLElement;
    private readonly UNKNOWN_WORDS = document.querySelector('.results .unknown-words') as HTMLElement;
    private readonly NEW_GAME_BTN = document.querySelector('.game-over button') as HTMLElement;

    showResult(gameResult: GameResult, gameBoard: Map<number, Cell>, language: Language): void {
        this.saveResult(gameResult.foundWords.length, gameResult.notFoundWords.length, language);
        const win = !gameResult.notFoundWords.length;
        if (!win) {
            this.showLostGame(gameResult);
        } else {
            this.removeHiddenClass(this.WIN_MESSAGE);
        }
        this.showBoard(gameBoard, win);
        this.removeHiddenClass(this.RESULTS);
        this.handleBtnClick();
    }

    private showLostGame(gameResult: GameResult): void {
        const {foundWords, notFoundWords, unknownWords} = gameResult;
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
            .subscribe();
    }

    private readonly removeHiddenClass = (element: HTMLElement): void => {
        element.classList.remove('hidden');
    };

    private readonly saveResult = (foundWordsNum: number, notFoundWordsNum: number, language: Language): void => {
        const currentPercentage = foundWordsNum / (foundWordsNum + notFoundWordsNum) * 100;
        const formerResults = localStorage.getItem(GAME_RESULTS_STORAGE_KEY);
        const results: StoredResults | undefined = formerResults ? JSON.parse(formerResults) : undefined;

        let result: StoredResults;
        if (results) {
            result = {
                hu: Language.HU === language ? [...results.hu, currentPercentage] : results.hu,
                en: Language.EN === language ? [...results.en, currentPercentage] : results.en
            };
        } else {
            result = {
                hu: Language.HU === language ? [currentPercentage] : [],
                en: Language.EN === language ? [currentPercentage] : []
            };
        }
        localStorage.setItem(GAME_RESULTS_STORAGE_KEY, JSON.stringify(result));
    };
}

export default GameOver;
