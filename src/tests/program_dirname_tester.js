/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramDirName Class Tester
 */
"use strict";

var dirname_tests = [
{
    name: "1",
    argv:[ "foo" ],
    stdout: ".",
},
{
    name: "2",
    argv:[ "/tmp/foo/bar.txt" ],
    stdout: "/tmp/foo",
},
{
    name: "3",
    argv:[ "/usr/lib/" ],
    stdout: "/usr",
},
{
    name: "4",
    argv:[ "/usr/lib" ],
    stdout: "/usr",
},
{
    name: "e3",
    argv: [ "/tmp/foo", "bar" ],
    exit_code: 1,
    stderr: "dirname: extra operand: 'bar'\nTry 'dirname --help' for more information."
},
];


var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');
var ProgramDirname = require('programs/dirname');
var fs = new FileSystem();
run_program_tests("dirname",ProgramDirname, dirname_tests, fs);
