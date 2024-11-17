export const removeHiddenClass = (element: HTMLElement): void => {
    element.classList.remove('hidden');
};

export const addHiddenClass = (element: HTMLElement): void => {
    element.classList.add('hidden');
};
