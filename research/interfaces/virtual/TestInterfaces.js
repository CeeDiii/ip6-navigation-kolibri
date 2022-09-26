import { WolfImpl } from "./WolfImpl.js";

/** @type { AnimalVirtual } */
const animal = new WolfImpl("Mario", 42, "male");
animal.eat();
animal.move("Car");
animal.talk("Arrooooo");
const human = new WolfImpl(42, "male");
human.introduce();
human.move("Bike");