/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramCat Class Tester */
"use strict";

var cat_tests = [
{
	// empty STDIN, empty STDOUT, no error
	name:"c1",
},
{
	name:"c2",
	stdin: "1\n2\n3\n",
	stdout: "1\n2\n3\n"
},
{
	name:"c3",
	argv: ["-"],
	stdin: "1\n2\n3\n",
	stdout: "1\n2\n3\n"
},
{
	// printf "A\tB\n\n\n\nC\nD\n" | cat
	name:"f1",
	argv:[],
	stdin: "A\tB\n\n\n\nC\nD\n",
	stdout: "A\tB\n\n\n\nC\nD\n"
},
{
	// printf "A\tB\n\n\n\nC\nD\n" | cat -n  => empty lines are numbered
	name:"f2",
	argv:["-n"],
	stdin: "A\tB\n\n\n\nC\nD\n",
	stdout: "     1  A\tB\n     2  \n     3  \n     4  \n     5  C\n     6  D\n"
},
{
	//printf "A\tB\n\n\n\nC\nD\n" | cat -b  => empty lines are not numbernumberei
	name:"f3",
	argv:["-b"],
	stdin: "A\tB\n\n\n\nC\nD\n",
	stdout: "     1  A\tB\n\n\n\n     2  C\n     3  D\n"
},
{
	//printf "A\tB\n\n\n\nC\nD\n" | cat -s  => empty lines are squeezed
	name:"f4",
	argv:["-s"],
	stdin: "A\tB\n\n\n\nC\nD\n",
	stdout: "A\tB\n\nC\nD\n"
},
{
	//printf "A\tB\n\n\n\nC\nD\n" | cat -ns  => empty lines are squeezed, then numberd
	name:"f5",
	argv:["-ns"],
	stdin: "A\tB\n\n\n\nC\nD\n",
	stdout: "     1  A\tB\n     2  \n     3  C\n     4  D\n"
},
{
	//printf "A\tB\n\n\n\nC\nD\n" | cat -bs  => empty lines are squeezed, but not numberd
	name:"f6",
	argv:["-bs"],
	stdin: "A\tB\n\n\n\nC\nD\n",
	stdout: "     1  A\tB\n\n     2  C\n     3  D\n"
},
{
	//printf "A\tB\n\n\n\nC\nD\n" | cat -E => show line ends
	name:"f7",
	argv:["-E"],
	stdin: "A\tB\n\nC\nD\n",
	stdout: "A\tB\$\n\$\nC\$\nD\$\n"
},
{
	//printf "A\tB\n\n\n\nC\nD\n" | cat -T => show Tabs
	name:"f8",
	argv:["-T"],
	stdin: "A\tB\n\nC\nD\n",
	stdout: "A^IB\n\nC\nD\n"
},
{
	// Multiple inputs
	name:"m1",
	argv:["/tmp/foo2.txt","-","/tmp/foo3.txt"],
	stdin: "A\tB\nC\nD\n",
	stdout: "1\n2\n3\n\n\n\nA\tB\nC\nD\n\n\n4\n"
},
{
	// Multiple inputs, empty line squeezed (across files);
	name:"m2",
	argv:["-s", "/tmp/foo2.txt","/tmp/foo3.txt"],
	stdout: "1\n2\n3\n\n4\n"
},
];

var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');

//Create a filesystem, with one file (/tmp/foo.txt)
var fs = new FileSystem();
fs.mkdir("/tmp");

var fl2 = fs.openfile("/tmp/foo2.txt",true);
fl2.write(["1","2","3","","",""]);
var fl3 = fs.openfile("/tmp/foo3.txt",true);
fl3.write(["","","4"]);

var ProgramCat = require('programs/cat');

// run tests
run_program_tests("cat",ProgramCat, cat_tests,fs);
