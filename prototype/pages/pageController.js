import { ACTIVE, HASH, ICON, VALUE, VISITED } from "../kolibri/presentationModel.js";

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
 * @param { !PageModelType } model
 * @param { !PageProjectorType } projector
 * @returns  PageControllerType
 *
 */

const PageController = (model, projector) => {
    const pageModel = model;
    const pageProjector = projector;

    return {
        activate: () => {
            pageModel.getPageObs(ACTIVE).setValue(true);
            pageProjector.projectPage();
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