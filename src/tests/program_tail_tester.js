/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramTail Class Tester */
"use strict";

var tail_tests = [
{
	// empty STDIN, empty STDOUT, no error
	name:"t1",
},
{
	name:"t2",
	stdin: "1\n2\n3\n",
	stdout: "1\n2\n3\n"
},
{
	name:"t3",
	stdin: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n",
	stdout:"2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n"
},
{
	name:"t4",
	argv: ["-"],
	stdin: "1\n2\n3\n",
	stdout: "1\n2\n3\n"
},
{
	name:"t5",
	argv: ["-v"],
	stdin: "1\n2\n3\n",
	stdout: "==> standard input <==\n1\n2\n3\n"
},
{
	name:"n1",
	argv:["-n", "1"],
	stdin: "1\n2\n3\n",
	stdout: "3\n"
},
{
	name:"n2",
	argv: ["-n1"],
	stdin: "1\n2\n3\n",
	stdout: "3\n"
},
{
	name:"n3",
	argv: ["-n", "2"],
	stdin: "1\n2\n3\n4\n5\n",
	stdout: "4\n5\n"
},
{
	name:"n4",
	argv: ["-n", "-2"],
	stdin: "1\n2\n3\n4\n5\n",
	stdout: "4\n5\n"
},
{
	name:"n5",
	argv: ["-n", "+2"],
	stdin: "1\n2\n3\n4\n5\n",
	stdout: "2\n3\n4\n5\n"
},
{
	// seq 3 | tail -n +4       => empty output
	name:"n6",
	argv:["-n", "+4"],
	stdin: "1\n2\n3\n",
},
{
	//two files - turn on 'verbose'
	name:"v1",
	argv: ["-","-"],
	stdin: "1\n2\n3\n",
	stdout: "==> standard input <==\n1\n2\n3\n==> standard input <==\n"
},
{
	//two files, with "quiet" - should disable "verbose"
	name: "q1",
	argv:["-q", "-","-"],
	stdin: "1\n2\n3\n",
	stdout: "1\n2\n3\n"
},
{
	//Test input file (NOTE: file exists in virtual filesystem, not on the host)
	name:"f1",
	argv: ["/tmp/foo.txt"],
	stdout: "b\nc\nd\ne\nf\ng\nh\ni\nj\nk\n"
},
{
	// non existing file
	name: "f2",
	argv: ["/tmp/non/existing.txt"],
	exit_code:1,
	//note: exact error wording depends on 'filesystem.js'
	stderr:"tail: File/Directory does not exist (file: '/tmp/non/existing.txt')\n"
},
{
	//File, stdin, file - with quiet flag
	name:"f3",
	argv:["-q","-n1", "/tmp/foo.txt", "-", "/tmp/foo.txt"],
	stdin: "1\n2\n3\n",
	stdout: "k\n3\nk\n"
},
{
	name: "f4",
	argv: ["-n1", "/tmp/foo.txt", "-", "/tmp/foo.txt"],
	stdin: "1\n2\n3\n",
	stdout: "==> /tmp/foo.txt <==\nk\n==> standard input <==\n3\n==> /tmp/foo.txt <==\nk\n"
}
];

var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');

//Create a filesystem, with one file (/tmp/foo.txt)
var fs = new FileSystem();
fs.mkdir("/tmp");
var fl = fs.openfile("/tmp/foo.txt",true);
fl.write(["a","b","c","d","e","f","g","h","i","j","k"]);
fl=null;

var ProgramTail = require('programs/tail');

// run tests
run_program_tests("tail",ProgramTail, tail_tests,fs);
