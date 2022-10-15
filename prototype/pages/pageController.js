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
 * @param { !PageProjectorType } pageProj
 * @returns  PageControllerType
 *
 */

const PageController = (pageName, pageProj) => {
    const pageModel = PageModel(pageName);
    const pageProjector = pageProj;

    return {
        activate: () => {
            pageModel.getPageObs(ACTIVE).setValue(true);
            pageModel.getPageObs(VISITED).setValue(true);
            pageProjector.projectPage();
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