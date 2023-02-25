import { NavigationController }                            from "./navigation/navigationController.js";
import { CardNavigationProjector }                         from "./navigation/card/cardNavigationProjector.js";
import { PageController }                                  from "./pages/pageController.js";
import { ForbiddenPageProjector }                          from "./pages/403/forbiddenPageProjector.js";
import { PageNotFoundProjector }                           from "./pages/404/pageNotFoundProjector.js";
import { StaticPageProjector }                             from "./pages/StaticPageProjector.js";
import { DebugPageProjector }                              from "./pages/debug/debugPageProjector.js";
import { StyleGuidePageProjector }                         from "./pages/style-guide/styleGuidePageProjector.js";
import { PageSwitchProjector }                             from "./navigation/page-switch/pageSwitchProjector.js";

import {
    DEBUGMODE,
    FAVICON,
    HOMEPAGE,
    ICONPATH,
    LOGO,
    NAME, NAVIGATIONAL,
    VISIBLE
} from "./kolibri/presentationModel.js";


const pinToCardNavElement = document.getElementById('card-nav');
const pinToContentElement = document.getElementById("content");
const pinToDebugElement = document.getElementById('debug');

// Assembling 403 error page as example. Can be modified
const errorForbiddenController = PageController("E403", null);
errorForbiddenController.setConfiguration(/** @type ModelConfigurationObject */{
    [VISIBLE]: false
});
ForbiddenPageProjector(errorForbiddenController, pinToContentElement, './pages/403/forbidden.html');

// Assembling 404 error page as example. Can be modified
const errorNotFoundController = PageController("E404", null);
errorNotFoundController.setConfiguration(/** @type ModelConfigurationObject */{
    [VISIBLE]: false
});
PageNotFoundProjector(errorNotFoundController, pinToContentElement, './pages/404/pageNotFound.html');


/* ********************************************* PAGES ************************************************************ */
const homePageController = PageController("home", null);
StaticPageProjector(homePageController, pinToContentElement, './pages/home/home.html');

const docsPageController = PageController("docs", null);
docsPageController.setConfiguration(/** @type ModelConfigurationObject */ {
   [NAVIGATIONAL]: false
});

const gettingStartedController = PageController("getting-started", null);
StaticPageProjector(gettingStartedController, pinToContentElement, './pages/getting-started/getting-started.html');

const styleGuideController = PageController("style-guide", null);
StyleGuidePageProjector(styleGuideController, pinToContentElement, './pages/style-guide/style-guide.html');

const testCasesController = PageController("test-cases", null);
StaticPageProjector(testCasesController, pinToContentElement, './pages/test-cases/test-cases.html');

const examplePageController = PageController("example", null);
docsPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [NAVIGATIONAL]: false
});

const teamPageController = PageController('team', null);
StaticPageProjector(teamPageController, pinToContentElement, './pages/team/team.html');


const navigationController = NavigationController();
navigationController.setConfiguration(/** @type ModelConfigurationObject */{
    [NAME]: 'Kolibri',
    [LOGO]: './img/logo/logo-new-128.svg',
    [FAVICON]: './img/logo/logo-new-128.svg',
    [HOMEPAGE]: homePageController,
    [DEBUGMODE]: true
});

const debugController = PageController('debug', null);
debugController.setConfiguration(/** @type ModelConfigurationObject */{
    [VISIBLE]: false,
    [ICONPATH]: './navigation/icons/bug.svg'
});
DebugPageProjector(navigationController, debugController, pinToDebugElement);


const cardNavigationProjector = CardNavigationProjector(navigationController, pinToCardNavElement);
const cardGridProjector = cardNavigationProjector.getGridProjector();

navigationController.addPageControllers(
    errorForbiddenController,
    errorNotFoundController,
    debugController,
    homePageController,
    docsPageController,
    gettingStartedController,
    styleGuideController,
    testCasesController,
    examplePageController,
    teamPageController

);

gettingStartedController.setParent(docsPageController);
styleGuideController.setParent(docsPageController);
testCasesController.setParent(docsPageController);






