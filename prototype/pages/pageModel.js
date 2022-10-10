import {ACTIVE, Attribute, HASH, ICON, VALUE, VISITED} from "../kolibri/presentationModel.js";

export { PageModel }

/**
 * @typedef PageModelType
 * @template T
 * @property { (obsType: ObservableTypeString) => IObservable<T> } getPageObs
 * @property { (newContent: HTMLDivElement) => void } setContent
 * @property { () => HTMLDivElement } getContent
 */

/**
 * Constructor for an PageModelType
 *
 * @constructor
 * @param { !String } pageName
 * @param { !(() => HTMLDivElement) } initialContent
 * @returns PageModelType
 * @example
 * TODO
 */

const PageModel = (pageName, initialContent) => {
    const pageAttr = Attribute(initialContent());
    pageAttr.getObs(ACTIVE).setValue(false);
    pageAttr.getObs(HASH).setValue('#' + pageName);
    pageAttr.getObs(VISITED).setValue(false);
    //pageAttr.getObs(ICON)

    return {
        getPageObs: obsType => pageAttr.getObs(obsType),
        setContent: newContent => pageAttr.getObs(VALUE).setValue(newContent),
        getContent: () => pageAttr.getObs(VALUE).getValue(),
        //TODO add addCss and removeCss functions
    }
};

