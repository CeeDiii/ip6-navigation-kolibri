import { HumanImpl } from "./HumanImpl.js";

/** @type { Animal } */
const animal = new HumanImpl("Mario", 42, "male");
animal.eat();
// Even though the interface function move takes no parameter, we can pass it here
animal.move("Car");
animal.talk();
const human = new HumanImpl("Luigi", 42, "male");
human.introduce();
human.move("Bike");