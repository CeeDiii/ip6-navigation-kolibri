import { ACTIVE, HASH, ICON, IS_HOMEPAGE, PARENT, VALUE, VISIBLE, VISITED } from "../kolibri/presentationModel.js";
import { PageModel } from "./pageModel.js";

export { PageController }
/**
 * PageController is a controller for pages.
 * @template T
 * @typedef PageControllerType
 * @property { () => void } activate
 * @property { () => void } passivate
 * @property { () => [T] } getPageContentControllers
 * @property { () => String } getValue
 * @property { () => String } getHash
 * @property { (iconName: String) => void } setIcon
 * @property { (visitedState: Boolean) => void } setVisited
 * @property { (isHomepage: Boolean) => void } setIsHomepage
 * @property { (isVisible: Boolean) => void } setIsVisible
 * @property { () => Boolean } getIsVisible
 * @property { (newParent: PageControllerType) => void } setParent
 * @property { () => PageControllerType } getParent
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onActiveChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onIconChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisitedChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onValueChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onIsHomepageChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onIsVisibleChanged
 * @property { (callback: onValueChangeCallback<PageControllerType>) => void } onParentChanged
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
        getValue:            pageModel.getPageObs(VALUE).getValue,
        getHash:             pageModel.getPageObs(HASH).getValue,
        setIcon:             pageModel.getPageObs(ICON).setValue,
        setVisited:          pageModel.getPageObs(VISITED).setValue,
        setIsHomepage:       pageModel.getPageObs(IS_HOMEPAGE).setValue,
        setIsVisible:        pageModel.getPageObs(VISIBLE).setValue,
        getIsVisible:        pageModel.getPageObs(VISIBLE).getValue,
        setParent:           pageModel.getPageObs(PARENT).setValue,
        getParent:           pageModel.getPageObs(PARENT).getValue,
        onActiveChanged:     pageModel.getPageObs(ACTIVE).onChange,
        onIconChanged:       pageModel.getPageObs(ICON).onChange,
        onVisitedChanged:    pageModel.getPageObs(VISITED).onChange,
        onValueChanged:      pageModel.getPageObs(VALUE).onChange,
        onIsHomepageChanged: pageModel.getPageObs(IS_HOMEPAGE).onChange,
        onIsVisibleChanged:  pageModel.getPageObs(VISIBLE).onChange,
        onParentChanged:     pageModel.getPageObs(PARENT).onChange,
        // more to come...
    }
};