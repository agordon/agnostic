/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/*
 * ProgramLS Tester, part 1
 * (no actual testing, just ensuring it runs)
 */
"use strict";

var assert = require('assert');
var run_program_tests = require('utils/program_test_framework');
var FileSystem = require('os/filesystem');
var ProgramLS = require('programs/ls');

var fs = new FileSystem();

//Fill the filesystem
var fs = new FileSystem();
fs.mkdir("/tmp");
var fl = fs.openfile("/tmp/foo.txt",true);
fl.write(["hello world"]);
fl = fs.openfile("/tmp/bar.txt",true);
fl.write([ Array(100).join(" ") ]);


// Non Existing file
var out = run_program_tests.run_program("ls",ProgramLS, [], ["/tmp/l"] ,fs);
assert.deepEqual(out, { exit_code:1, stderr: [ "ls: cannot access /tmp/l: no such file or directory" ] } );


// A file
var out = run_program_tests.run_program("ls",ProgramLS, [], ["/tmp/foo.txt"] ,fs);
console.log("out = ", JSON.stringify(out,undefined,2));
assert.equal (out.exit_code,0);

//A file in long-format
var out = run_program_tests.run_program("ls",ProgramLS, [], ["-l", "/tmp/foo.txt"] ,fs);
console.log("out = ", JSON.stringify(out,undefined,2));
assert.equal (out.exit_code,0);


//A directory
var out = run_program_tests.run_program("ls",ProgramLS, [], ["/tmp"] ,fs);
console.log("out = ", JSON.stringify(out,undefined,2));
assert.equal (out.exit_code,0);


//A directory - long format
var out = run_program_tests.run_program("ls",ProgramLS, [], ["-l", "/tmp"] ,fs);
console.log("out = ", JSON.stringify(out,undefined,2));
assert.equal (out.exit_code,0);

//Current directory - long format
var out = run_program_tests.run_program("ls",ProgramLS, [], ["-l"] ,fs);
console.log("out = ", JSON.stringify(out,undefined,2));
assert.equal (out.exit_code,0);
