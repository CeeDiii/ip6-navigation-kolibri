
import {
    projectForm,
    projectListItem,
    masterClassName,
    removeListItemForModel,
    selectListItemForModel
}                                           from "./instantUpdateProjector.js";
import {ALL_ATTRIBUTE_NAMES, carSelectionMold} from "./car.js";

export { projectMasterView as carProjectMasterView, projectDetailView as carProjectDetailView }

/**
 * Create the master view, bind against the controllers, and return the view.
 * @impure - since we change the state of the controller. The DOM remains unchanged.
 * @template T
 * @param { ListControllerType<T> }      listController
 * @param { SelectionControllerType<T> } selectionController
 * @return { [HTMLDivElement] }          - master view
 */
const projectMasterView = (listController, selectionController) => {

    /** @type HTMLDivElement */ const rootElement = document.createElement("div");

    const renderRow = car => {
        const rowElements = projectListItem(listController, selectionController, car, ALL_ATTRIBUTE_NAMES);
        rootElement.append(...rowElements);
        selectionController.setSelectedModel(car);
    }

    rootElement.classList.add(masterClassName);
    rootElement.style['grid-template-columns'] = '2em repeat(' + ALL_ATTRIBUTE_NAMES.length + ', auto);';

    // binding
    listController.onModelAdd(renderRow);
    listController.onModelRemove( removedModel => {
        removeListItemForModel(ALL_ATTRIBUTE_NAMES, rootElement)(removedModel);
        ALL_ATTRIBUTE_NAMES.forEach( name => removedModel[name].setQualifier(undefined)); // remove model attributes from model world
        selectionController.clearSelection();
    });
    selectionController.onModelSelected(selectListItemForModel(ALL_ATTRIBUTE_NAMES, rootElement));

    return [rootElement];
};


/**
 * Create the detail view, bind against the detail controller, and return the view.
 * @template T
 * @impure - since we change the state of the controller. The DOM remains unchanged.
 * @param  { SelectionControllerType<T> } selectionController
 * @param  { HTMLElement }                detailCard - element that holds the detail view and can be folded away
 * @return { [HTMLFormElement] }          - master view
 */
const projectDetailView = (selectionController, detailCard) => {

    const form = projectForm(selectionController, detailCard, carSelectionMold, ALL_ATTRIBUTE_NAMES); // only once, view is stable, binding is stable

    selectionController.onModelSelected( selectedCarModel =>
        [...ALL_ATTRIBUTE_NAMES, "detailed"].forEach( name =>
            carSelectionMold[name].setQualifier(selectedCarModel[name].getQualifier())
        )
    );

    selectionController.clearSelection();

    return form;
};
