/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramPrintf Class Tester */
"use strict";

//TODO: Major different from POSIX printf:
//      handling of newlines...

var printf_tests = [
{
	// empty STDIN, show error
	name:"c1",
	exit_code: 1,
	stderr: "printf: missing operand\nTry 'printf --help' for more information."
},
{
	name:"c2",
	argv: ["hello world"],
	stdout: "hello world"
},
{
	name:"c3",
	argv: ["==%s==", "hello"],
	stdout: "==hello==",
},
{
	name:"c4",
	argv: ["==%d==", "42"],
	stdout: "==42==",
},
{
	// tab as escape sequece
	name:"c5",
	argv: ["=\\t=%d==", "42"],
	stdout: "=\t=42=="
},
{
	// repeated items, no newline
	name:"c6",
	argv: ["==%d--", "1","2","3","4"],
	stdout: "==1--==2--==3--==4--"
},
{
	// repeated items, with newline
	name:"c7",
	argv: ["==%d--\\n", "1","2","3","4"],
	stdout: "==1--\n==2--\n==3--\n==4--"
},
{
	// repeated items, with missing values in last round
	// $ env printf "%s: %d\n" a 1 b 2 c 3 d
	name:"c8",
	argv: ["%s: %d\\n", "a","1","b","2","c","3","d"],
	stdout: "a: 1\nb: 2\nc: 3\nd: 0"
},
{
	// missing all values
	name:"c9",
	argv: ["==%s==" ],
	stdout: "===="
},
];

var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');

var fs = new FileSystem();

var ProgramPrintf = require('programs/printf');

run_program_tests("printf",ProgramPrintf, printf_tests,fs);
