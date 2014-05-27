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
var input = require("utils/single_cmdline_parameter");
if (input === "") {
	console.error("missing parameter: shell command to parse.");
	process.exit(1);
}

require("utils/object_utils");
require("utils/shell_parser_loader");
var parser = load_shell_parser();
require("shell/shell_console_logger");
require("shell/shell_executor");

try {
	var shell_parse_tree = parser.parse(input);
	shell_executor.AddLogger(shell_executor_console_logger);
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

