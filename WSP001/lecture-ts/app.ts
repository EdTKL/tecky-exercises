import dotenv from "dotenv";
import fs from "fs";

import Cls from "./Cls";
import { lib } from "./lib";
import { func } from "./func";

/* lib is a name exported object from the module lib.*/
console.log(lib.someObject); /* should print "Hello World"*/
console.log(lib.someFunction()); /* should print "Foobar"*/

/* Cls is a function which is exported as the default export of the module Cls*/
console.log( Cls() ); 

/* func is a function which is exported as the named export of the module func */
console.log( func() );