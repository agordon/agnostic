/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgrameFAlse Class Tester */
"use strict";

var false_tests = [
{
	// empty STDIN, empty STDOUT, no error
	name:"c1",
	exit_code: 1
},
{
	name:"c2",
	argv: ["hello world"],
	exit_code: 1
},
{
	//any command line arguments should be ignored
	name:"c3",
	argv: ["--foo","--bar"],
	exit_code: 1
},
];

var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');

var fs = new FileSystem();

var ProgramFalse = require('programs/false');

run_program_tests("false",ProgramFalse, false_tests,fs);
