import {ACTIVE, ICON, VALUE, VISITED} from "../kolibri/presentationModel.js";

export { PageController }
/**
 * PageController is a controller for pages.
 *
 * @typedef PageController
 *
 * @property { () => void } activate
 * @property { () => void } passivate
 * @property { (iconPath: String) => void } setIcon
 * @property { (visitedState: Boolean) => void } setVisited
 * @property { (callback: onValueChangeCallback<PageModelType>) => void } onContentChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onActiveChanged
 * @property { (callback: onValueChangeCallback<String>) => void } onIconChanged
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onVisitedChanged
 */

/**
 * Constructor for a PageControllerType.
 *
 * @constructor
 * @param { PageModelType } model
 * @param { PageProjectorType } projector
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
        setIcon:          iconPath => pageModel.getPageObs(ICON).setValue(iconPath),
        setVisited:       visitedState => pageModel.getPageObs(VISITED).setValue(visitedState),
        onContentChanged: model.getPageObs(VALUE).onChange,
        onActiveChanged:  model.getPageObs(ACTIVE).onChange,
        onIconChanged:    model.getPageObs(ICON).onChange,
        onVisitedChanged: model.getPageObs(VISITED).onChange
        // more to come...
    }
};