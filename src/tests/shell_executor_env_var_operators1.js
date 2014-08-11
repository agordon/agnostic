/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/
/*
Tests the handling of shell variables expansion operators

Specifically, tests:
   ShellExecutor (see Token/EnvVarOperation)


See
http://pubs.opengroup.org/onlinepubs/009695399/utilities/xcu_chap02.html#tag_02_06_02
Section "2.6.2 Parameter Expansion"

*/
"use strict";

var tests = [

//Create few variables - all internal shell actions, no output or errors expoected
[ "v1", "SET=FOO",			{} ],
//This ENV VAR is set be empty (i.e. "null" in shell terminology)
[ "v2", "SETNUL=''",			{} ],
// One more variable is "UNSET" which doesn't exist (i.e. un-set)

//Operator ':-'
[ "e1", "echo ${SET:-BAR}",		{ stdout: ["FOO"] } ],
[ "e2", "echo ${SETNUL:-BAR}",		{ stdout: ["BAR"] } ],
[ "e3", "echo ${UNSET:-BAR}",		{ stdout: ["BAR"] } ],

//Operator '-'
[ "e4", "echo ${SET-BAR}",		{ stdout: ["FOO"] } ],
//NOTE:
// Variable is NULL, shell returns NULL - in the testing framework, it will be considered
// as "no STDOUT output"
[ "e5", "echo ${SETNUL-BAR}",		{ } ],
[ "e6", "echo ${UNSET-BAR}",		{ stdout: ["BAR"] } ],

//Operator ':='
[ "e7",  "echo ${SET:=BAR}",		{ stdout: ["FOO"] } ],
// 'SET' was set, value should not change
[ "e7.1","echo $SET",			{ stdout: ["FOO"] } ],
[ "e8",  "echo ${SETNUL:=BAR}",		{ stdout: ["BAR"] } ],
// 'SETNUL' was NULL, should have been re-assigned
[ "e8.1","echo $SETNUL",		{ stdout: ["BAR"] } ],
[ "e9",  "echo ${UNSET:=BAR}",		{ stdout: ["BAR"] } ],
// 'UNSET' not set, should have been created
[ "e9.1","echo $UNSET",			{ stdout: ["BAR"] } ],
//Reset variables for following tests
[ "r1",  "SETNUL=''",			{} ],
[ "r2",  "unset UNSET",			{} ],


//Operator '='
[ "e10", "echo ${SET=BAR}",		{ stdout: ["FOO"] } ],
[ "e11", "echo ${SETNUL=BAR}",		{ } ],
[ "e12", "echo ${UNSET=BAR}",		{ stdout: ["BAR"] } ],
[ "e12.1","echo $UNSET",		{ stdout: ["BAR"] } ],
//Reset variables for following tests
[ "r3",  "SETNUL=''",			{} ],
[ "r4",  "unset UNSET",			{} ],

//Operator ':?'
[ "e13", "echo ${SET:?BAR}",		{ stdout: ["FOO"] } ],

//TODO: Shell should exit with error in these tests - not yet implemented
//[ "e14", "echo ${SETNUL:?BAR}",		{ stdout: ["BAR"] } ],
//[ "e15", "echo ${UNSET:?BAR}",		{ stdout: ["BAR"] } ],

//Operator '?'
[ "e16", "echo ${SET?BAR}",		{ stdout: ["FOO"] } ],
[ "e17", "echo ${SETNUL?BAR}",		{ } ],
//TODO: Shell should exit with error in this tests - not yet implemented
//[ "e18", "echo ${UNSET?BAR}",		{ stdout: ["BAR"] } ],

//Operator ':+'
[ "e19", "echo ${SET:+BAR}",		{ stdout: ["BAR"] } ],
[ "e20", "echo ${SETNUL:+BAR}",		{ } ],
[ "e21", "echo ${UNSET:+BAR}",		{ } ],

//Operator '+'
[ "e22", "echo ${SET+BAR}",		{ stdout: ["BAR"] } ],
[ "e23", "echo ${SETNUL+BAR}",		{ stdout: ["BAR"] } ],
[ "e24", "echo ${UNSET+BAR}",		{ }],


//Test expansion of non-literal values

// SETNUL is empty, should be expanded to the value of '$SET'
[ "e50", "echo ${SETNUL:-${SET}}",	{ stdout: ["FOO"] }],

[ "e51", "echo ${SETNUL:-AA${SET}BB}",	{ stdout: ["AAFOOBB"] }],
[ "e52", "echo ${SETNUL:-$(echo hi)}",	{ stdout: ["hi"] }],

// Expand with whitespace
// NOTE: this 'echo' is part of the testing framework
//       (defined in './src/node_modules/utils/shell_testing_framework.js' )
//       which is why each parameter is printed in a new line.
//       In a 'real' echo, those will be printed on the same line.
[ "e53", "echo ${SETNUL:-AAA BBB}",	{ stdout: ["AAA","BBB"] }],
// Double-quoted expansion - becomes one parameter despite whitespace
[ "e54", "echo \"${SETNUL:-AAA BBB}\"",	{ stdout: ["AAA BBB"] }],

// Length Operation
[ "e55", "echo ${#SET}",                { stdout: ["3"] }],


];

var assert = require('assert');

var run_shell_tests = require('utils/shell_testing_framework');

run_shell_tests(tests);

