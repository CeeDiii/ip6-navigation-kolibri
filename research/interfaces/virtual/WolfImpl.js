export { WolfImpl }

/**
 * A wolf.
 * @constructor
 * @implements { AnimalVirtual }
 */
function WolfImpl(age, sex) {
    this.age = age;
    this.sex = sex;
}
WolfImpl.prototype.eat = () => {
    console.log("Eating raw meat");
    return 1;
};
WolfImpl.prototype.move = () => console.log("Sneaking through the forest");
WolfImpl.prototype.talk = sound => console.log("Howling across the mountains: " + sound);
WolfImpl.prototype.introduce = function() {
    console.log("This wolf is " + this.age + " years old. It is " + this.sex);
};
