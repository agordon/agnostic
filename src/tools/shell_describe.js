#!/usr/bin/env nodejs

/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* This script takes a shell command line as parameter(s),
   parses it, then uses the "shell_descriptor" module to convert
   the syntax tree back to a string.

   This is done mainly as a debugging tool for the parse tree.
*/

var input = require("utils/single_cmdline_parameter");
if (input === "") {
	console.error("missing parameter: shell command to parse.");
	process.exit(1);
}

require("utils/object_utils");
require("utils/shell_parser_loader");
var parser = load_shell_parser();
require("shell/shell_descriptor");

//try {
	var shell_parse_tree = parser.parse(input);
	var desc = Shell_Descriptor.DescribeShellCommand(shell_parse_tree);

	console.log("-- Input Command:");
	console.log(input);
	console.log("-- Command Description (after parsing):");
	console.log(desc);
/*} catch (err) {
	console.error("--Failed to parse input:");
	console.error("  " + input);
	console.error("--Error:");
	console.error("  " + err);
	console.error("--Stack Trace:");
	console.error(err.stack);
	process.exit(1);
}*/

