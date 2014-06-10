/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgrameTrue Class Tester */
"use strict";

var true_tests = [
{
	// empty STDIN, empty STDOUT, no error
	name:"c1",
},
{
	name:"c2",
	argv: ["hello world"],
},
{
	//any command line arguments should be ignored
	name:"c3",
	argv: ["--foo","--bar"],
},
];

var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');

var fs = new FileSystem();

var ProgramTrue = require('programs/true');

run_program_tests("true",ProgramTrue, true_tests,fs);
