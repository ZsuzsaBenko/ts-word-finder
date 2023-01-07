class GameStats {

    private readonly FOUND_WORDS_STAT = document.querySelector('.found-words-stat') as HTMLElement;
    private readonly LENGTHS = document.querySelector('.lengths') as HTMLElement;
    private readonly ITEMS = document.querySelector('.items') as HTMLElement;
    private readonly hiddenWordsStat: Map<number, number> = new Map<number, number>();

    initStats(hiddenWords: Array<string>, foundWords: Array<string>): void {
        this.setFoundWordsStat(hiddenWords, foundWords);

        hiddenWords.forEach(word => {
            const wordLength = word.length;
            const prev: number = this.hiddenWordsStat.get(wordLength) ?? 0;
            this.hiddenWordsStat.set(wordLength, prev + 1);
        });
        this.showInitialStats();
    }

    updateStats(wordLength: number, hiddenWords: Array<string>, foundWords: Array<string>): void {
        this.updateHiddenWordStats(wordLength);
        this.setFoundWordsStat(hiddenWords, foundWords);
    }

    private setFoundWordsStat(hiddenWords: Array<string>, foundWords: Array<string>): void {
        this.FOUND_WORDS_STAT.children[0].textContent = `${foundWords.length}`;
        this.FOUND_WORDS_STAT.children[2].textContent = `${hiddenWords.length}`;
    }

    private showInitialStats(): void {
        Array.from(this.hiddenWordsStat.keys())
            .forEach(num => {
                const lengthSpan = document.createElement('span');
                lengthSpan.textContent = `${num}`;
                this.LENGTHS?.appendChild(lengthSpan);
                const itemSpan = document.createElement('span');
                itemSpan.textContent = `${this.hiddenWordsStat.get(num)}`;
                itemSpan.setAttribute('id', `letter-${num}`);
                this.ITEMS?.appendChild(itemSpan);
            });
    }

    private updateHiddenWordStats(wordLength: number): void {
        const current = this.hiddenWordsStat.get(wordLength) ?? 0;
        this.hiddenWordsStat.set(wordLength, Math.max(0, current - 1));
        Array.from(this.hiddenWordsStat.keys())
            .forEach(num => {
                const itemSpan = this.ITEMS.querySelector(`#letter-${num}`) as HTMLElement;
                itemSpan.textContent = `${this.hiddenWordsStat.get(num)}`;
            });
    }

}

export default GameStats;
