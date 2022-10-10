import { PageProjector } from "./pages/pageProjector.js";
import { PageModel } from "./pages/pageModel.js";
import { homePage } from "./pages/homePage.js";
import { NavigationModel } from "./navigation/navigationModel.js";
import { NavigationController } from "./navigation/navigationController.js";
import { PageController } from "./pages/pageController.js";
import { NavigationProjector } from "./navigation/navigationProjector.js";

const homePageModel = PageModel('home', homePage);
const pageProjector = PageProjector(homePage());
const pageController = PageController(homePageModel, pageProjector);
const navigationInitializer = /** [HTMLAnchorElement] */ anchors => {
    const div = document.createElement("div");
    anchors.forEach(anchor => div.appendChild(anchor));
    return div;
};
const nav = document.getElementById("nav");
const navigationModel = NavigationModel();
const navigationController = NavigationController(navigationModel);
const navigationProjector = NavigationProjector(navigationController, nav, navigationInitializer);
console.log(navigationController.addPageController(pageController));
navigationProjector.projectNavigation();

