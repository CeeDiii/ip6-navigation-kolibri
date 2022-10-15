import { PageController } from "./pages/pageController.js";
import { NavigationModel } from "./navigation/navigationModel.js";
import { NavigationController } from "./navigation/navigationController.js";
import { NavigationProjector } from "./navigation/basicNavigationProjector.js";
import {ListController, SelectionController} from "./examples/person/personController.js";
import { Person, selectionMold } from "./examples/person/person.js";
import { PersonPageProjector } from "./pages/person/personPageProjector.js";

const listController      = ListController(Person);
const selectionController = SelectionController(selectionMold);
const personPageProjector = PersonPageProjector([listController, selectionController]);
const personPageController = PageController("person", personPageProjector);

const pinToNavElement = document.getElementById("nav");

const navigationModel = NavigationModel();
const navigationController = NavigationController(navigationModel);
NavigationProjector(navigationController, pinToNavElement);

navigationController.addPageController(personPageController);





