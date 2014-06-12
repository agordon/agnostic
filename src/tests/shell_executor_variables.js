/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/
/*
Tests the handling of shell variables when executing external programs.

Specifically, tests the interaction between:
   ShellExecutor (see 'runExternalCommand()' )
   ProcessState  (see 'clone' and ENV related functions)
   ShellState

NOTE:
These tests DO NOT yet test the ShellExecutor's ability to expand variables
(e.g. no "${VAR}" in the tested command line). There's another unit test for that.


TODO:
Implement and Test inheriting ENV variables from parent processes.
(and make them all exportable by default).
*/
"use strict";


var tests = [

//Internal variable (not exported) -
// the external program should not see any ENV variables
[ "v1", "FOO=BAR",			{} ],
[ "v2", "env",				{} ],

//mark "FOO" as exportable - the shell should pass it to the external program
[ "v3", "export FOO",			{} ],
[ "v4", "env",				{ stdout: [ "FOO=BAR"] } ],

//change its value, since it's exportable, the external program should see the new value
[ "v5", "FOO=ZOOM",			{} ],
[ "v6", "env",				{ stdout: [ "FOO=ZOOM"] } ],

//unset it, the program should not see it again
[ "v7", "unset FOO",			{} ],
[ "v8", "env" ,				{} ],

//Set it again
[ "v9", "export FOO=LOO",		{} ],
[ "v10", "env" ,			{ stdout: [ "FOO=LOO"] } ],

//Add variable assignment for the program only
//internal (non-exported) variable)
[ "v11", "OOO=PPP",			{} ],
[ "v12", "export FOO=LOO",		{} ],
[ "v13", "A=B env" ,			{ stdout: [ "A=B", "FOO=LOO"] } ],

//show all variables (including non-exported) in the shell)
// OOO should be there (it's internal),
// but "A" should not be (it was specific for the previous program execution)
[ "v14", "set",				{  stdout: [ "FOO='LOO'","OOO='PPP'"] } ],

//Variable override
[ "v15", "unset FOO OOO",		{} ],
[ "v16", "export A=1 B=2",		{} ],

//A=9 should override the exported variable above
[ "v17", "C=3 A=9 env",			{ stdout: [ "A=9", "B=2", "C=3"] } ],
];

var assert = require('assert');

var run_shell_tests = require('utils/shell_testing_framework');

run_shell_tests(tests);

