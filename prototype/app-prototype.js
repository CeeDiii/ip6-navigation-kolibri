import { NavigationController }                            from './navigation/navigationController.js';
import { CardNavigationProjector }                         from './navigation/card/cardNavigationProjector.js';
import { PageController }                                  from './pages/pageController.js';
import { ForbiddenPageProjector }                          from './pages/403/forbiddenPageProjector.js';
import { PageNotFoundProjector }                           from './pages/404/pageNotFoundProjector.js';
import { StaticPageProjector }                             from './pages/StaticPageProjector.js';
import { PageSwitchProjector }                             from './navigation/page-switch/pageSwitchProjector.js';
import { DebugPageProjector }                              from './pages/debug/debugPageProjector.js';
import { StyleGuidePageProjector }                         from './pages/style-guide/styleGuidePageProjector.js';
import { SimpleFormController }                            from "./kolibri/projector/simpleForm/simpleFormController.js";
import { SimpleFormPageProjector }                         from "./pages/simpleForm/simpleFormPageProjector.js";
import { TestCasesPageProjector }                          from "./pages/test-cases/testCasesPageProjector.js";
import { DayController }                                   from "./pages/workday/dayController.js";
import { WorkDayPageProjector }                            from "./pages/workday/workDayPageProjector.js";
import { WeekController }                                  from "./pages/workweek/workweek/weekController.js";
import { WorkWeekPageProjector }                           from "./pages/workweek/workWeekPageProjector.js";
import { PersonPageProjector }                             from "./pages/person/personPageProjector.js";
import { PersonListController, PersonSelectionController}  from "./pages/person/personController.js";
import { Person, personSelectionMold }                     from "./pages/person/person.js";


import {
    DEBUGMODE, DESCRIPTION,
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
    [VALUE]: "Getting Started",
    [DESCRIPTION]: `Kolibri is a lightweight web UI toolkit without any dependencies. You can easily copy and integrate it into your own project.
    It includes documentation, examples, and a testing facility.
    Start building your SPA with Kolibri now!`
});
StaticPageProjector(gettingStartedController, pinToContentElement, './pages/getting-started/getting-started.html');

const styleGuideController = PageController('style-guide', null);
styleGuideController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "./navigation/icons/palette.svg",
    [VALUE]: "Style Guide",
    [DESCRIPTION]: `The style guide is the go-to resource for everything related to styling Kolibri.`
});
StyleGuidePageProjector(styleGuideController, pinToContentElement, './pages/style-guide/style-guide.html');

const testCasesController = PageController('test-cases', null);
testCasesController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "./navigation/icons/test.svg",
    [VALUE]: "Test Cases",
    [DESCRIPTION]: `Have a look at the live test case report.`
});
TestCasesPageProjector(testCasesController, pinToContentElement, './pages/test-cases/test-cases.html');

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
    [VALUE]: "Simple Form",
    [DESCRIPTION]: `With Kolibri, you can easily create model-view-controller forms using the projector pattern with just one line of code. 
    This simple form makes it easy to get started. 
    With this example you will learn, how bindings work in Kolibri and why they are useful.
    Give it a try!`
});
const simpleFormPageSwitchProjector = PageSwitchProjector(simpleFormPageController.getHash(), navigationController, 'b8b91e5db694d34644fea5c013ac9f75');
SimpleFormPageProjector(simpleFormPageController, pinToContentElement, './pages/simpleForm/simpleForm.html', simpleFormPageSwitchProjector);

const workDayPageController = PageController('workday', [DayController()]);
workDayPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "./navigation/icons/day.svg",
    [VALUE]: "Work Day",
    [DESCRIPTION]: `The Work Day example shows you how you can easily add business rules to your form.`
});
const workDaySwitchProjector = PageSwitchProjector(workDayPageController.getHash(), navigationController, '0aab51fd5a5a4d77bd15d3d6050555c2');
WorkDayPageProjector(workDayPageController, pinToContentElement, './pages/workday/workday.html', workDaySwitchProjector);

const workWeekPageController = PageController('workweek', [WeekController()]);
workWeekPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "./navigation/icons/calendar.svg",
    [VALUE]: "Work Week",
    [DESCRIPTION]: `The work week brings everything together through composition of components.`
});
const workWeekSwitchProjector = PageSwitchProjector(workWeekPageController.getHash(), navigationController, '20f45f893355e993f826446ffd73845e');
WorkWeekPageProjector(workWeekPageController, pinToContentElement, './pages/workweek/workweek.html', workWeekSwitchProjector);


const personListController      = PersonListController(Person);
const personSelectionController = PersonSelectionController(personSelectionMold);
const personPageController = PageController("masterdetail", [personListController, personSelectionController]);
personPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: "./navigation/icons/masterdetail.svg",
    [VALUE]: "Master Detail View",
    [DESCRIPTION]: `This master detail view example shows, how easy multi-way editing and consistent updates throughout the application are. 
    All entries are immediately synchronized, whether you edit in the master or detail view. 
    You can build complex UIs without ever installing a dependency.`
});
const personSwitchProjector = PageSwitchProjector(personPageController.getHash(), navigationController, 'ee23d660b99cb062170d2a495d7698dd');
PersonPageProjector(personPageController, pinToContentElement, './pages/person/person.html', personSwitchProjector);


const cardNavigationProjector = CardNavigationProjector(navigationController, pinToCardNavElement);
const cardGridProjector = cardNavigationProjector.getGridProjector();
cardGridProjector.setGridForPage(styleGuideController.getQualifier(), { rowSpan: 1});
cardGridProjector.setGridForPage(testCasesController.getQualifier(), { rowSpan: 1});
cardGridProjector.setGridForPage(workDayPageController.getQualifier(), { rowSpan: 1});
cardGridProjector.setGridForPage(workWeekPageController.getQualifier(), { rowSpan: 1});

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
    workDayPageController,
    workWeekPageController,
    personPageController,
    teamPageController
);

gettingStartedController.setParent(docsPageController);
styleGuideController.setParent(docsPageController);
testCasesController.setParent(docsPageController);
simpleFormPageController.setParent(examplePageController);
workDayPageController.setParent(examplePageController);
workWeekPageController.setParent(examplePageController);
personPageController.setParent(examplePageController);


