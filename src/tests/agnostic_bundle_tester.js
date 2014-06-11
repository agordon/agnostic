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
