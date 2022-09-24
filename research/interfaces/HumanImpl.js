export { HumanImpl }

/**
 * A human.
 * @constructor
 * @implements { Animal }
 */
function HumanImpl(name, age, gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
}

HumanImpl.prototype.eat = () => console.log("Dining in a fine restaurant");

// Even though the interface function takes no parameter, we can implement the function with it
HumanImpl.prototype.move = vehicle => {
    if (vehicle === 'E-Scooter') {
        console.log("Cruising like a dystopian.");
    } else if (vehicle === 'Bike') {
        console.log("Moving eco-friendly");
    } else if (vehicle === 'Car') {
        console.log("You better move with an electric car");
    }
};

// Even though the interface defines an input parameter, the implementation takes none
HumanImpl.prototype.talk = () => console.log("Casual chatting");

HumanImpl.prototype.introduce = function() {
    console.log("I am " + this.name + " and I am " + this.age + " years old. My gender is " + this.gender)
};

