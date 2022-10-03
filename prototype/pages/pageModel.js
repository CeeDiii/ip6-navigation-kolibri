import { ACTIVE, Attribute, HASH, VALUE } from "../kolibri/presentationModel.js";

export { PageModel }

/**
 * IPage is an interface. The IPage interface is used to construct HTML pages
 * that can be integrated into the navigation model of Kolibri.
 * IPage declares the navigation lifecycle of an HTML page in Kolibri.
 *
 * @typedef PageModelType
 * @property { () => HTMLDivElement } activate - a function that returns this pages content.
 *              Only one page can be activated at a time. The activated page is displayed in the browser.
 *              The page has to be initialized for this function to work. Otherwise, a placeholder will be returned.
 * @property { (latestContentState: HTMLDivElement) => void } passivate - a function that takes the latestContentState as an input before passivating the page.
 *              The passivation of the page removes it from display in the browser. The latestContentState is stored in the page.
 * @property { AttributeType } singleAttr
 */

/**
 * Constructor for an IPage<T>
 *
 * @param { !String } pageName
 * @param { () => HTMLDivElement } pageContent
 * @returns PageModelType
 * @constructor
 * @example
 * TODO
 */

const PageModel = (pageName, pageContent) => {
    const singleAttr = Attribute(pageContent());
    singleAttr.getObs(ACTIVE).setValue(false);
    singleAttr.getObs(HASH).setValue('#' + pageName);

    return {
        activate: () => {
            singleAttr.getObs(ACTIVE).setValue(true);
            return singleAttr.getObs(VALUE).getValue();
        },
        passivate: latestContentState => {
            singleAttr.getObs(VALUE).setValue(latestContentState);
        },
        singleAttr,
        //TODO add addCss and removeCss functions
    }
};

