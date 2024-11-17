// Interfaces

export interface Cell {
    value: string;
    neighbours: Array<number>;
}

export interface Words {
    [key: string]: WordsByLetter;
}

export interface WordsByLetter {
    '3': Array<string>;
    '4': Array<string>;
    '5': Array<string>;
    '6': Array<string>;
    '7': Array<string>;
}

export interface StoredResults {
    hu: StoredResultsByLang;
    en: StoredResultsByLang;
}

export interface StoredResultsByLang {
    games: Array<number>;
    bestTime: number;
}

export interface GameResult {
    foundWords: Array<string>;
    notFoundWords: Array<string>;
    unknownWords: Array<string>;
    time: number;
}

// Enums

export enum Language {
    HU = 'HU',
    EN = 'EN'
}

// Constants

export const LANGUAGE_PROPERTIES = {
    HU: {
        ALL_VOWELS: ['A', 'Á', 'E', 'É', 'I', 'Í', 'O', 'Ó', 'Ö', 'Ő', 'U', 'Ú', 'Ü', 'Ű'],
        FREQUENT_VOWELS: ['A', 'E', 'É', 'I'],
        FREQUENT_CONSONANTS: ['B', 'H', 'K', 'L', 'M', 'N', 'R', 'S', 'T']
    },
    EN: {
        ALL_VOWELS: ['A', 'E', 'I', 'O', 'U'],
        FREQUENT_VOWELS: ['A', 'E', 'I', 'O'],
        FREQUENT_CONSONANTS: ['H', 'L', 'N', 'R', 'S', 'T']
    }
};

export const GAME_RESULTS_STORAGE_KEY = 'szokereso-jatek-stat-v2';
