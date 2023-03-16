import { Cell, Language, LANGUAGE_PROPERTIES, Words, WordsByLetter } from '../models';
import { wordsEng } from '../words/words-eng';
import { wordsHun } from '../words/words-hun';

class Board {
    private readonly MIN_WORD_NUMBER = 12;
    private dictionary!: Words;
    private letters!: Array<string>;
    private board!: Map<number, Cell>;
    private wordsToFind: Array<string> = [];

    initBoard(language: Language): Map<number, Cell> {
        this.dictionary = Language.EN === language ? wordsEng : wordsHun;
        this.letters = Language.EN === language ? Object.keys(wordsEng) : Object.keys(wordsHun);
        this.createBoard();
        while (this.MIN_WORD_NUMBER > this.wordsToFind.length) {
            this.populateBoard(language);
            this.getWordsInBoard();
            if (this.MIN_WORD_NUMBER > this.wordsToFind.length) {
                this.clearBoard();
            }
        }
        return this.board;
    }

    getWordsInBoard(): Array<string> {
        if (0 < this.wordsToFind.length) {
            return this.wordsToFind;
        }
        const twoCellCombos = this.getCellCombinations(Array.from(this.board.keys())
            .map(num => [num]));

        const threeCellCombos = this.getCellCombinations(twoCellCombos);
        const threeLetterWords = this.getRealWords(this.getLetterCombinations(threeCellCombos));
        this.wordsToFind.push(...threeLetterWords);

        const fourCellCombos = this.getCellCombinations(threeCellCombos);
        const fourLetterWords = this.getRealWords(this.getLetterCombinations(fourCellCombos));
        this.wordsToFind.push(...fourLetterWords);

        const fiveCellCombos = this.getCellCombinations(fourCellCombos);
        const fiveLetterWords = this.getRealWords(this.getLetterCombinations(fiveCellCombos));
        this.wordsToFind.push(...fiveLetterWords);

        const sixCellCombos = this.getCellCombinations(fiveCellCombos);
        const sixLetterWords = this.getRealWords(this.getLetterCombinations(sixCellCombos));
        this.wordsToFind.push(...sixLetterWords);

        const sevenCellCombos = this.getCellCombinations(sixCellCombos);
        const sevenLetterWords = this.getRealWords(this.getLetterCombinations(sevenCellCombos));
        this.wordsToFind.push(...sevenLetterWords);

        return this.wordsToFind;
    }

    clearBoard(): void {
        this.wordsToFind = [];
        this.board.forEach(cell => cell.value = '');
    }

    private createBoard(): void {
        this.board = new Map<number, Cell>();
        for (let i = 0; 9 > i; i++) {
            this.addCell(i);
        }
    }

    private addCell(i: number): void {
        const cell: Cell = {
            value: '',
            neighbours: []
        };
        switch (i) {
            case 0:
                cell.neighbours = [1, 3, 4];
                break;
            case 1:
                cell.neighbours = [0, 2, 3, 4, 5];
                break;
            case 2:
                cell.neighbours = [1, 4, 5];
                break;
            case 3:
                cell.neighbours = [0, 1, 4, 6, 7];
                break;
            case 4:
                cell.neighbours = [0, 1, 2, 3, 5, 6, 7, 8];
                break;
            case 5:
                cell.neighbours = [1, 2, 4, 7, 8];
                break;
            case 6:
                cell.neighbours = [3, 4, 7];
                break;
            case 7:
                cell.neighbours = [3, 4, 5, 6, 8];
                break;
            case 8:
                cell.neighbours = [4, 5, 7];
                break;
            default:
                cell.neighbours = [];
        }
        this.board.set(i, cell);
    }

    private populateBoard(language: Language): void {
        const randomLongestWord = this.getRandomLongestWord();
        this.placeLongestWord(randomLongestWord);
        this.fillInEmptyCells(language);
    }

