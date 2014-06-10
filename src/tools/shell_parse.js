#!/usr/bin/env nodejs
/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/
"use strict";


/* This script takes a shell command line as parameter(s),
   parses it, and prints the JSON representation of it.

   Optional: Use "jq" to pretty-print the JSON.

   Example:
        $ nodejs ./src/tools/shell_parse.js "seq 10 | wc -l >foo.txt" | jq .
        {
          "pipeline": [
            {
              "SimpleCommand": {
                "tokens": [ "seq", "10" ]
              }
            },
            {
              "SimpleCommand": {
                "tokens": [ "wc", "-l" ],
                "redirections": [
                  {
                    "filedescriptor": 1,
                    "forceclobber": false,
                    "filename": "foo.txt",
                    "type": "output_file"
                  }
                ]
              }
            }
          ]

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

var load_shell_parser = require("utils/shell_parser_loader");
var parser = load_shell_parser();

try {
	var result = parser.parse(input);
	console.log("%j", result);
} catch (err) {
	console.error("--Failed to parse input:");
	console.error("  " + input);
	console.error("--Parsing Error:");
	console.error("  " + err);
	process.exit(1);
}
