import { PageProjector } from "./pages/pageProjector.js";
import { PageModel } from "./pages/pageModel.js";
import { homePage } from "./pages/homePage.js";
import { NavigationModel } from "./navigation/navigationModel.js";
import { NavigationController } from "./navigation/navigationController.js";
import { PageController } from "./pages/pageController.js";
import { NavigationProjector } from "./navigation/navigationProjector.js";

const homePageModel = PageModel('home', homePage);
const homePageController = PageController(homePageModel);
const homePageProjector = PageProjector(homePageController);

const testPageModel = PageModel('test', homePage);
const testPageController = PageController(testPageModel);
const testPageProjector = PageProjector(testPageController);

const navigationModel = NavigationModel();
const navigationController = NavigationController(navigationModel);
const navigationProjector = NavigationProjector(navigationController);

navigationModel.addNavigationPoint(homePageModel);
navigationModel.addNavigationPoint(testPageModel);
