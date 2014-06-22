#!/usr/bin/env nodejs

/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/
"use strict";

/*
This script takes a shell command line as parameter(s),
parses it, and executes it.
*/

var input = require("utils/single_cmdline_parameter");
if (input === "") {
	console.error("missing parameter: shell command to parse.");
	process.exit(1);
}


var assert = require('assert');
var nodefs = require('fs');
var readline = require('readline');

var load_shell_parser = require('utils/shell_parser_loader');
var shell_parser = load_shell_parser();

var InteractiveShell = require('shell/shell_interactive');

var shell = new InteractiveShell(shell_parser);

var samples = require('utils/sample_data_files');

// Create few dummy files for the demo
var fl = shell.fs.openfile("/passwd",true);
fl.write( samples.passwd );

var fl = shell.fs.openfile("/mammals.txt",true);
fl.write( samples.mammals );

var fl = shell.fs.openfile("/nobel.csv",true);
fl.write( samples.nobel );

//Read STDIN, in one chunk
shell.ps.stdin.fill_input_callback = function() {
	var stdin_text = nodefs.readFileSync('/dev/stdin').toString();

	//Remove last linebreak, if any (to prevent an extranous empty last line)
	stdin_text = stdin_text.replace(/\n$/,"");

	var stdin_lines = stdin_text.split("\n");
	return stdin_lines ;
}

try {
	var result = shell.execute(input);
	if ( 'stdout' in result )
		console.log(result.stdout.join("\n"));
	if ( 'stderr' in result )
		console.error(result.stderr.join("\n"));

	process.exit(result.exit_code);
} catch (e) {
	console.error("Agnostic Shell Emulation Error");
	console.error("Program = ");
	console.error(JSON.stringify(shell,undefined,2));
	console.error("Exception = ");
	console.error(e);
	console.error(e.stack);
}
