import { ACTIVE, HASH, ICON, VISITED } from "../kolibri/presentationModel.js";
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
 * @property { (iconPath: String) => void } setIcon
 * @property { (visitedState: Boolean) => void } setVisited
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onActiveChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onIconChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisitedChanged
 */

/**
 * Constructor for a PageControllerType.
 *
 * @template T
 * @constructor
 * @param { !String } pageName
 * @param { [T] } contentControllers
 * @returns  PageControllerType
 *
 */

const PageController = (pageName, contentControllers) => {
    const pageModel = PageModel(pageName);
    const pageContentControllers = contentControllers;

    return {
        activate: () => {
            pageModel.getPageObs(ACTIVE).setValue(true);
            pageModel.getPageObs(VISITED).setValue(true);
        },
        passivate:        () => pageModel.getPageObs(ACTIVE).setValue(false),
        getPageContentControllers: () => pageContentControllers,
        getHash:          () => pageModel.getPageObs(HASH).getValue(),
        setIcon:          iconPath => pageModel.getPageObs(ICON).setValue(iconPath),
        setVisited:       visitedState => pageModel.getPageObs(VISITED).setValue(visitedState),
        onActiveChanged:  pageModel.getPageObs(ACTIVE).onChange,
        onIconChanged:    pageModel.getPageObs(ICON).onChange,
        onVisitedChanged: pageModel.getPageObs(VISITED).onChange
        // more to come...

    }
};