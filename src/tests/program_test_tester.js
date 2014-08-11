/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramTest Class Tester */
"use strict";

var test_tests = [
{
	/* no parameters - exit code 1 */
	name:"t1",
	exit_code: 1,
},
{
	/* one non-empty parameter -exit code 0 */
	name: "t2",
	argv: ["foo"]
},
{
	/* one empty parameter -exit code 1 */
	name: "t3",
	argv: [""],
	exit_code: 1,
},

/* Negate single parameter */
{
	name: "t4",
	argv: ["!", ""],
	exit_code: 0,
},
{
	name: "t5",
	argv: ["!", "hello"],
	exit_code: 1,
},

/* Unary string operators */
{
	name: "t6",
	argv: ["-n", "hello"],
	exit_code: 0,
},
{
	name: "t7",
	argv: ["-n", ""],
	exit_code: 1,
},
{
	name: "t8",
	argv: ["-z", ""],
	exit_code: 0,
},
{
	name: "t9",
	argv: ["-z", "hello"],
	exit_code: 1,
},

/* Unary file operators */
{
	name: "t10", // non existing directory
	argv: ["-d", "/foo"],
	exit_code: 1,
},
{
	name: "t11",
	argv: ["-d", "/tmp"],
},
{
	name: "t12",
	argv: ["-e", "/tmp"],
},
{
	name: "t14", // file test on a directroy
	argv: ["-f", "/tmp"],
	exit_code: 1,
},
{
	name: "t15",
	argv: ["-f", "/tmp/foo.txt"],
},
{
	name: "t16",
	argv: ["-f", "/tmp/empty.txt"],
},
{
	name: "t17",
	argv: ["-f", "/tmp/bar/baz.txt"],
	exit_code: 1
},
{
	name: "t18",
	argv: ["-e", "/tmp/foo.txt"],
},
{
	name: "t19",
	argv: ["-e", "/tmp/empty.txt"],
},
{
	name: "t20",
	argv: ["-e", "/tmp/bar/baz.txt"],
	exit_code: 1
},

/* Read/write test are not implemented - will return TRUE for any existing file */
{
	name: "t21",
	argv: ["-r", "/tmp/foo.txt"],
},
{
	name: "t22",
	argv: ["-w", "/tmp/foo.txt"],
},
{
	name: "t23",
	argv: ["-r", "/tmp/bar/baz.txt"],
	exit_code: 1
},
{
	name: "t24",
	argv: ["-w", "/tmp/bar/baz.txt"],
	exit_code: 1
},
/* file size */
{
	name: "t25",
	argv: ["-s", "/tmp/foo.txt"],
},
{
	name: "t26",
	argv: ["-s", "/tmp/empty.txt"],
	exit_code: 1,
},
{
	name: "t27", // non existing file
	argv: ["-s", "/tmp/bar/baz.txt"],
	exit_code: 1
},

/* Negate unary operator */
{
	name: "t28",
	argv: [ "!", "-s", "/tmp/foo.txt"],
	exit_code: 1,
},
{
	name: "t29",
	argv: ["!", "-s", "/tmp/empty.txt"],
},
{
	name: "t30", // non existing file
	argv: ["!", "-s", "/tmp/bar/baz.txt"],
},

/* Binary operators */
{
	name: "t50",
	argv: [ "32", "-eq", "32" ],
},
{
	name: "t51",
	argv: [ "33", "-eq", "32" ],
	exit_code: 1,
},
{
	name: "t53",
	argv: [ "aa", "-eq", "32" ],
	exit_code: 1,
	stderr: "test: operator '-eq': integer expression expected, got 'aa'",
},
{
	name: "t54",
	argv: [ "32", "-eq", "32b" ],
	exit_code: 1,
	stderr: "test: operator '-eq': integer expression expected, got '32b'",
},
{
	name: "t55",
	argv: [ "5", "-gt", "2" ],
},
{
	name: "t56",
	argv: [ "5", "-gt", "5" ],
	exit_code: 1
},
{
	name: "t57",
	argv: [ "5", "-ge", "5" ],
},
{
	name: "t58",
	argv: [ "5", "-ge", "15" ],
	exit_code: 1
},
{
	name: "t59",
	argv: [ "10", "-lt", "20" ],
},
{
	name: "t60",
	argv: [ "10", "-lt", "2" ],
	exit_code: 1
},
{
	name: "t61",
	argv: [ "10", "-le", "10" ],
},
{
	name: "t62",
	argv: [ "10", "-le", "20" ],
},
{
	name: "t63",
	argv: [ "10", "-le", "2" ],
	exit_code: 1
},
{
	name: "t64",
	argv: [ "10", "=", "10" ],
},
{
	name: "t65",
	argv: [ "aa10", "=", "aa10" ],
},
{
	name: "t66",
	argv: [ "aa10", "=", "ba10" ],
	exit_code: 1
},
{
	name: "t67",
	argv: [ "aa10", "!=", "ba10" ],
},
{
	name: "t68",
	argv: [ "aa10", "!=", "aa10" ],
	exit_code: 1
},


/* Test negated binary operator */
{
	name: "t70",
	argv: [ "!", "10", "=", "10" ],
	exit_code: 1
},
{
	name: "t71",
	argv: [ "!", "aa10", "=", "aa10" ],
	exit_code: 1
},
{
	name: "t72",
	argv: [ "!", "aa10", "!=", "ba10" ],
	exit_code: 1
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
fl = fs.openfile("/tmp/empty.txt",true);

var ProgramTest = require('programs/test');

// run tests
run_program_tests("test",ProgramTest, test_tests,fs);
