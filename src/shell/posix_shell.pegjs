/*
   POSIX-Shell compatible parser.

   This file is part of UNIX Guide for the Perplexed project.
   Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
   Released under GPLv3 or later.

   This file is parser syntax for PEG.js module:
       http://pegjs.majda.cz/
       https://github.com/dmajda/pegjs

   POSIX Shell Command Language Standard:
   http://pubs.opengroup.org/onlinepubs/009695399/utilities/xcu_chap02.html

   The comment below will be persevered in the PEG-generated Javascript file - DO NOT remove it.
*/

{

/* This file is part of UNIX Guide for the Perplexed project.
   Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
   Released under GPLv3 or later, with the following addition:

     As additional permission under GNU GPL version 3 section 7, you
     may distribute non-source (e.g., minimized or compacted) forms of
     that code without the copy of the GNU GPL normally required by
     section 4, provided you include this license notice and a URL
     through which recipients can access the Corresponding Source.

   See: https://www.gnu.org/philosophy/javascript-trap.html

   This file was auto-generated from 'posix_shell.pegjs'
   using PEGJS ( http://pegjs.majda.cz/ ).
*/
}

start =
  List

/* filter out empty string tokens (which are empty delimiters).
   NOTE: this will not harm empty string parameters (e.g. -d"")
         because those will include the quotes characaters in the token string.
   Quote-Removal has not happened yet, before this step. */
non_operator_tokens =
  tokens: ( word / EmptyDelimiter )* {
		    var non_empty = tokens.filter(function(e){return e});
		     return non_empty ; }



/* Ugly Hack:
   prevent the "2" in input like "uptime 2>&1" to be separated from the redirection. */
redirection_word_hack =
  [0-9]+ [\<\>]

word =
  !redirection_word_hack ( NonQuotedCharacters / QuotedString / EscapedCharacter )+ { return text(); }

assignment_word_hack =
  [A-Za-z_][A-Za-z0-9_]* '='

not_first_word =
  !redirection_word_hack !assignment_word_hack ( NonQuotedCharacters / QuotedString / EscapedCharacter )+ { return text(); }

