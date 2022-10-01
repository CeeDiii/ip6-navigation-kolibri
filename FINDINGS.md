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
### Classes
* classes can implement interfaces
* class expression syntax can be used
### @interface and @implements
* two types of interfaces
* top-level @interface definition
* virtual comments
* no obligation to correctly implement the interface 
* proposal on how to properly use interfaces from Pro Javascript Design Patterns book
* @implements can only be used on a @constructor function
#### top-level interface
* error can be thrown when interface methods are called directly
* can be declared in class syntax, similar to other oop languages
#### virtual interface
* clean and easy
* clear abstraction from declaration and implementation
* less unexpected behaviour when implementing it
#### Advantages @interface and @implements
* easy to set up
* documentation is forced
* flexible
* declared parameters need to be implemented, otherwise an error is thrown
* return type is checked
* interfaces cannot be instantiated
#### Disadvantages @interface and @implements
* badly documented by jsdoc
* adaption to the interface are allowed, even though the linter marks it as a problem
* developers without code checkers could not even notice that interface implementation was necessary
* caller has to type-cast to interface type
* additional parameters can be added without a problem, even though they are not declared -> if a return type (also void) is added to jsdoc in the interface, it correctly shows a problem when trying to add additional parameters or return types
* jsdoc is not passed through to implementation
### restrictive interface
* Interface implementation according to the style of Pro Javascript Design Patterns
* tries to follow principles of other programming languages
* if it walks like a duck, and it quacks like a duck, it most certainly is a duck
#### Advantages restrictive interface
* easily understandable for OOP developers
* interface implementation is forced -> no unexpected runtime behaviour
#### Disadvantages restrictive interface
* Complex logic
* Has to be tested
* Implementation of methods is not checked -> as long as interface is fulfilled, any side effects can be added
* Strict copyright license
### Kolibri-version interface
* Kolibri uses typedef for declaration of interfaces
* Wrapper-like constructor for interface type
#### Advantages Kolibri-version interface
* JSDoc is visible in implementation
* no dependency to behaviour of @interface
* functions of subtype cannot be called
* Transparency of structure
* Kolibri coding convention is followed
#### Disadvantages Kolibri-version interface
* Interface declaration happens in JSDoc comment -> not straight up visible
* Interface style from other programming languages is not followed -> initial effort is needed to understand this interface implementation
## JSDoc
* JSDoc supports Typescript annotations such as @param, @returns, @callback etc.
* Generics do not exist in plain Javascript
## Sources
Object Prototypes: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes, 24.09.2022<br> 
Object Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor?retiredLocale=de, 24.09.2022<br>
Arrow function constraints: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions?retiredLocale=de, 24.09.2022<br>
Class expression: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class, 26.09.2022
JSDoc interface: https://jsdoc.app/tags-interface.html, 24.09.2022<br>
JSDoc interface examples: https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler#interface-record, 24.09.2022<br>
JSDoc interface alternative implementation (ref to book): https://gate4.com/blog/interfaces-mit-javascript/, 24.09.2022<br>
Pro JavaScript Design Patterns: Harmes, R. & Diaz, D. (2008). Pro JavaScript Design Patterns. Apress., p.11- p.20<br>
JSDoc Typescript annotations: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html, 01.10.2022<br>
