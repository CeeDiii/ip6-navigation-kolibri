import {Attribute, HASH, valueOf, obsValueOf} from "../kolibri/presentationModel.js";

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
        const newNavAttr = newNavPoint.singleAttr;
        const hash = obsValueOf(newNavAttr, HASH);
        const navPointExists = valueOf(singleAttr)[hash];
        if(navPointExists !== undefined) return false;
        valueOf(singleAttr)[hash] = newNavPoint;
        return true;
    };

    return {
        addNavigationPoint,
        singleAttr,
    }
};
