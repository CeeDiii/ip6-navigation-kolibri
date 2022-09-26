# Collection of findings for IP6
## OOP in Javascript
### Prototype property
* prototype chaining -> checking for properties to exist on prototype of current object until undefined is returned
* Object {} is the prototype for everything
### Object constructor
* can implement interfaces
* Arrow functions cannot be used as constructors
### Arrow function constraints
* no access to this keyword in arrow function
### @interface and @implements
* two types of interfaces
  * top-level @interface definition
  * virtual comments
* no obligation to correctly implement the interface 
* proposal on how to properly use interfaces from Pro Javascript Design Patterns book
* @implements can only be used on a @constructor function
#### top-level interface
* officially throws an error when being called without implementation but does not work
* has to be defined with jsdoc comments, so there is no clear need to declare the function signature
#### virtual interface
* clean and easy
* clear abstraction from declaration and implementation
* less unexpected behaviour when implementing it
#### Advantages 
* easy to set up
* documentation is forced
* flexible
#### Disadvantages
* badly documented by jsdoc
* adaption to the interface are allowed, even though the linter marks it as a problem
* 

## Sources
Object Prototypes: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes, 24.09.2022<br> 
Object Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor?retiredLocale=de, 24.09.2022<br>
Arrow function constraints: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions?retiredLocale=de, 24.09.2022<br>
JSDoc interface: https://jsdoc.app/tags-interface.html, 24.09.2022<br>
JSDoc interface examples: https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler#interface-record, 24.09.2022<br>
JSDoc interface alternative implementation (ref to book): https://gate4.com/blog/interfaces-mit-javascript/, 24.09.2022<br>