/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/*
 * Test the 'InteractiveShell' object -
 *    This is the main interface which will be used on the website.
 *
 * NOTE:
 *   This module tests the 'InteractiveShell' object directory.
 *   Another module tests it through the 'agnostic bundle' loader
 *   (as will be loaded in the website).
 */
"use strict";

var assert = require('assert');

var load_shell_parser = require('utils/shell_parser_loader');
var shell_parser = load_shell_parser();

var InteractiveShell = require('shell/shell_interactive');

var shell = new InteractiveShell(shell_parser);

// Execute few commands, just to check the entire setup.
var res = shell.execute("seq 10 | wc -l");
assert.deepEqual( res.stdout, ["10"] );

// Execute multiple commands with a subshell, and sharing STDIN
res = shell.execute("seq 0 5 20| grep 5 | ( echo 'hello' ; wc -l )");
assert.deepEqual( res.stdout, ["hello","2"]);


// Command with input and output redirection
// (note: 'output.txt' is truncated by the 'echo')
res = shell.execute("seq 10 > hello.txt ; echo hello > hello.txt ; wc -l < hello.txt");
assert.deepEqual( res.stdout, ["1"]);

// Command with input and output redirection with appending
res = shell.execute("seq 10 > hello.txt ; echo hello >> hello.txt ; wc -l < hello.txt");
assert.deepEqual( res.stdout, ["11"]);

res = shell.execute("seq 10 | paste -s -d,");
assert.deepEqual ( res.stdout, ["1,2,3,4,5,6,7,8,9,10"]);


// Execute a command with errors to STDERR
res = shell.execute("seq");
assert.deepEqual( res.stderr,
  [ 'seq: missing operand', 'Try \'seq --help\' for more information.' ]);
assert.equal ( res.exit_code, 1 );
