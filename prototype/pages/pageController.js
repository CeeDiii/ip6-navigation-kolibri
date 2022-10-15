import { ACTIVE, HASH, ICON, VISITED } from "../kolibri/presentationModel.js";
import { PageModel } from "./pageModel.js";

export { PageController }
/**
 * PageController is a controller for pages.
 *
 * @typedef PageControllerType
 * @property { () => void } activate
 * @property { () => void } passivate
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
 * @constructor
 * @param { !String } pageName
 * @returns  PageControllerType
 *
 */

const PageController = pageName => {
    const pageModel = PageModel(pageName);

    return {
        activate: () => {
            pageModel.getPageObs(ACTIVE).setValue(true);
            pageModel.getPageObs(VISITED).setValue(true);
        },
        passivate:        () => pageModel.getPageObs(ACTIVE).setValue(false),
        getHash:          () => pageModel.getPageObs(HASH).getValue(),
        setIcon:          iconPath => pageModel.getPageObs(ICON).setValue(iconPath),
        setVisited:       visitedState => pageModel.getPageObs(VISITED).setValue(visitedState),
        onActiveChanged:  pageModel.getPageObs(ACTIVE).onChange,
        onIconChanged:    pageModel.getPageObs(ICON).onChange,
        onVisitedChanged: pageModel.getPageObs(VISITED).onChange
        // more to come...
    }
};