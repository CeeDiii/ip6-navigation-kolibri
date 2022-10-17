import {ACTIVE, HASH, ICON, ISHOMEPAGE, VALUE, VISITED} from "../kolibri/presentationModel.js";
import { PageModel } from "./pageModel.js";

export { PageController }
/**
 * PageController is a controller for pages.
 * @template T
 * @typedef PageControllerType
 * @property { () => void } activate
 * @property { () => void } passivate
 * @property { () => [T] } getPageContentControllers
 * @property { () => String } getHash
 * @property { (iconName: String) => void } setIcon
 * @property { (visitedState: Boolean) => void } setVisited
 * @property { (isHomepage: Boolean) => void } setIsHomepage
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onActiveChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onIconChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisitedChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onValueChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onIsHomepageChanged
 */

/**
 * Constructor for a PageControllerType.
 *
 * @template T
 * @constructor
 * @param { !String } pageName
 * @param { [T] } contentControllers
 * @returns  PageControllerType
 * @example
 * const homePageController = PageController("home", null);
 * homePageController.setIcon('house');
 */

const PageController = (pageName, contentControllers) => {
    const pageModel = PageModel(pageName);
    const pageContentControllers = contentControllers;

    return {
        activate: () => {
            pageModel.getPageObs(ACTIVE).setValue(true);
            pageModel.getPageObs(VISITED).setValue(true);
        },
        passivate:          () => pageModel.getPageObs(ACTIVE).setValue(false),
        getPageContentControllers: () => pageContentControllers,
        getHash:            () => pageModel.getPageObs(HASH).getValue(),
        setIcon:            iconName => pageModel.getPageObs(ICON).setValue(iconName),
        setVisited:         visitedState => pageModel.getPageObs(VISITED).setValue(visitedState),
        setIsHomepage:      isHomepage => pageModel.getPageObs(ISHOMEPAGE).setValue(isHomepage),
        onActiveChanged:    pageModel.getPageObs(ACTIVE).onChange,
        onIconChanged:      pageModel.getPageObs(ICON).onChange,
        onVisitedChanged:   pageModel.getPageObs(VISITED).onChange,
        onValueChanged:     pageModel.getPageObs(VALUE).onChange,
        onIsHomepageChanged: pageModel.getPageObs(ISHOMEPAGE).onChange,
        // more to come...

    }
};