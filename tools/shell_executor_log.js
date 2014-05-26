#!/usr/bin/env nodejs

/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* This script takes a shell command line as parameter(s),
   parses it, and prints emulated shell execution actions.
*/

/* TODO:
   1. implement proper command-line parsing, with "--help" .
   2. read input from STDIN
*/
var input = "" ;
process.argv.forEach(function (val, index, array) {
		/* The first two parameters are "nodejs" and the script name */
		if (index<2)
			return;
		if (input !== "")
			input = input + " ";
		input = input + array[index];
});

if (input === "") {
	console.error("missing parameter: shell command to parse.");
	process.exit(1);
}

var fs = require('fs');
var PEG = require("pegjs");
var path = require("path");

/* TODO: don't Hard-code path to the PEGJS file. */
var script_file = process.argv[1]; // Filename of current script
var posix_parser_syntax = path.join( path.dirname(script_file), "..", "src", "shell", "posix_shell.pegjs" );
var parser_text = fs.readFileSync(posix_parser_syntax, 'ascii');
var parser = PEG.buildParser(parser_text);

var shell_executor_script  = path.join( path.dirname(script_file), "..", "src", "shell", "shell_executor.js" );
var tmp = require(shell_executor_script);

try {
	var shell_parse_tree = parser.parse(input);

	shell_executor.AddConsoleLogger();
	var result = shell_executor.ShellExecute(shell_parse_tree);
} catch (err) {
	console.error("--Failed to parse input:");
	console.error("  " + input);
	console.error("--Error:");
	console.error("  " + err);
	console.error("--Stack Trace:");
	console.error(err.stack);
	process.exit(1);
}

