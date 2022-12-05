import {
    Attribute,
    ACTIVE,
    HASH,
    ICON,
    IS_HOMEPAGE,
    PARENT,
    VISIBLE,
    VISITED,
    NAVIGATIONAL
} from "../kolibri/presentationModel.js";

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
    pageAttr.getObs(ICON).setValue('./navigation/icons/placeholder.svg');
    pageAttr.getObs(IS_HOMEPAGE).setValue(false);
    pageAttr.getObs(VISIBLE).setValue(true);
    pageAttr.getObs(PARENT).setValue(null);
    pageAttr.getObs(NAVIGATIONAL).setValue(true);

    return {
        getPageObs: obsType => pageAttr.getObs(obsType),
    }
};

