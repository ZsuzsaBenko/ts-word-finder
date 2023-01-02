export interface Cell {
    value: string;
    neighbours: Array<number>;
}
export interface Words {
    'A': WordsByLetter,
    'Á': WordsByLetter,
    'B': WordsByLetter,
    'C': WordsByLetter,
    'D': WordsByLetter,
    'E': WordsByLetter,
    'É': WordsByLetter,
    'F': WordsByLetter,
    'G': WordsByLetter,
    'H': WordsByLetter,
    'I': WordsByLetter,
    'Í': WordsByLetter,
    'J': WordsByLetter,
    'K': WordsByLetter,
    'L': WordsByLetter,
    'M': WordsByLetter,
    'N': WordsByLetter,
    'O': WordsByLetter,
    'Ó': WordsByLetter,
    'Ö': WordsByLetter,
    'Ő': WordsByLetter,
    'P': WordsByLetter,
    'R': WordsByLetter,
    'S': WordsByLetter,
    'T': WordsByLetter,
    'U': WordsByLetter,
    'Ú': WordsByLetter,
    'Ü': WordsByLetter,
    'Ű': WordsByLetter,
    'V': WordsByLetter,
    'Z': WordsByLetter,
}

export interface WordsByLetter {
    '3': Array<string>;
    '4': Array<string>;
    '5': Array<string>;
    '6': Array<string>;
    '7': Array<string>;
}
