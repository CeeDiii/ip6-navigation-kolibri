/**
 * An Animal.
 *
 * @interface
 */
const AnimalTopLevel = class {
    /**
     * Move the Animal.
     *
     */
    move = () => {
        throw new Error('not implemented');
    };

    /**
     * Let the Animal talk.
     *
     * @param { String } sound
     *
     */
    talk = sound => {
        throw new Error('not implemented');
    };

    /**
     *
     * @return { Number } hungerLevel
     */
    eat = () => {
        throw new Error('not implemented');
    };
};