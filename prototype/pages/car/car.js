import {Attribute, EDITABLE, LABEL, TYPE, VALUE, VALID } from "../../kolibri/presentationModel.js";

export { Car, reset, ALL_ATTRIBUTE_NAMES, selectionMold as carSelectionMold}

/**
 * Names of those attributes of a Car that are to appear on the UI.
 * @type { String[] }
 */
const ALL_ATTRIBUTE_NAMES = ['brand', 'model'];

/**
 * Internal, mutable, singleton state to make Car qualifiers unique.
 * @private
 */
let idCounter = 0;

/**
 * @typedef  CarType
 * @property { Attribute<String>}  brand
 * @property { Attribute<String>}  model
 * @property { Attribute<Boolean>} detailed - whether this Car instance should be visible in a detail view
 * @property { () => String }      toString
 */

/**
 * Constructs a new Car instance with default values and sets up all necessary observables.
 * There is a converter for the brand to uppercase (just to show how such a thing is done), and
 * there is a validator for the brand to make sure it has at least 3 characters.
 * @return { CarType }
 * @constructor
 */
const Car = () => {                               // facade
    const id = idCounter++;
    /** @type AttributeType<String> */
    const brandAttr = Attribute("Audi", `Car.${id}.brand`);
    brandAttr.getObs(LABEL)     .setValue("Brand");
    brandAttr.getObs(TYPE)      .setValue("text");
    brandAttr.getObs(EDITABLE)  .setValue(true);
    brandAttr.getObs(VALID)     .setValue(true);

    /** @type AttributeType<String> */
    const modelAttr  = Attribute("A1", `Car.${id}.model`);
    modelAttr.getObs(LABEL)      .setValue("Model");
    modelAttr.getObs(TYPE)       .setValue("text");
    modelAttr.getObs(EDITABLE)   .setValue(true);
    modelAttr.getObs(VALID)      .setValue(true);

    /** @type AttributeType<Boolean> */
    const detailedAttr  = Attribute(true, `Car.${id}.detailed`);

    brandAttr.setConverter( input => input.toUpperCase() );  // enable for playing around
    brandAttr.setValidator( input => input.length >= 3   );

    return /** @type CarType */ {
        brand:      brandAttr,
        model:      modelAttr,
        detailed:   detailedAttr,
        toString: () => brandAttr.getObs(VALUE).getValue() + " " + modelAttr.getObs(VALUE).getValue(),
    }
};

/**
 * Remove the default values of a car.
 */
const reset = car => {
    ALL_ATTRIBUTE_NAMES.forEach( brand => {
        car[brand].setQualifier(undefined);
        car[brand].setConvertedValue("");
    });
    return car;
};

/**
 * Fixed, singleton, extra car model instance that represents the current selection.
 * Rather than storing a reference to the selected car model, we let the attribute values
 * (observable values for each attribute plus possible qualifiers)
 * of the selected car "flow" into this "mold".
 * Multi-way editing is achieved via automated qualifier synchronization.
 * Some frameworks call this a "proxy".
 */
const selectionMold = reset(Car()); // make a new empty Car model to start with
