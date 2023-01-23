import {
    Attribute,
    ACTIVE,
    HASH,
    ICON,
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
 * @property { () => String } getQualifier - a function that returns the qualifier for this page.
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

    pageAttr.setQualifier(pageName); // the initial pageName will uniquely identify the page and is unchangeable

    pageAttr.getObs(ACTIVE, false);
    pageAttr.getObs(HASH, '#' + pageName.replace(' ', '')); //Converter is not used because it should only apply for the hash
    pageAttr.getObs(VISITED, false);
    pageAttr.getObs(ICON, './navigation/icons/placeholder.svg');
    pageAttr.getObs(VISIBLE, true);
    pageAttr.getObs(PARENT, null);
    pageAttr.getObs(NAVIGATIONAL, true);

    return {
        getQualifier:   () => pageAttr.getQualifier(),
        getPageObs:     obsType => pageAttr.getObs(obsType),
    }
};

