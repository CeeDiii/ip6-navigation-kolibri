import { NavigationController }                            from './navigation/navigationController.js';
import { CardNavigationProjector }                         from './navigation/card/cardNavigationProjector.js';
import { PageController }                                  from './pages/pageController.js';
import { ForbiddenPageProjector }                          from './pages/403/forbiddenPageProjector.js';
import { PageNotFoundProjector }                           from './pages/404/pageNotFoundProjector.js';
import { StaticPageProjector }                             from './pages/StaticPageProjector.js';
import { DebugPageProjector }                              from './pages/debug/debugPageProjector.js';
import { StyleGuidePageProjector }                         from './pages/style-guide/styleGuidePageProjector.js';
import { SimpleFormController }                            from "./kolibri/projector/simpleForm/simpleFormController.js";
import { SimpleFormPageProjector }                         from "./pages/simpleForm/simpleFormPageProjector.js";
import { PageSwitchProjector }                             from './navigation/page-switch/pageSwitchProjector.js';
import { DayController }                                   from "./pages/workday/dayController.js";
import { WorkDayPageProjector }                            from "./pages/workday/workDayPageProjector.js";
import { WeekController }                                  from "./pages/workweek/workweek/weekController.js";
import { WorkWeekPageProjector }                           from "./pages/workweek/workWeekPageProjector.js";

import {
    DEBUGMODE,
    FAVICON,
    HOMEPAGE,
    ICONPATH,
    LOGO,
    NAME, NAVIGATIONAL, VALUE,
    VISIBLE
} from './kolibri/presentationModel.js';
import {
    CHECKBOX,
    COLOR,
    DATE,
    NUMBER,
    TEXT,
    TIME
} from "./kolibri/util/dom.js";

const pinToCardNavElement = document.getElementById('card-nav');
const pinToContentElement = document.getElementById('content');
const pinToDebugElement = document.getElementById('debug');

// Assembling 403 error page as example. Can be modified
const errorForbiddenController = PageController('E403', null);
errorForbiddenController.setConfiguration(/** @type ModelConfigurationObject */{
    [VISIBLE]: false
});
ForbiddenPageProjector(errorForbiddenController, pinToContentElement, './pages/403/forbidden.html');

// Assembling 404 error page as example. Can be modified
const errorNotFoundController = PageController('E404', null);
errorNotFoundController.setConfiguration(/** @type ModelConfigurationObject */{
    [VISIBLE]: false
});
PageNotFoundProjector(errorNotFoundController, pinToContentElement, './pages/404/pageNotFound.html');


/* ********************************************* PAGES ************************************************************ */
const homePageController = PageController('home', null);
StaticPageProjector(homePageController, pinToContentElement, './pages/home/home.html');

const docsPageController = PageController('docs', null);
docsPageController.setConfiguration(/** @type ModelConfigurationObject */ {
   [NAVIGATIONAL]: false
});

const gettingStartedController = PageController('getting-started', null);
gettingStartedController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "./navigation/icons/start.svg",
    [VALUE]: "Getting Started"
});
StaticPageProjector(gettingStartedController, pinToContentElement, './pages/getting-started/getting-started.html');

const styleGuideController = PageController('style-guide', null);
styleGuideController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "./navigation/icons/palette.svg",
    [VALUE]: "Style Guide"
});
StyleGuidePageProjector(styleGuideController, pinToContentElement, './pages/style-guide/style-guide.html');

const testCasesController = PageController('test-cases', null);
testCasesController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "./navigation/icons/test.svg",
    [VALUE]: "Test Cases"
});
StaticPageProjector(testCasesController, pinToContentElement, './pages/test-cases/test-cases.html');

const examplePageController = PageController('example', null);
examplePageController.setConfiguration(/** @type ModelConfigurationObject */ {
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

const formStructure = [
    {value: "Text",       label: "Text",   name: "text",   type: TEXT     },
    {value: 0,            label: "Number", name: "number", type: NUMBER   },
    {value: "1968-04-19", label: "Date",   name: "date",   type: DATE     },
    {value: 12 * 60 + 15, label: "Time",   name: "time",   type: TIME     },
    {value: false,        label: "Check",  name: "check",  type: CHECKBOX },
    {value: "",           label: "Color",  name: "color",  type: COLOR    }
];
const simpleFormPageController = PageController('simpleform', [SimpleFormController(formStructure)]);
simpleFormPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "./navigation/icons/forms.svg",
    [VALUE]: "Simple Form"
});
const simpleFormPageSwitchProjector = PageSwitchProjector(simpleFormPageController.getHash(), navigationController, 'e8dc0098a77a9109da6e879d8d9ed5a9');
SimpleFormPageProjector(simpleFormPageController, pinToContentElement, './pages/simpleForm/simpleForm.html', simpleFormPageSwitchProjector);

const workDayController = PageController('workday', [DayController()]);
workDayController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "./navigation/icons/day.svg",
    [VALUE]: "Work Day"
});
const workDaySwitchProjector = PageSwitchProjector(workDayController.getHash(), navigationController, 'e8dc0098a77a9109da6e879d8d9ed5a9');
WorkDayPageProjector(workDayController, pinToContentElement, './pages/workday/workday.html', workDaySwitchProjector);

const workWeekController = PageController('workweek', [WeekController()]);
const workWeekSwitchProjector = PageSwitchProjector(workWeekController.getHash(), navigationController, 'e8dc0098a77a9109da6e879d8d9ed5a9');
WorkWeekPageProjector(workWeekController, pinToContentElement, './pages/workweek/workweek.html', workWeekSwitchProjector);

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
    simpleFormPageController,
    workDayController,
    workWeekController,
    teamPageController
);

gettingStartedController.setParent(docsPageController);
styleGuideController.setParent(docsPageController);
testCasesController.setParent(docsPageController);
simpleFormPageController.setParent(examplePageController);
workDayController.setParent(examplePageController);
workWeekController.setParent(examplePageController);









