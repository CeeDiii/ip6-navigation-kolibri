import {ACTIVE, Attribute, HASH, ICON, ISHOMEPAGE, VALUE, VISITED} from "../kolibri/presentationModel.js";

export { PageModel }

/**
 * @typedef PageModelType
 * @template T
 * @property { (obsType: ObservableTypeString) => IObservable<T> } getPageObs
 */

/**
 * Constructor for an PageModelType
 *
 * @constructor
 * @param { !String } pageName
 * @returns PageModelType
 */

const PageModel = pageName => {
    const pageAttr = Attribute(pageName);
    pageAttr.getObs(ACTIVE).setValue(false);
    pageAttr.getObs(HASH).setValue('#' + pageName);
    pageAttr.getObs(VISITED).setValue(false);
    pageAttr.getObs(ICON).setValue('placeholder');
    pageAttr.getObs(ISHOMEPAGE).setValue(false);

    return {
        getPageObs: obsType => pageAttr.getObs(obsType),
    }
};

