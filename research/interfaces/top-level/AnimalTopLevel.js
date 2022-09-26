/**
 * An Animal.
 *
 * @interface
 */
const AnimalTopLevel = () => {};

/**
 * Move the Animal.
 *
 */
AnimalTopLevel.prototype.move = () => {
    throw new Error('not implemented');
};
/**
 * Let the Animal talk.
 *
 * @param { String } sound
 *
 */
AnimalTopLevel.prototype.talk = sound => {
    throw new Error('not implemented');
};
/**
 *
 * @return { Number } hungerLevel
 */
AnimalTopLevel.prototype.eat = () => {
    throw new Error('not implemented');
};