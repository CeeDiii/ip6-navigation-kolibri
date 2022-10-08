import { Attribute, HASH } from "../kolibri/presentationModel.js";

export { NavigationModel }

/**
 * Model containing the application navigation-data
 *
 * @typedef NavigationModelType
 * @property { (newNavPoint:PageModelType) => Boolean } addNavigationPoint
 * @property { AttributeType } singleAttr
 */

/** 
 * @constructor
 * @return  { NavigationModelType }
 * @example
 * const navigationModel = NavigationModel("home");
 */

const NavigationModel = () => {
    const singleAttr = Attribute({});

    const addNavigationPoint = newNavPoint => { // TODO
        const navPointExists = singleAttr.valueOf()[newNavPoint.singleAttr.getObs(HASH).getValue()];
        if(navPointExists !== undefined) return false;
        singleAttr.valueOf()[newNavPoint.singleAttr.getObs(HASH).getValue()] = newNavPoint;
        return true;
    };

    return {
        addNavigationPoint,
        singleAttr,
    }
};
