/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgrameEho Class Tester */
"use strict";

var echo_tests = [
{
	// empty STDIN, empty STDOUT, no error
	name:"c1",
},
{
	name:"c2",
	argv: ["hello world"],
	stdout: "hello world"
},
{
	name:"c3",
	argv: ["hello","world"],
	stdout: "hello world"
},
{
	//extra space in the first parameter
	name:"c4",
	argv: ["hello ","world"],
	stdout: "hello  world"
},
];

var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');

var fs = new FileSystem();

var ProgramEcho = require('programs/echo');

run_program_tests("echo",ProgramEcho, echo_tests,fs);
