# sCalculus

## Specifications

As a minimal calculus sheet application, we will need to define all the current functionnalities before going to far in the developement process

The purpose of this application is to build a main base, to then be able to add different module to it and enhance it in the future.

Let's see further the details about that base.

### Main Features

First of all, the grid containing all the box inside is obviously the priority module, without it, anything can't be done.

Secondary (but important) features are all the status and toolbar (containning all the future controls we will input and the state at wich they are).

Last (but not least), is the link between the three main modules, that will enable each function communication between each other.

#### Usual usecase

The grid system must be initiated to certain values inside certain box. The user can select some or all of these box and apply a function to it into a desire box. The result will be desplayed in this specified box.

Going further with that system, if we think about a future modular application, we must consider every actors as independent. On this direction, we can spot different important things to count.

Each box can be an operation and operation can also be done each of these box.

### Extra Modules 

Until that base is enable, we will be able to provide a lot of functionnalities throughout modules that will implement specific behavior, for functions or box.
For a start, all function avaible are for example, addition, substraction, multiplication and division, we would like to implement someday a log function, that may apply a log 10 on selected boxes. Independant features may provide that kind of possibility by building an extra module.

### Concurrency Features Known

Main base and Modules applyed, we must consider the fact that concurrent apps may have a lot more features enabled like : graphs, exportation to pdf (and other), styling, sharing, multi-user editing and plenty more.
Considering that, I will not provide as much possibilities but it may be improved by external users (one day).

## TechCenter

- NodeJs
- MongoDb
- Express
- Mongoose
- AngularJs
- Less
- OAuth

## To Do 
 - [ ] User Management
 - [ ] Grid
 - [ ] Status bar
 - [ ] Functions bar
 - [ ] Link
