import {ACTIVE, HASH, ICON, ISHOMEPAGE, VALUE, VISIBLE, VISITED} from "../kolibri/presentationModel.js";
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
 * @property { (isVisible: Boolean) => void } setIsVisible
 * @property { () => Boolean } getIsVisible
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onActiveChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onIconChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisitedChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onValueChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onIsHomepageChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onIsVisibleChanged
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
        getPageContentControllers: () => pageContentControllers,
        activate: () => {
            pageModel.getPageObs(ACTIVE).setValue(true);
            pageModel.getPageObs(VISITED).setValue(true);
        },
        passivate:           () => pageModel.getPageObs(ACTIVE).setValue(false),
        getHash:             pageModel.getPageObs(HASH).getValue,
        setIcon:             pageModel.getPageObs(ICON).setValue,
        setVisited:          pageModel.getPageObs(VISITED).setValue,
        setIsHomepage:       pageModel.getPageObs(ISHOMEPAGE).setValue,
        setIsVisible:        pageModel.getPageObs(VISIBLE).setValue,
        getIsVisible:        pageModel.getPageObs(VISIBLE).getValue,
        onActiveChanged:     pageModel.getPageObs(ACTIVE).onChange,
        onIconChanged:       pageModel.getPageObs(ICON).onChange,
        onVisitedChanged:    pageModel.getPageObs(VISITED).onChange,
        onValueChanged:      pageModel.getPageObs(VALUE).onChange,
        onIsHomepageChanged: pageModel.getPageObs(ISHOMEPAGE).onChange,
        onIsVisibleChanged:  pageModel.getPageObs(VISIBLE).onChange,
        // more to come...
    }
};