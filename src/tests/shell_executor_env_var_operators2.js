/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/
/*
Tests the handling of shell variables expansion operators,
specifically these pattern matching expansions:
   ${VAR#pattern}
   ${VAR##pattern}
   ${VAR%pattern}
   ${VAR%%pattern}

See
http://pubs.opengroup.org/onlinepubs/009695399/utilities/xcu_chap02.html#tag_02_06_02
Section "2.6.2 Parameter Expansion"

*/
"use strict";

var tests = [

//Create few variables - all internal shell actions, no output or errors expoected
[ "v1", "A=hellohelloworld",			{} ],

// remove shortest prefix
[ "e1", "echo ${A#*o}",			{ stdout: ["helloworld"] } ],

// remove longest prefix
[ "e2", "echo ${A##*o}",		{ stdout: ["rld"] } ],

// remove shortest suffix
[ "e3", "echo ${A%o*}",		{ stdout: ["hellohellow"] } ],

// remove longest suffix
[ "e4", "echo ${A%%o*}",		{ stdout: ["hell"] } ],
];

var assert = require('assert');

var run_shell_tests = require('utils/shell_testing_framework');

run_shell_tests(tests);

