/*
   Shell-Executor-compatible logging module.

   This file is part of UNIX Guide for the Perplexed project.
   Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
   Released under GPLv3 or later, with the following addition:

     As additional permission under GNU GPL version 3 section 7, you
     may distribute non-source (e.g., minimized or compacted) forms of
     that code without the copy of the GNU GPL normally required by
     section 4, provided you include this license notice and a URL
     through which recipients can access the Corresponding Source.

   See: https://www.gnu.org/philosophy/javascript-trap.html
*/

/* This module should be used in conjunction with "ShellExecutor" module,
   and it implements logging using "console.log".

   This module should serve as a reference for a logging module,
   if another is desired.

   The module should expose three functions:
	1. log({}) - Logs a new message.
		     The object should contain:
			{
				"source" : Name of the source (e.g. "shell" or name of program)
				"topic"  : Topic name inside the 'source'. Any textual string.
				"params" : [ array of items to log ]
			}

	2. indent() - indicates a new (usually recursive) level is entered.
	3. exdent() - indicates a level is exited.
			The meaning of enter/exit is internal to the logging source,
			The logger module should simply indicate 'level' by some means.

   The module should be used with the "shell_executor.AddLogger()" function.

   NodeJS example:
	require("shell_executor.js");
	require("shell_console_logger.js");
	shell_executor.AddLogger(shell_executor_console_logger);
*/

shell_executor_console_logger = (function() {

	var log_console_identation = 0 ;

	function log_console_indent()
	{
		log_console_identation ++;
	}

	function log_console_exdent()
	{
		log_console_identation --;
	}

	function log_console_msg(content)
	{
		var indent = Array(log_console_identation * 4).join(" ");
		console.log(content["source"] + ": " + indent +
			    content["topic"] + ": " +
			    content["params"].join(" "));
	}
	return {
		"indent" : log_console_indent,
		"exdent" : log_console_exdent,
		"log"    : log_console_msg
	};
})();
