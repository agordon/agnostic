/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramWc Class Tester */
"use strict";

var wc_tests = [
{
	// empty STDIN, all zeros
	name:"c1",
	exit_code: 0,
	stdout: "0 0 0"
},
{
	name:"c2",
	stdin: "a\nb c\nde\n",
	stdout: "3 4 9"
},
{
	name:"c3",
	argv: ["-l"],
	stdin: "a\nb c\nde\n",
	stdout: "3"
},
{
	name:"c4",
	argv: ["-w"],
	stdin: "a\nb c\nde\n",
	stdout: "4"
},
{
	name:"c5",
	argv: ["-c"],
	stdin: "a\nb c\nde\n",
	stdout: "9"
},
{
	// explicitly specify stdin
	name:"c6",
	argv: ["-c","-"],
	stdin: "a\nb c\nde\n",
	stdout: "9 -"
},
{
	// wc on one file
	name: "f1",
	argv: ["/tmp/foo.txt"],
	stdout: "10 10 20 /tmp/foo.txt"
},
{
	// wc on one file and STDIN - shows totals
	name: "f2",
	argv: ["-l", "/tmp/foo.txt", "-"],
	stdin: "a\nb c\nde\n",
	stdout: "10 /tmp/foo.txt\n3 -\n13 total"
}
];

var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');

var fs = new FileSystem();
fs.mkdir("/tmp");
var fl = fs.openfile("/tmp/foo.txt",true);
fl.write(["a","b","c","d","e","f","g","h","i","j"]);
fl=null;

var ProgramWc = require('programs/wc');

run_program_tests("wc",ProgramWc, wc_tests,fs);
