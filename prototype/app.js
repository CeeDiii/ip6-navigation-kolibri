import { homePage } from "./pages/homePage.js";
import { aboutPage } from "./pages/aboutPage.js";
import { PageController } from "./pages/pageController.js";
import { NavigationModel } from "./navigation/navigationModel.js";
import { NavigationController } from "./navigation/navigationController.js";
import { NavigationProjector } from "./navigation/basicNavigationProjector.js";

const homePageController = PageController('home', homePage);
const aboutPageController = PageController('about', aboutPage);

const pinToNavElement = document.getElementById("nav");

const navigationModel = NavigationModel();
const navigationController = NavigationController(navigationModel);
NavigationProjector(navigationController, pinToNavElement);

navigationController.addPageController(homePageController);
navigationController.addPageController(aboutPageController);





