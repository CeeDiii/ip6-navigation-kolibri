import { EventType } from "./EventType.js";
export { NavigationEvent }

/**
 * Navigation event containing a type and any value
 *
 * @typedef  { Object } NavigationEventType
 * @property { () => EventType } getEventType
 * @property { () => String } getHash
 * @property { () => String } getValue
 * @property { () => String } getLastHash
 * @property { () => String } getLastValue
 * @param    { EventType } type
 * @param    { String } val
 * 
 */

/**
 *
 * @constructor
 * @param { EventType } type
 * @param { String } val
 * @param { String } lastVal
 * @returns { NavigationEventType }
 */
const NavigationEvent = (type, val, lastVal) => {
    if (!val.startsWith("#")) val = '#' + val;
    if (!lastVal.startsWith("#")) lastVal = '#' + lastVal;


    const eventType = type;
    const hash = val;
    const value = val.substring(1);
    const lastHash = lastVal;
    const lastValue = lastVal.substring(1);

    return {
        getEventType: () => eventType,
        getHash:      () => hash,
        getValue:     () => value,
        getLastHash:  () => lastHash,
        getLastValue: () => lastValue
    }
};