import { PageProjector } from "./pages/pageProjector.js";
import { Page } from "./pages/page.js";
import { homePage } from "./pages/homePage.js";
import { NavigationModel } from "./navigation/navigationModel.js";
import { NavigationController } from "./navigation/navigationController.js";


const homePageProj = PageProjector(homePage);

const homePagePage = Page('home', homePageProj);
const testPage = Page('test', homePageProj);

const model = NavigationModel(homePagePage);
const controller = NavigationController(model);

controller.addNavigationPoint(testPage);
controller.setLocation('test');

