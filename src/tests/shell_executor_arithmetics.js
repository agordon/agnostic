/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/
/*
Tests the handling of shell's arthimetics variable expansion.

Specifically, tests the interaction between:
   ShellExecutor (see Token/Arthimetic/ArithmeticExpression functions)

NOTE:
Currently only +,-,/,* are implemented.
*/
"use strict";

var tests = [

// Arithmetics with leteral values (no variable expansion)
[ "a1", "echo $((1))",			{ stdout: ["1"] } ],
[ "a2", "echo $((1+3))",		{ stdout: ["4"] } ],
[ "a3", "echo $((2*5))",		{ stdout: ["10"] } ],
// Integer division:
[ "a4", "echo $((5/2))",		{ stdout: ["2"] } ],
[ "a5", "echo $((5-2))",		{ stdout: ["3"] } ],
[ "a6", "echo $((2-5))",		{ stdout: ["-3"] } ],
[ "a7", "echo $((17/9))",		{ stdout: ["1"] } ],
// Zero Value
[ "a8", "echo $((0))",			{ stdout: ["0"] } ],
// Empty Value
[ "a9", "echo $(())",			{ stdout: ["0"] } ],
[ "a10", "echo $((  ))",		{ stdout: ["0"] } ],
// Octal Value
[ "a11", "echo $((033))",		{ stdout: ["27"] } ],
// Hex Value
[ "a12", "echo $((0x33))",		{ stdout: ["51"] } ],
//TODO: Handle Division by Zero as an error

// Parenthesis
[ "c1", "echo $(( 5*(4+1) ))",		{ stdout: ["25"] } ],
[ "c2", "echo $(( 5*(4+1)*2 ))",	{ stdout: ["50"] } ],
[ "c3", "echo $(( 5*(4+1)/2 ))",	{ stdout: ["12"] } ],


// Variable Expansion
[ "v1", "A=42",				{} ],
[ "v2", "echo $((A))",			{ stdout: [ "42" ] } ],
[ "v3", "echo $(($A))",			{ stdout: [ "42" ] } ],
[ "v4", "echo $((1+A))",		{ stdout: [ "43" ] } ],
[ "v5", "echo $((1+$A))",		{ stdout: [ "43" ] } ],
[ "v6", "echo $(($A+1))",		{ stdout: [ "43" ] } ],
[ "v7", "echo $((A+1))",		{ stdout: [ "43" ] } ],

//TODO:
//Test invalid values and arithmetic errors

];

var assert = require('assert');

var run_shell_tests = require('utils/shell_testing_framework');

run_shell_tests(tests);

