import { PageProjector } from "./pages/pageProjector.js";
import { PageModel } from "./pages/pageModel.js";
import { homePage } from "./pages/homePage.js";
import { NavigationModel } from "./navigation/navigationModel.js";
import { NavigationController } from "./navigation/navigationController.js";
import { PageController } from "./pages/pageController.js";
import { NavigationProjector } from "./navigation/navigationProjector.js";
import { aboutPage } from "./pages/aboutPage.js";

const homePageModel = PageModel('home', homePage);
const homePageProjector = PageProjector(homePage());
const homePageController = PageController(homePageModel, homePageProjector);
const navigationInitializer = /** [HTMLAnchorElement] */ anchors => {
    const div = document.createElement("div");
    anchors.forEach(anchor => div.appendChild(anchor));
    return div;
};
const nav = document.getElementById("nav");
const navigationModel = NavigationModel();
const navigationController = NavigationController(navigationModel);
const navigationProjector = NavigationProjector(navigationController, nav, navigationInitializer);
navigationController.addPageController(homePageController);
navigationProjector.projectNavigation();

//
// const aboutPageModel = PageModel('about', aboutPage);
// const aboutPageProjector = PageProjector(aboutPage());
// const aboutPageController = PageController(aboutPageModel, aboutPageProjector);
//



