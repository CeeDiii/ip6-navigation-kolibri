export { WolfImpl }

/**
 * A wolf.
 * @constructor
 * @implements { AnimalVirtual }
 */
const WolfImpl = class {
    constructor(age, sex) {
        this.age = age;
        this.sex = sex;
    }

    eat() {
        console.log("Eating raw meat");
        return 1;
    }

    move() {
        console.log("Sneaking through the forest");
    }

    talk(sound) {
        console.log("Howling across the mountains: " + sound)
    }

    introduce() {
        console.log("This wolf is " + this.age + " years old. It is " + this.sex)
    }
};
