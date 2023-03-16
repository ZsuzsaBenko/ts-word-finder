export const attachTemplateToDOM = (templateId: string, removeTemplate = true, parent?: HTMLElement): void => {
    const parentElement = parent ?? document.body;
    const templateElement = document.querySelector(`#${templateId}`) as HTMLTemplateElement;
    const node = document.importNode(templateElement.content, true);
    if (removeTemplate) {
        document.body.removeChild(templateElement);
    }
    parentElement.appendChild(node);
};
