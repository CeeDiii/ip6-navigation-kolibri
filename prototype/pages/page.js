import {Attribute, VALUE} from "../kolibri/presentationModel";

export { Page }

/**
 * IPage is an interface. The IPage interface is used to construct HTML pages
 * that can be integrated into the navigation model of Kolibri.
 * IPage declares the navigation lifecycle of an HTML page in Kolibri.
 *
 * @typedef IPage<T>
 * @template T
 * @property { () => void } initialize - a function that initializes the page content. The page projector is called exactly once if the page has not been initialized.
 *              After the first initialization an error is thrown if this function is called.
 * @property { () => HTMLDivElement } activate - a function that returns this pages content.
 *              Only one page can be activated at a time. The activated page is displayed in the browser.
 *              The page has to be initialized for this function to work. Otherwise, a placeholder will be returned.
 * @property { (latestContentState: HTMLDivElement) => void } passivate - a function that takes the latestContentState as an input before passivating the page.
 *              The passivation of the page removes it from display in the browser. The latestContentState is stored in the page.
 *
 */

/**
 * Constructor for an IPage<T>
 *
 * @template T
 * @param { !String } pageName
 * @param { !IPageProjector } pageProjector
 * @returns IPage<T>
 * @constructor
 * @example
 * const homePageProjector = PageProjector(homePageProjector);
 * const page = Page(homePageProjector);
 * page.initialize();
 * page.activate();
 * page.passivate(latestContentState);
 */
const Page = (pageName, pageProjector) => {
    const qualifier   = pageName;
    const hash        = '#' + pageName;
    const name        = Attribute(pageName); // TODO Make all 'Attributes' as one
    const initialized = Attribute(false);
    let content = document.createElement('div');
    content.innerText = "Empty page. Please initialize.";

    return {
        initialize: () => {
            if (initialized) {
                throw 'Page has already been initialized.';
            } else {
                content = pageProjector.projectPage();
                initialized.getObs(VALUE).setValue(true);
            }
        },
        activate: () => content,
        passivate: latestContentState => content = latestContentState,
        getQualifier: () => qualifier,
        getHash: () => hash,
        getName: () => name,
        setName: newName => name.getObs(VALUE).setValue(newName),
        //TODO add addCss and removeCss functions
    }
};

