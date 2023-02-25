import { NavigationController }                            from "./navigation/navigationController.js";
// import { NavigationProjector }                             from "./navigation/basicNavigationProjector.js";
// import { NavigationProjector }                             from "./navigation/dashboard/dashboardNavigationProjector.js";
import { NavigationProjector }                             from "./navigation/dashboard-refined/dashboardRefinedNavigationProjector.js";
import { BubbleStateNavigationProjector }                  from "./navigation/bubble-state/bubblestateNavigationProjector.js";
import { TreeNavigationProjector }                         from "./navigation/basic-tree/basicTreeNavigationProjector.js";
import { CardNavigationProjector }                         from "./navigation/card/cardNavigationProjector.js";
import { BreadCrumbProjector }                             from "./navigation/bread-crumbs/breadCrumbProjector.js";
import { PageController }                                  from "./pages/pageController.js";
import { ForbiddenPageProjector }                          from "./pages/403/forbiddenPageProjector.js";
import { PageNotFoundProjector }                           from "./pages/404/pageNotFoundProjector.js";
import { DebugPageProjector }                              from "./pages/debug/debugPageProjector.js";
import { HomePageProjector }                               from "./pages/home/homePageProjector.js";
import { MasterDetailViewsPageProjector }                  from "./pages/masterDetailViews/masterDetailViewsPageProjector.js";
import { FormsPageProjector }                              from "./pages/forms/formsPageProjector.js";
import { WelcomePageProjector }                            from "./pages/welcome/welcomePageProjector.js";
import { Person, personSelectionMold }                     from "./pages/person/person.js";
import { PersonListController, PersonSelectionController } from "./pages/person/personController.js";
import { CarListController, CarSelectionController }       from "./pages/car/carController.js";
import { PersonPageProjector }                             from "./pages/person/personPageProjector.js";
import { Car,carSelectionMold }                            from "./pages/car/car.js";
import { CarPageProjector }                                from "./pages/car/carPageProjector.js";
import { WeekController }                                  from "./pages/workweek/workweek/weekController.js";
import { WorkWeekPageProjector }                     from "./pages/workweek/workWeekPageProjector.js";
import { CHECKBOX, COLOR, DATE, NUMBER, TEXT, TIME }       from "./kolibri/util/dom.js";
import { SimpleFormController }                            from "./kolibri/projector/simpleForm/simpleFormController.js";
import { SimpleFormPageProjector }                         from "./pages/simpleForm/simpleFormPageProjector.js";
import { PageSwitchProjector }                             from "./navigation/page-switch/pageSwitchProjector.js";
import {
    DEBUGMODE,
    DESCRIPTION,
    FAVICON,
    HOMEPAGE,
    ICONPATH,
    LOGO,
    NAME,
    NAVIGATIONAL,
    VISIBLE
} from "./kolibri/presentationModel.js";

const pinToContentElement = document.getElementById("content");

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

const homePageController = PageController("home", null);

homePageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: './navigation/icons/house.svg',
    [NAVIGATIONAL]: false
});
HomePageProjector(homePageController, pinToContentElement, './pages/home/home.html');

const masterDetailViewsPageController = PageController("masterdetailviews", null);
masterDetailViewsPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: './navigation/icons/masterdetail.svg',
    [NAVIGATIONAL]: false
});
MasterDetailViewsPageProjector(masterDetailViewsPageController, pinToContentElement, './pages/masterDetailViews/masterDetailViews.html');

const formsPageController = PageController("forms", null);
formsPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: './navigation/icons/forms.svg',
    [NAVIGATIONAL]: false
});
FormsPageProjector(formsPageController, pinToContentElement, './pages/forms/forms.html');

const welcomePageController = PageController("welcome", null);
welcomePageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: './navigation/icons/cute-robot.svg',
    [DESCRIPTION]: `Kolibri aims to be a sustainable, high-quality toolkit. 
    Contributions are validated through usability testing and automated tests. 
    Industry experts and academic advisers assess the code quality and the completeness of the documentation. 
    Every contribution must have proven its worth in an application.`
});
WelcomePageProjector(welcomePageController, pinToContentElement, './pages/welcome/welcome.html');

const personListController      = PersonListController(Person);
const personSelectionController = PersonSelectionController(personSelectionMold);
const personPageController = PageController("person", [personListController, personSelectionController]);
personPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: './navigation/icons/person.svg',
    [DESCRIPTION]: `Have a go and play around with adding new entries, selecting various entries, 
    start typing in either the master or the detail view, delete entries, and change the lastname to less than three characters. See what happens.`
});