/* Characters which do not need quoting, as per 2.2 */
NonQuotedCharacters =
  [^\|\&\;\<\>\(\)\$\'\\\"\' \t\n]+

QuotedString =
  '"' DoubleQuotedStringCharacter* '"'
  / "'" SingleQuotedStringCharacter* "'"

/* TODO: Inside double-quotes, parameters-expansion & sub-commands must work */
DoubleQuotedStringCharacter =
  !('"' / "\\" / LineTerminator) .
  / EscapedCharacter

SingleQuotedStringCharacter =
  !("'" / "\\" / LineTerminator) .
  / EscapedCharacter

EscapedCharacter =
  "\\" .

LineTerminator =
  "\n"

EmptyDelimiter =
  [\n\t ]+ { return ""; }


/***********************
  Redirections, section 2.7
***********************/

RedirectionFileDescriptor =
 [0-9]+ { return parseInt(text()); }


/* Input Redirection, 2.7.1 */
InputRedirection =
  fd:RedirectionFileDescriptor? '<' file_name:word {
		if (fd === null)
			fd = 0 ; /* Default FD is STDIN/0 if not defined */
		return { 'redirection' :
			{ 'type':'input_file',
			  'filename': file_name,
			  'filedescriptor': fd } } ;
		}

/* Output Redirection, 2.7.2 */
OutputRedirection =
  fd:RedirectionFileDescriptor? '>' forceclobber:'|'? file_name:word {
		if (fd === null)
			fd = 1 ; /* Default FD is STDOUT/1 if not defined */
		return { 'redirection' :
			{ 'type':'output_file',
			  'filename': file_name,
			  'forceclobber': (forceclobber!==null),
			  'filedescriptor': fd } } ;
		}

/* Append Redirection, 2.7.3 */
AppendRedirection =
  fd:RedirectionFileDescriptor? '>>' file_name:word {
		if (fd === null)
			fd = 1 ; /* Default FD is STDOUT/1 if not defined */
		return { 'redirection' :
			{ 'type':'append_file',
			  'filename': file_name,
			  'filedescriptor': fd } } ;
		}

/* Here-Document 2.7.4 - NOT SUPPORTED */
HereDocRedirection =
  fd:RedirectionFileDescriptor? '<<' {
			error("Here-Documents (<< operators) are not supported in this program");
		}

/* Sections 2.7.5 and 2.7.6 (Duplicating an Input/Output file descriptor)
   allow "word" to be a number, or a "minus".
   other values are undefined, and we reject them in this parser */
FileDescriptorOrMinus =
   [0-9]+ / '-' { return text(); }

/* Duplicate Input Descriptor 2.7.5 */
DupInputRedirection =
  fd:RedirectionFileDescriptor? '<&' file_name:FileDescriptorOrMinus {
		if (fd === null)
			fd = 0 ; /* Default FD is STDIN/0 if not defined */
		return { 'redirection' :
			{ 'type':'input_dup_fd',
			  'filename': file_name[0],
			  'filedescriptor': fd } } ;
		}

/* Duplicate Output Descriptor 2.7.6 */
DupOutputRedirection =
  fd:RedirectionFileDescriptor? '>&' file_name:FileDescriptorOrMinus {
		if (fd === null)
			fd = 1 ; /* Default FD is STDOUT/1 if not defined */
		return { 'redirection' :
			{ 'type':'output_dup_fd',
			  'filename': file_name[0],
			  'filedescriptor': fd } } ;
		}

/* Open file for reading/writing, 2.7.7 */
InOutRedirection =
  fd:RedirectionFileDescriptor? '<>' file_name:word {
		if (fd === null)
			fd = 0 ; /* Default FD is STDIN/0 if not defined */
		return { 'redirection' :
			{ 'type':'inout_file',
			  'filename': file_name,
			  'filedescriptor': fd } } ;
		}

Redirection =
  InputRedirection /
  OutputRedirection /
  AppendRedirection /
  HereDocRedirection /
  DupInputRedirection /
  DupOutputRedirection /
  InOutRedirection

/***********************
Variable Assignment, as per 2.9.1:
*************************/

VariableName =
  [A-Za-z_][A-Za-z0-9_]* { return text(); }

Assignment =
  vari_name:VariableName '=' value:word { var tmp={}; tmp[vari_name]=value; return { 'assignment' :tmp }; }


/***************************
A Simple Command, as per 2.9.1:
A "simple command" is a sequence of optional variable assignments and redirections, in any sequence, optionally followed by words and redirections, terminated by a control operator
***************************/

Assignments_Or_Redirections =
  first:(Assignment / Redirection) rest:(EmptyDelimiter / Assignment / Redirection )* { return Array.prototype.concat.apply(first,rest); }

Redirections =
  first:Redirection rest: (EmptyDelimiter / Redirection)* { return Array.prototype.concat.apply(first,rest); }

SimpleCommand =
   EmptyDelimiter* prefix:Assignments_Or_Redirections? cmd:non_operator_tokens? suffix:Redirections? {
			/* Combine redirection from BEFORE and AFTER the command,
			   and store assignments and redirection in seperate arrays */
			var assignments = [] ;
			var redirections = [] ;

			for (i in prefix) {
				if (prefix[i]) {
					var tmp = prefix[i];
					if ( "assignment" in tmp ) {
						assignments.push(tmp["assignment"]);
					} else if ( "redirection" in tmp ) {
						redirections.push(tmp["redirection"]);
					}
				}
			}
			for (i in suffix) {
				if (suffix[i]) {
					var tmp = suffix[i];
					if ( "assignment" in tmp ) {
						assignments.push(tmp["assignment"]);
					} else if ( "redirection" in tmp ) {
						redirections.push(tmp["redirection"]);
					}
				}
			}

			var command = {} ;

			if (assignments.length > 0)
				command["assignments"] = assignments ;
			if (redirections.length > 0)
				command["redirections"] = redirections ;
			if (cmd.length >0)
				command["tokens"] = cmd ;

			/* TODO: fix this ugly hack for the broken parser rules.
				The current parser rules wrongly accept empty command.
				mark it as so, later 'List' rule will prune this out.  */
			if (cmd.length===0 &&
				assignments.length===0 &&
				redirections.length===0)
				return null;

			return { "SimpleCommand" : command } ;
		}



/***************************
Command, as per Section "2.9 Shell Commands"
***************************/

Command =
	SimpleCommand

/***************************
Pipeline, as per Section 2.9.2
****************************/

/* TODO: negate pipeline with "!" */
Pipeline =
	first:Command rest:( !"||" '|' Command )* {
			if (rest.length === 0)
				return first;
			if (first === null) /* have a pipe character, but the first command is empty */
				error("expected valid command before |");

			var steps = [] ;
			steps.push(first);
			for (var i in rest) {
				if (rest[i][2] === null)
					error("expected valid command after |");
				steps.push(rest[i][2]);
			}
			return { 'pipeline' : steps };
		}


/****************************
Lists, as per Section 2.9.3
*****************************/

AndOrList =
	first:Pipeline rest:( and_or_op:("&&" / "||") Pipeline)* {
			if (rest.length === 0)
				return first;
			if (first === null) /* have &&/|| but the first command is empty */
				error("expected valid command before &&,||");

			var and_or_list = [];
			and_or_list.push(first);
			for (var i in rest) {
				and_or_list.push(rest[i][0]);
				if (rest[i][1] === null)
					error("expected valid command before &&,||");
				and_or_list.push(rest[i][1]);
			}

			return { "and_or_list" : and_or_list };
		}

List =
	first:AndOrList rest:( list_sep_op:(";" / "&") AndOrList)* {
			if (rest.length === 0)
				return first;

			/* Shortcut for specific case of a single command with ';' */
			if (first !== null && rest.length === 1
			    && rest[0][0] == ";" && rest[0][1] === null)
				return first;

			var current_cmd = first ;
			var steps = [] ;
			for (var i in rest) {
				var op = rest[i][0]; /* ';'or '&' */
				var next_cmd = rest[i][1];

				if (current_cmd === null)
					error("expected valid command before ';','&'");
				if ( op == ";" ) {
					steps.push( { "foreground" : current_cmd } ) ;
				} else {
					steps.push( { "background" : current_cmd } ) ;
				}

				current_cmd = next_cmd;
			}

			/* The last step, if it isn't followed by ';' or '&' */
			if (current_cmd !== null) {
				steps.push( { "foreground" : current_cmd } ) ;
			}

			return { "list" : steps } ;
		}

