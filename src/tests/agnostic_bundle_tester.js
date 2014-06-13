/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/*
 * Test the 'agnostic' bundle.
 *
 */
"use strict";

var assert = require('assert');
var shell_syntax_tests = require('./shell_syntax_tests.js');
var tests = shell_syntax_tests.tests;

if (process.argv.length<2) {
	console.error("missing agnostic bundle javascript file name");
	process.exit(1);
}
var agnostic_file = process.argv[2];

var agnostic = require(agnostic_file);

var os = new agnostic.OperatingSystem();
var fs = new agnostic.FileSystem();
var ps = new agnostic.ProcessState(os,fs);

// Emulate "seq 1 2 10"
var prog = new agnostic.programs.seq();
var exit_code = prog.run(ps,["/bin/seq","1","2","10"]);
assert.strictEqual(exit_code,0);
var output = ps.stdout.__get_lines();
assert.deepEqual(output, [ "1", "3","5","7","9" ]);


// Emulate "printf "%s: %d\n" a 1 b 2 c
prog = new agnostic.programs.printf();
exit_code = prog.run(ps,["/bin/printf","%s: %d\n", "a","1","b","2","c"]);
assert.strictEqual(exit_code,0);
output = ps.stdout.__get_lines();
assert.deepEqual(output, [ "a: 1", "b: 2", "c: 0" ]);


/* Parse Shell Commands, then convert them back to text and HTML
NOTE:
 This test happens late in the testing list (in the makefile).
 These Shell-Syntax tests have already been run multiple times,
 in other tests with individual modules, and extended error messages.

 When this test does is specifically re-run these tests after loading
 the parser, and the shell text/html descriptors using the Agnostic bundle module.
 All these tests are supposed to pass.
 If they don't - it indicates a problem in the bundling - not in the shell implementation.
*/
for (var t in tests)
{
	var name  = tests[t][0];
	var input = tests[t][1];
	var should_be_accepted = tests[t][2];

	/* Only tests valid shell commands */
	if (!should_be_accepted)
		continue;

	var parse_tree = agnostic.shell.parse_command(input);
	var text_desc = agnostic.shell.command_to_text(parse_tree);
	var html_desc = agnostic.shell.command_to_html(parse_tree);
}




/*
Test the InteractiveShell Object, as loaded by the agnostic bundle.

NOTE:
Here we mainly test if the object can be loaded, created and used - through
the agnostic bundle.
More detailed tests are in other modules.
*/
var shell = agnostic.createInteractiveShell();
var res = shell.execute("seq 10 | wc -l");
assert.deepEqual( res.stdout, ["10"] );