const carListController      = CarListController(Car);
const carSelectionController = CarSelectionController(carSelectionMold);
const carPageController = PageController("car", [carListController, carSelectionController]);
carPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: './navigation/icons/car.svg',
    [DESCRIPTION]: `Have a go and play around with adding new entries, selecting various entries, 
    start typing in either the master or the detail view, delete entries, and change the brandname to less than three characters. See what happens.`,
});
CarPageProjector(carPageController, pinToContentElement, './pages/car/car.html');

const simpleWorkWeekPageController = PageController("workweek", [WeekController()]);
simpleWorkWeekPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: './navigation/icons/calendar.svg',
    [DESCRIPTION]: `We go from simple to more advanced user interfaces by combining previous work without touching (and possibly compromising) previous functionality. 
    You cannot break what you do not touch.`,
});

WorkWeekPageProjector(simpleWorkWeekPageController, pinToContentElement, './pages/workweek/workweek.html');

const formStructure = [
    {value: "Text",       label: "Text",   name: "text",   type: TEXT     },
    {value: 0,            label: "Number", name: "number", type: NUMBER   },
    {value: "1968-04-19", label: "Date",   name: "date",   type: DATE     },
    {value: 12 * 60 + 15, label: "Time",   name: "time",   type: TIME     },
    {value: false,        label: "Check",  name: "check",  type: CHECKBOX },
    {value: "",           label: "Color",  name: "color",  type: COLOR    }
];
const simpleFormController = SimpleFormController(formStructure);
const simpleFormPageController = PageController("simpleform", [simpleFormController]);
simpleFormPageController.setConfiguration(/** @type ModelConfigurationObject */ {
    [ICONPATH]: './navigation/icons/simpleform.svg',
    [DESCRIPTION]: `It only takes a single line of code to create the form, set up the presentation models, 
    and bind all required listeners such that model and view are always kept in sync. 
    After that, any controller can solely work on the presentation models without ever touching the view.
    `
});
SimpleFormPageProjector(simpleFormPageController, pinToContentElement, './pages/simpleForm/simpleForm.html');

const navigationController = NavigationController();
navigationController.setConfiguration(/** @type ModelConfigurationObject */ {
    [NAME]: 'Kolibri',
    [LOGO]: './img/logo/logo-new-128.svg',
    [FAVICON]: './img/logo/logo-new-128.svg',
    [HOMEPAGE]: welcomePageController,
    [DEBUGMODE]: true
});

const pinToNavElement = document.getElementById('nav');
BubbleStateNavigationProjector(navigationController, pinToNavElement);
const pinToDashboardNavElement = document.getElementById('dashboard-nav');
NavigationProjector(navigationController, pinToDashboardNavElement);
// const pinToTreeNavElement = document.getElementById('tree-nav');
// TreeNavigationProjector(navigationController, pinToTreeNavElement);
const pinToBreadCrumbElement = document.getElementById('bread-crumbs');
BreadCrumbProjector(navigationController, pinToBreadCrumbElement);

const debugController = PageController('debug', null);
debugController.setVisible(false);
const pinToDebugElement = document.getElementById('debug');
debugController.setIconPath('./navigation/icons/bug.svg');
DebugPageProjector(navigationController, debugController, pinToDebugElement);
const pinToCardNavElement = document.getElementById('card-nav');
const cardNavigationProjector = CardNavigationProjector(navigationController, pinToCardNavElement);
const cardGridProjector = cardNavigationProjector.getGridProjector();
cardGridProjector.setGridForPage(simpleWorkWeekPageController.getQualifier(), { rowSpan: 1 });
cardGridProjector.setGridForPage(simpleFormPageController.getQualifier(), { rowSpan: 1 });

navigationController.addPageControllers(errorForbiddenController, errorNotFoundController, debugController);
navigationController.addPageControllers(homePageController, masterDetailViewsPageController, formsPageController);
navigationController.addPageControllers(welcomePageController, personPageController, carPageController, simpleFormPageController, simpleWorkWeekPageController);

// Has to happen after adding to the navigation controller
welcomePageController.setParent(homePageController);
personPageController.setParent(masterDetailViewsPageController);
carPageController.setParent(masterDetailViewsPageController);
simpleFormPageController.setParent(formsPageController);
simpleWorkWeekPageController.setParent(formsPageController);

const personPageSwitchProjector = PageSwitchProjector(personPageController.getHash(), navigationController, 'e8dc0098a77a9109da6e879d8d9ed5a9');
PersonPageProjector(personPageController, pinToContentElement, './pages/person/person.html', personPageSwitchProjector);

