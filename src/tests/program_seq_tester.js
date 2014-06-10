/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramSeq Class Tester
 */
"use strict";

var try_help = "Try 'seq --help' for more information.\n";

var seq_tests = [
{
    name: "1",
    argv:[ "10" ],
    stdout: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n"
},
{
    name: "2",
    argv:[ "2", "10" ],
    stdout: "2\n3\n4\n5\n6\n7\n8\n9\n10\n"
},
{
    name: "3",
    argv: ["2", "3", "10" ],
    stdout: "2\n5\n8\n",
},
{
    name: "w1",
    argv: [ "-w", "8", "10" ],
    stdout: "08\n09\n10\n"
},
{
    name: "s1",
    argv:[ "-s,", "8", "10" ],
    stdout: "8,9,10\n"
},
{
    name:"s2",
    argv:[ "-s",",", "8", "10" ],
    stdout: "8,9,10\n"
},
{
    name:"s3",
    argv:[ "-w", "-s,", "8","10"],
    stdout: "08,09,10\n"
},
{
    name:"n1",
    argv:[ "10", "1", "1" ]
},
{
    name:"n2",
    argv:[ "10", "-1", "1" ],
    stdout: "10\n9\n8\n7\n6\n5\n4\n3\n2\n1\n"
},
{
    name:"f1",
    argv: [ "2.2" ],
    stdout: "1\n2\n"
},
{
    name:"f2",
    argv: [ "0.9", "0.3", "2.2" ],
    stdout: "0.9\n1.2\n1.5\n1.8\n2.1\n"
},
{
    name: "c1",
    argv: [ "-f","%04f", "4" ],
    stdout: "0001\n0002\n0003\n0004\n"
},
{
    name: "e1",
    exit_code: 1,
    stderr: "seq: missing operand\n" + try_help
},
{
    name: "e2",
    argv: [ "5apples" ],
    exit_code: 1,
    stderr: "seq: invalid floating point argument: 5apples\n" + try_help
},
{
    name: "e3",
    argv: [ "1","2","3","4" ],
    exit_code: 1,
    stderr: "seq: extra operand: '4'\n" + try_help
},
];



var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');
var ProgramSeq = require('programs/seq');
var fs = new FileSystem();
run_program_tests("seq",ProgramSeq, seq_tests, fs);
