import { ACTIVE, HASH, ICON, VALUE, VISITED } from "../kolibri/presentationModel.js";
import {PageProjector} from "./pageProjector.js";
import {PageModel} from "./pageModel.js";

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
 * @property { (callback: onValueChangeCallback<HTMLDivElement>) => void } onContentChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onActiveChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onIconChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisitedChanged
 */

/**
 * Constructor for a PageControllerType.
 *
 * @constructor
 * @param { !String } pageName
 * @param { !(() => HTMLDivElement) } initialContent
 * @returns  PageControllerType
 *
 */

const PageController = (pageName, initialContent) => {
    const pageModel = PageModel(pageName, initialContent);
    const pageProjector = PageProjector();

    return {
        activate: () => {
            pageModel.getPageObs(ACTIVE).setValue(true);
            pageProjector.projectPage(pageModel.getContent());
        },
        passivate:        () => pageModel.getPageObs(ACTIVE).setValue(false),
        getHash:          () => pageModel.getPageObs(HASH).getValue(),
        setIcon:          iconPath => pageModel.getPageObs(ICON).setValue(iconPath),
        setVisited:       visitedState => pageModel.getPageObs(VISITED).setValue(visitedState),
        onContentChanged: pageModel.getPageObs(VALUE).onChange,
        onActiveChanged:  pageModel.getPageObs(ACTIVE).onChange,
        onIconChanged:    pageModel.getPageObs(ICON).onChange,
        onVisitedChanged: pageModel.getPageObs(VISITED).onChange
        // more to come...
    }
};