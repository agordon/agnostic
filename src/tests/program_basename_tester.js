/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramBaseName Class Tester
 */
"use strict";

var basename_tests = [
{
    name: "1",
    argv:[ "foo" ],
    stdout: "foo",
},
{
    name: "2",
    argv:[ "foo.txt", ".txt" ],
    stdout: "foo",
},
{
    name: "3",
    argv:[ "/foo.txt", ".txt" ],
    stdout: "foo",
},
{
    name: "4",
    argv:[ "/tmp/foo.txt", ".txt" ],
    stdout: "foo",
},
{
    name: "5",
    argv:[ "/tmp/foo.txt", ".jpg" ],
    stdout: "foo.txt",
},
{
    name: "6",
    argv:[ "/tmp/foo.txt", "foo.txt" ],
    stdout: "foo.txt",
},
{
    name: "e3",
    argv: [ "foo.txt", ".txt", "bar" ],
    exit_code: 1,
    stderr: "basename: extra operand: 'bar'"
},
];


var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');
var ProgramBasename = require('programs/basename');
var fs = new FileSystem();
run_program_tests("basename",ProgramBasename, basename_tests, fs);
