/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramCut Class Tester */
"use strict";

var stdin_ex1 = [1,2,3,4,5,6,7,8,9].join("\t") + "\n";
var stdin_ex2 = "123456789\n";
var stdin_ex3 = [1,2,3,4,5,6,7,8,9].join(" ") + "\n";
var stdin_ex4 = "1,2\n3,4\n5\n" ;

var cut_tests = [
{
	name:"e1",
	exit_code: 1,
	stderr: "cut: you must specify a list of bytes, characters, or fields\nTry 'cut --help' for more information.\n"
},
{
	//empty input => empty output, no error
	name: "f1",
	argv: ["-f1"],
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f1,3
	name: "f2",
	argv: ["-f1,3"],
	stdin: stdin_ex1,
	stdout: "1\t3\n"
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f5-
	name: "f3",
	argv: ["-f5-"],
	stdin: stdin_ex1,
	stdout: "5\t6\t7\t8\t9\n"
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f-4
	name: "f4",
	argv: ["-f-4"],
	stdin: stdin_ex1,
	stdout: "1\t2\t3\t4\n"
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f5-7
	name: "f5",
	argv: ["-f5-7"],
	stdin: stdin_ex1,
	stdout: "5\t6\t7\n"
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f5-7,2
	name: "f6",
	argv: ["-f5-7,2"],
	stdin: stdin_ex1,
	stdout: "2\t5\t6\t7\n"
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f2,3,2,4,3,2,2-3
	name: "f7",
	argv: ["-f2,3,2,4,3,2,2-3"],
	stdin: stdin_ex1,
	stdout: "2\t3\t4\n"
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f-4,-6
	name: "f8",
	argv: ["-f-4,-6"],
	stdin: stdin_ex1,
	stdout: "1\t2\t3\t4\t5\t6\n"
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f5-,6-
	name: "f9",
	argv: ["-f5-,6-"],
	stdin: stdin_ex1,
	stdout: "5\t6\t7\t8\t9\n",
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f5-,8
	name: "f10",
	argv: ["-f5-,8"],
	stdin: stdin_ex1,
	stdout: "5\t6\t7\t8\t9\n",
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f-6,3-
	name: "f11",
	argv: ["-f-6,3-"],
	stdin: stdin_ex1,
	stdout: "1\t2\t3\t4\t5\t6\t7\t8\t9\n",
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f10
	name: "f12",
	argv: ["-f10"],
	stdin: stdin_ex1,
	stdout: "",
},
{
	// printf "1\t2\t3\t4\t5\t6\t7\t8\t9\n" | cut -f5-,8 --complement
	name: "f13",
	argv: ["-f5-,8","--complement"],
	stdin: stdin_ex1,
	stdout: "1\t2\t3\t4\n",
},
{
	// printf "123456789\n" | cut -b3,6
	name: "b1",
	argv: ["-b3,6"],
	stdin: stdin_ex2,
	stdout: "36",
},
{
	// printf "123456789\n" | cut -b3,6-
	name: "b2",
	argv: ["-b3,6-"],
	stdin: stdin_ex2,
	stdout: "36789",
},
{
	// printf "123456789\n" | cut -b3,6- --output-delimiter=,
	name: "b3",
	argv: ["-b3,6-", "--output-delimiter=,"],
	stdin: stdin_ex2,
	stdout: "3,6,7,8,9",
},
{
	// printf "123456789\n" | cut -b3,6- --complement
	name: "b4",
	argv: ["-b3,6-","--complement"],
	stdin: stdin_ex2,
	stdout: "1245",
},
{
	// printf "1 2 3 4 5 6 7 8 9\n" | cut -d" " -f4,5
	name: "s1",
	argv: ["-d ", "-f4,5" ],
	stdin: stdin_ex3,
	stdout: "4 5\n",
},
{
	// printf "1 2 3 4 5 6 7 8 9\n" | cut -d" " -f4,5 --output-delimiter=,
	name: "s2",
	argv: ["-d ", "-f4,5", "--output-delimiter=," ],
	stdin: stdin_ex3,
	stdout: "4,5\n",
},
{
	// printf "1,2\n3,4\n5\n" | cut -d, -f2      (show lines without delimiters)
	name: "o1",
	argv: ["-d,","-f2"],
	stdin: stdin_ex4,
	stdout: "2\n4\n5\n"
},
{
	// printf "1,2\n3,4\n5\n" | cut -d, -f2 -s      (skip lines without delimiters)
	name: "o2",
	argv: ["-d,","-f2","-s"],
	stdin: stdin_ex4,
	stdout: "2\n4\n"
},
];

var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');

//Create a filesystem, with one file (/tmp/foo.txt)
var fs = new FileSystem();
fs.mkdir("/tmp");
var fl = fs.openfile("/tmp/foo.txt",true);
fl.write(["a","b","c","d","e","f","g","h","i","j"]);
fl=null;

var ProgramCut = require('programs/cut');

// run tests
run_program_tests("cut",ProgramCut, cut_tests,fs);
