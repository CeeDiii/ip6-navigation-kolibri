import { NavigationModel } from "./navigation/navigationModel.js";
import { NavigationController } from "./navigation/navigationController.js";
import { NavigationProjector } from "./navigation/basicNavigationProjector.js";
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
HomePageProjector(homePageController);

const personListController      = PersonListController(Person);
const personSelectionController = PersonSelectionController(personSelectionMold);
const personPageController = PageController("person", [personListController, personSelectionController]);
PersonPageProjector(personPageController);

const carListController      = CarListController(Car);
const carSelectionController = CarSelectionController(carSelectionMold);
const carPageController = PageController("car", [carListController, carSelectionController]);
CarPageProjector(carPageController);


const simpleWorkWeekPageController = PageController("workweek", [WeekController()]);
SimpleWorkWeekPageProjector(simpleWorkWeekPageController);

const pinToNavElement = document.getElementById("nav");

const navigationModel = NavigationModel();
const navigationController = NavigationController(navigationModel);
NavigationProjector(navigationController, pinToNavElement);

navigationController.addPageController(homePageController);
navigationController.addPageController(personPageController);
navigationController.addPageController(carPageController);
navigationController.addPageController(simpleWorkWeekPageController);





