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
 * PageModelType is the page interface that is needed to register a page with a NavigationController.
 * The PageModelType stores rich attributes that abstract its visual and contextual state in a Navigation.
 * Each PageModelType has a unique hash that identifies it while navigating.
 *
 * @typedef PageModelType
 * @template T
 * @property { (obsType: ObservableTypeString) => IObservable<T> } getPageObs - a function that returns the observable stored under the given observable string.
 */

/**
 * Constructor for a PageModelType
 *
 * @constructor
 * @param { !String } pageName - a name for page. the display name can be changed later, however the initial pageName must be unique as it will be set as the unchangeable hash that identifies the page. Mandatory.
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

