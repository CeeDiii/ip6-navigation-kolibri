# IP6: Research Projector for Advanced Navigation Support Kolibri
Bachelor Thesis project - University of Applied Sciences Northwestern Switzerland<br>
Fall semester 2022, 19.09.2022 – 24.03.2023<br>

The research paper can be found here: TODO

## Project experts/customers
• Prof. Dierk König<br>
• Fabian Affolter<br>

## Project team
• Florian Schnidrig, Student iCompetence<br>
• Cedric Altermatt, Student Computer Science<br>

## Project Idea
In the course of the predecessor project "Navigation support for Kolibri", a first prototype for a navigation approach for the Kolibri WebUI Toolkit  was created. This prototype enabled the creation of flat navigations for single-page-applications, which were created with Kolibri.

This IP6 project "Extended navigation support for Kolibri" is now based on this approach. The prototype will primarily be expanded in such a way that the navigation support is model-driven and supports multi-depth navigation hierarchies. Furthermore, new statuses and properties of the individual navigation nodes will be stored as attributes in the page model. For example, the visibility of a navigation node in the navigation, the child nodes of a navigation node, the active status of a navigation node, the icon of a navigation node and much more will represent attributes in the model. These attributes should also be easily extensible, so that the developer can easily add use-case-specific attributes.

## Project Goal
The goal of this project is a model-driven navigation that can be embedded in the context of Kolibri and validated with the user groups using various prototypes.

New approaches get tested with simple examples so that they can be easily verified whether they fit into the context of the project and provide the desired functionalities.

Implementation and management should be accessible and well documented for developers. Users will find a rich and interactive visualization of the navigation in Kolibri single page applications. The approaches pursued are provided with unit tests and validated with user tests.

The Kolibri navigation support will also be integrated into the official [Kolibri project website](https://webengineering-fhnw.github.io/Kolibri/index.html). The currently static site navigation will be replaced by the Kolibri navigation. The result of this project will be a functional prototype that allows to switch back and forth between the UI and the code in the individual example implementations, based on the functionality of the [JFX Ensemble](https://www.jfx-ensemble.com) showcase library. The implementation should adhere to the Kolibri design guidelines.

## Project Methodology
The procedure in this research project is iterative and incremental. The findings of an iteration serve as a basis for the further procedure. Solution approaches that meet the requirements are refined and implemented. Prototypes are validated with user groups. Automated tests are provided for quality assurance.

## Acknowledgment
We would like to express our sincere thanks to our lecturers, project clients and experts Prof. Dierk Koenig and Fabian Affolter. Without their regular feedback and exciting suggestions, this project would not have come about to the same extent and especially not in the same quality. Many thanks!

## Usage
TODO

### Remove the presentation stylesheet
If you want to use a single navigation projector for your project, remove the following stylesheet from `index.html`:
 
```html
<link rel="stylesheet" href="./navigation/prototypePresentation.css">
```


It is currently only used to combine all projectors onto one page for prototyping purposes.