    private readonly getRandomLongestWord = (): string => {
        let longestWord = '';
        while (!longestWord) {
            const randomLetter: string = this.letters[Math.floor(Math.random() * this.letters.length)];
            const randomLength: string = 0.5 < Math.random() ? '7' : '6';
            const wordsWithRandomLetterAtRandomLength = this.dictionary[randomLetter as keyof Words][randomLength as keyof WordsByLetter];
            if (0 < wordsWithRandomLetterAtRandomLength.length) {
                longestWord = wordsWithRandomLetterAtRandomLength[Math.floor(Math.random() * wordsWithRandomLetterAtRandomLength.length)];
            }
        }
        return longestWord;
    };

    private placeLongestWord(longestWord: string): void {
        let cellNumber: number = Math.floor(Math.random() * Array.from(this.board.keys()).length);
        let i = 0;
        while (i < longestWord.length) {
            const char: string = longestWord.charAt(i);
            const currentCell = this.board.get(cellNumber) as Cell;
            this.board.set(cellNumber, {...currentCell, value: char});
            const freeNeighbours: Array<number> = currentCell.neighbours.filter(cellNum => !this.board.get(cellNum)?.value);
            if (0 < freeNeighbours.length) {
                cellNumber = freeNeighbours[Math.floor(Math.random() * freeNeighbours.length)];
                i++;
            } else {
                this.board.forEach(entry => entry.value = '');
                i = 0;
            }
        }
    }

    private fillInEmptyCells(language: Language): void {
        const allVowels = LANGUAGE_PROPERTIES[language].ALL_VOWELS;
        const frequentVowels = LANGUAGE_PROPERTIES[language].FREQUENT_VOWELS;
        const frequentConsonants = LANGUAGE_PROPERTIES[language].FREQUENT_CONSONANTS;
        this.board.forEach(cell => {
            if (!cell.value) {
                const neighbouringLetters: Array<string> = cell.neighbours.map(neighbour => this.board.get(neighbour)?.value ?? '');
                const hasVowelNeighbour = neighbouringLetters.some(letter => allVowels.includes(letter));
                if (hasVowelNeighbour) {
                    const consonantsToChooseFrom = frequentConsonants.filter(cons => !neighbouringLetters.includes(cons));
                    cell.value = consonantsToChooseFrom[Math.floor(Math.random() * consonantsToChooseFrom.length)];
                } else {
                    const vowelsToChoseFrom = frequentVowels.filter(vowel => !neighbouringLetters.includes(vowel));
                    cell.value = vowelsToChoseFrom[Math.floor(Math.random() * vowelsToChoseFrom.length)];
                }
            }
        });
    }

    private getCellCombinations(combinations: Array<Array<number>>): Array<Array<number>> {
        const result: Array<Array<number>> = [];
        combinations.forEach(combo => {
            const neighbours = this.board.get(combo[combo.length - 1])?.neighbours;
            const filteredNeighbours = neighbours?.filter(neighbour => !combo.includes(neighbour));
            filteredNeighbours?.forEach(neighbour => result.push([...combo, neighbour]));
        });
        return result;
    }

    private getLetterCombinations(combinations: Array<Array<number>>): Array<string> {
        const result: Set<string> = new Set<string>();
        combinations.forEach(combo => {
            let possibleWord = '';
            combo.forEach(item => possibleWord = `${possibleWord}${this.board.get(item)?.value}`);
            result.add(possibleWord);
        });
        return Array.from(result);
    }

    private readonly getRealWords = (combinations: Array<string>): Array<string> => {
        const wordLength = `${combinations[0].length}`;
        return combinations.filter(combo => {
            const wordsByLetter: WordsByLetter = this.dictionary[combo.charAt(0) as keyof Words];
            if (wordsByLetter) {
                const words: Array<string> = wordsByLetter[wordLength as keyof WordsByLetter];
                return words.includes(combo);
            }
            return false;
        });
    };
}

export default Board;
