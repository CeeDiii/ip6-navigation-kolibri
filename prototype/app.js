import { PageController } from "./pages/pageController.js";
import { NavigationModel } from "./navigation/navigationModel.js";
import { NavigationController } from "./navigation/navigationController.js";
import { NavigationProjector } from "./navigation/basicNavigationProjector.js";
import { ListController, SelectionController } from "./examples/person/personController.js";
import { Person, selectionMold } from "./examples/person/person.js";
import { PersonPageProjector } from "./pages/person/personPageProjector.js";
import { HomePageProjector } from "./pages/homePageProjector.js";

const homePageController = PageController("home");
HomePageProjector(homePageController);

const listController      = ListController(Person);
const selectionController = SelectionController(selectionMold);
const personPageController = PageController("person");
PersonPageProjector(personPageController, [listController, selectionController]);


const pinToNavElement = document.getElementById("nav");

const navigationModel = NavigationModel();
const navigationController = NavigationController(navigationModel);
NavigationProjector(navigationController, pinToNavElement);

navigationController.addPageController(homePageController);
navigationController.addPageController(personPageController);





