/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/
/*
Tests the handling of shell variables expansion.

Specifically, tests the interaction between:
   ShellExecutor (see Token/EnvVar/EnvVarOperation)

*/
"use strict";

var tests = [

//Create few variables - all internal shell actions, no output or errors expoected
[ "v1", "FOO=BAR",			{} ],
[ "v2", "A=B"		,		{} ],
[ "v3", 'C="HELLO WORLD"',		{} ],

// Simple variable expansion
[ "e1", "echo $FOO",			{ stdout: ["BAR"] } ],
[ "e2", "echo ${FOO}",			{ stdout: ["BAR"] } ],
[ "e3", 'echo "${FOO}"',		{ stdout: ["BAR"] } ],
[ "e4", 'echo "$FOO"',			{ stdout: ["BAR"] } ],

// parameter expansion for the arguments happens BEFORE
//    variable assignment. FOO should be still BAR, not ZOO.
[ "e5", "FOO=ZOO echo $FOO",		{ stdout: [ "BAR" ] } ],

//double-quoted string
[ "e6", 'echo "$FOO"',			{ stdout: [ "BAR"] } ],

//single-quoted string
[ "e7", "echo '$FOO'",			{ stdout: [ "$FOO"] } ],

//compound string
[ "e8", 'echo "LO$FOO"',		{ stdout: [ "LOBAR"] } ],

//curly braces
[ "e9", 'echo ${FOO}',			{ stdout: [ "BAR"] } ],

//curly braces + more
[ "e10", 'echo LO${FOO}HI',		{ stdout: [ "LOBARHI"] } ],

//curly braces + more
[ "e11", 'echo ${FOO}$FOO',		{ stdout: [ "BARBAR"] } ],

//two variables
[ "e12", 'echo ${A}$FOO',		{ stdout: [ "BBAR"] } ],

//non-existing variable
[ "e13", 'echo ==$ZOOM==',		{ stdout: [ "===="] } ],

//single parameter with whitespace
[ "e14", 'echo "$FOO BAR"',		{ stdout: [ "BAR BAR"] } ],

//two parameters
[ "e15", 'echo "$FOO" "BAR"',		{ stdout: [ "BAR", "BAR"] } ],

//two parameters
[ "e16", 'echo "$FOO" "BAR"',		{ stdout: [ "BAR", "BAR"] } ],

//a variable which expands with whitespace, inside doublequotes - single parameter
[ "e17", 'echo "$C"',			{ stdout: [ "HELLO WORLD"] } ],

//a variable which expands with whitespace, becomes two parameters
[ "e18", 'echo $C',			{ stdout: [ "HELLO","WORLD"] } ],

//field-splitting tricks - this should expand to 'echo uname -s'
[ "e19", 'e="me -s"',			{ } ],
[ "e20", 'echo una$e',			{ stdout: [ "uname","-s"] } ],

//Assignment can contain expansions
[ "e23", "K=U$FOO",			{ } ],
[ "e24", 'echo $K',			{ stdout: [ "UBAR"] } ],

//Assignment which expands with whitespace - a single variable
[ "e25", "K=ZZ${C}ZZ",			{ } ],
[ "e26", 'echo "$K"',			{ stdout: [ "ZZHELLO WORLDZZ"] } ],

//Assignment which expands with whitespace - a single variable
[ "e27", "K=ZZ$C",			{} ],
[ "e28", 'echo "$K"',			{ stdout: [ "ZZHELLO WORLD"] } ],

];

var assert = require('assert');

var run_shell_tests = require('utils/shell_testing_framework');

run_shell_tests(tests);

