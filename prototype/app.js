import { NavigationController } from "./navigation/navigationController.js";
/** import { NavigationProjector } from "./navigation/basicNavigationProjector.js"; **/
import { NavigationProjector } from "./navigation/bubble-state/bubblestateNavigationProjector.js";
import { PageController } from "./pages/pageController.js";
import { HomePageProjector } from "./pages/home/homePageProjector.js";
import { Person, personSelectionMold } from "./pages/person/person.js";
import { PersonListController, PersonSelectionController } from "./pages/person/personController.js";
import { CarListController, CarSelectionController } from "./pages/car/carController.js";
import { PersonPageProjector } from "./pages/person/personPageProjector.js";
import { Car,carSelectionMold } from "./pages/car/car.js";
import { CarPageProjector } from "./pages/car/carPageProjector.js";
import { WeekController } from "./pages/workweek/workweek/weekController.js";
import { SimpleWorkWeekPageProjector } from "./pages/workweek/simpleWorkWeekPageProjector.js";

const homePageController = PageController("home", null);
homePageController.setIcon('house');
HomePageProjector(homePageController);

const personListController      = PersonListController(Person);
const personSelectionController = PersonSelectionController(personSelectionMold);
const personPageController = PageController("person", [personListController, personSelectionController]);
personPageController.setIcon('person');
PersonPageProjector(personPageController);

const carListController      = CarListController(Car);
const carSelectionController = CarSelectionController(carSelectionMold);
const carPageController = PageController("car", [carListController, carSelectionController]);
carPageController.setIcon('car');
CarPageProjector(carPageController);

const simpleWorkWeekPageController = PageController("workweek", [WeekController()]);
simpleWorkWeekPageController.setIcon('calendar');
SimpleWorkWeekPageProjector(simpleWorkWeekPageController);

const pinToNavElement = document.getElementById("nav");

const navigationController = NavigationController();
NavigationProjector(navigationController, pinToNavElement);

navigationController.addPageController(homePageController);
navigationController.addPageController(personPageController);
navigationController.addPageController(simpleWorkWeekPageController);

navigationController.setHomePage('home');

// only used to show dynamic extension of navigation bar
window.addNavigationPointAtRuntime = () => {
    navigationController.addPageController(carPageController);
};





