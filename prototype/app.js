import { PageProjector } from "./pages/pageProjector.js";
import { PageModel } from "./pages/pageModel.js";
import { homePage } from "./pages/homePage.js";
import { NavigationModel } from "./navigation/navigationModel.js";
import { NavigationController } from "./navigation/navigationController.js";
import { PageController } from "./pages/pageController.js";

const homePageModel = PageModel('home', homePage);
const homePageController = PageController(homePageModel);
const homePageProjector = PageProjector(homePageController);

const subPageModel = PageModel('sub', homePage);
const subPageController = PageController(subPageModel);
const subPageProjector = PageProjector(subPageController);

homePageController.activate();
homePageController.onActiveChanged(event => console.log(homePageProjector));
homePageController.activate();
homePageController.passivate(() => {});



/*
const homePageProj = PageProjector(homePage);
const homePageController =

const homePagePage = PageModel('home', homePageProj);
const testPage = PageModel('test', homePageProj);

const model = NavigationModel(homePagePage);
const controller = NavigationController(model);

controller.addNavigationPoint(testPage);
*/
