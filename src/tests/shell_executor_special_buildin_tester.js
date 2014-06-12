/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/
/*
Tests VERY PRIMITIVE funtionality of variable assignment,
and Special-Built-in Functions.

Specifically, this tests the ShellState usage inside
the ShellExecutor.

*/
"use strict";

var tests = [
// Shell Internal: assignment without a command - set shell variables.
[ "s1", "FOO=BAR HELLO=WORLD",		{}],

// Shell Special Build-in Utilities
[ "s2", "unset HELLO",		{}],
[ "s3", "export FOO",		{}],
[ "s4", "readonly A=B",		{}],

// List exported variables
[ "s5", "export -p" ,		{ stdout: [ "export FOO='BAR'" ] } ],

// List readonly variables
[ "s6", "readonly -p" ,		{ stdout: [ "readonly A='B'" ] }],

// List all variables
[ "s7", "set",			{ stdout: [ "A='B'", "FOO='BAR'" ] }],

// run the NULL internal command (should have no effect)
[ "s8", ":",			{}],

// run the NULL command, the assignment should not affect the current shell
[ "s9", "FOO=ZOOM :",		{}],

//FOO should have the current value (BAR), not "ZOOM" from the above command.
[ "s10", "set" ,		{ stdout: [ "A='B'", "FOO='BAR'" ] }],

// Setting to empty value is different than unset
[ "s11", "FOO=''",		{}],
[ "s13", "set" ,		{ stdout: [ "A='B'", "FOO=''" ] } ],

];

var assert = require('assert');

var run_shell_tests = require('utils/shell_testing_framework');

run_shell_tests(tests);
