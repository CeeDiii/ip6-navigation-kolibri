import { NavigationController }                            from "./navigation/navigationController.js";
import { CardNavigationProjector }                         from "./navigation/card/cardNavigationProjector.js";
import { PageController }                                  from "./pages/pageController.js";
import { ForbiddenPageProjector }                          from "./pages/403/forbiddenPageProjector.js";
import { PageNotFoundProjector }                           from "./pages/404/pageNotFoundProjector.js";
import { StaticPageProjector }                             from "./pages/StaticPageProjector.js";
import { DebugPageProjector }                              from "./pages/debug/debugPageProjector.js";
import { HomePageProjector }                               from "./pages/home/homePageProjector.js";
import { PageSwitchProjector }                             from "./navigation/page-switch/pageSwitchProjector.js";

const pinToCardNavElement = document.getElementById('card-nav');
const pinToContentElement = document.getElementById("content");
const pinToDebugElement = document.getElementById('debug');

// Assembling 403 error page as example. Can be modified
const errorForbiddenController = PageController("E403", null);
errorForbiddenController.setConfiguration({
    visible: false
});
ForbiddenPageProjector(errorForbiddenController, pinToContentElement, './pages/403/forbidden.html');

// Assembling 404 error page as example. Can be modified
const errorNotFoundController = PageController("E404", null);
errorNotFoundController.setConfiguration({
    visible: false
});
PageNotFoundProjector(errorNotFoundController, pinToContentElement, './pages/404/pageNotFound.html');


/* ********************************************* PAGES ************************************************************ */
const homePageController = PageController("home", null);
StaticPageProjector(homePageController, pinToContentElement, './pages/home/home.html');

const docsPageController = PageController("docs", null);
StaticPageProjector(docsPageController, pinToContentElement, './pages/docs/docs.html');

const navigationController = NavigationController();
navigationController.setConfiguration({
    name: 'Kolibri',
    logo: './img/logo/logo-new-128.svg',
    favicon: './img/logo/logo-new-128.svg',
    homepage: homePageController.getHash(),
    debugmode: true
});

const debugController = PageController('debug', null);
debugController.setConfiguration({
    visible: false,
    icon: './navigation/icons/bug.svg'
});
DebugPageProjector(navigationController, debugController, pinToDebugElement);


const cardNavigationProjector = CardNavigationProjector(navigationController, pinToCardNavElement);
const cardGridProjector = cardNavigationProjector.getGridProjector();
navigationController.addPageControllers(errorForbiddenController, errorForbiddenController, debugController);

navigationController.addPageControllers(errorForbiddenController,
                                        errorForbiddenController,
                                        debugController,
                                        homePageController,
                                        docsPageController);






