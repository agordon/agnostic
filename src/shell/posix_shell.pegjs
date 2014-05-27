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

non_operator_tokens =
  first:non_operator_token rest:( non_operator_token / EmptyDelimiter )* {
		var results = [] ;
		for (var i in first) {
			results.push(first[i]);
		}
		for (var i in rest) {
			var item = rest[i];
			for (var j in item) {
				results.push(item[j]);
			}
		}
		return { "tokens" : results };
	}

/* non_operator_token :
     a non-delimited list of items, that can be considered as "one" item
     (after possible expansion), and does not include any special shell operator.
     Example:
	hello"wo"$(echo rl)${FOO-d}
     Is a valid, non-delimited, non-operator token list, containing:
        1. literal string "hello"
	2. double-quoted string "wo"
	3. sub-shell command $(echo rl)
	4. parameter expansion ${FOO-d}
     After evaluation, it will be consolidated into one token: "hellworld",
     but this happens outside the parser. */

non_operator_token =
  !redirection_word_hack
      terms:( NonQuotedCharacters /
              SingleQuotedString /
              DoubleQuotedString /
              EscapedCharacter /
              Expandable
              )+ { return terms; }

/* Ugly Hack:
   prevent the "2" in input like "uptime 2>&1" to be separated from the redirection. */
redirection_word_hack =
  [0-9]+ [\<\>]

/* Ugly Hack: catch valid assignments syntax.
   Valid assignments can happen at the first word/token of a new command (or sub command),
   and must contain only valid characters and an equal sign.
   Example:
     ABC= uname         -  "ABC=" is a valid assignment.
     A%C= uname         -  "A%C=" is not a valid assignment, and the shell will
                           treat it as the atcual command (and fail with '"A%C=" command not found').
/*
assignment_word_hack =
  [A-Za-z_][A-Za-z0-9_]* '='

non_first_word_non_operator_token =
  !assign_word_hack non_operator_token
*/


/* Characters which do not need quoting, as per 2.2 */
NonQuotedCharacters =
  value:[^\|\&\;\<\>\(\)\$\'\\\"\' \t\n]+ { return { "literal" : value.join("") } ; }

SingleQuotedString =
  "'" value:SingleQuotedStringCharacter* "'" { return { "singlequotedstring" : value.join("") } ; }

SingleQuotedStringCharacter =
  !("'" / "\\" / LineTerminator) value:. { return value ; }
  / EscapedCharacter

/* TODO: allow parameter expansion sinde double-quoted string */
DoubleQuotedString =
  '"' value:DoubleQuotedStringCharacter* '"' { return { "doublequotedstring" : value.join("") } ; }

DoubleQuotedStringCharacter =
  !('"' / "\\" / LineTerminator) value:. { return value ; }
  / EscapedCharacter

EscapedCharacter =
  "\\" value:. { return { "literal" : "\\" + value } ; }

LineTerminator =
  "\n"

EmptyDelimiter =
  [\n\t ]+ { return [ { "delimiter" : null } ]; }

VariableName =
  [A-Za-z_][A-Za-z0-9_]* { return text(); }


/***********************
  Redirections, section 2.7
***********************/

RedirectionFileDescriptor =
 [0-9]+ { return parseInt(text()); }


/* Input Redirection, 2.7.1 */
InputRedirection =
  fd:RedirectionFileDescriptor? '<' file_name:non_operator_token {
		if (fd === null)
			fd = 0 ; /* Default FD is STDIN/0 if not defined */
		return { 'redirection' :
			{ 'type':'input_file',
			  'filename': file_name,
			  'filedescriptor': fd } } ;
		}

/* Output Redirection, 2.7.2 */
OutputRedirection =
  fd:RedirectionFileDescriptor? '>' forceclobber:'|'? file_name:non_operator_token {
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
  fd:RedirectionFileDescriptor? '>>' file_name:non_operator_token {
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
  fd:RedirectionFileDescriptor? '<>' file_name:non_operator_token {
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

Assignment =
  vari_name:VariableName '=' value:non_operator_token { var tmp={}; tmp[vari_name]=value; return { 'assignment' :tmp }; }


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

			if (cmd)
				command["command"] = cmd ;

			/* TODO: fix this ugly hack for the broken parser rules.
				The current parser rules wrongly accept empty command.
				mark it as so, later 'List' rule will prune this out.  */
			if (! (cmd) &&
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

/****************************************
 Parameter Expansions
******************************************/

Expandable =
  SubshellExpandable /
  BacktickExpandable /
  ParameterExpandable /
  ParameterOperationExpandable /
  ArithmeticExpandable

/* These are the allowed "literal" characters inside the expandables
   (i.e. characters allowed inside ${} $() ``) - which will NOT trigger
   a recursive call to an inner expandable rule */
AllowedCharacters =
  [^\$\(\)\`\\\{\}]+ { return text(); }


/* Rule for a subshell (i.e. $() ) */
SubshellExpandable =
  "$(" !"(" terms:SubshellExpandableInner* ")" { return { "subshell" : terms } ; }

/* in a subshell "$()" - backslash-quoted parens are Ok, as are braces */
SubshellExpandableInner =
  Expandable / "\\(" / "\\)" / "{" / "}" / "\\$" / AllowedCharacters { return text(); }

/* in a backtick-shell "``" - backslash-quoted backticks are Ok, as are braces and parens.
   TODO: recursive backticks are NOT allowed, and backslash-backticks should be used instead.
         this parser rule does not allow it yet. */
BacktickExpandable =
  "`"  terms:BacktickExpandableInner* "`" { return { "backtickshell" : terms } ; }

BacktickExpandableInner =
  Expandable / "\\`" / "\\`" / "(" / ")" / "{" / "}" / AllowedCharacters { return text(); }


/* Rule for a simple parameter expansion, i.e. ${VAR} */
ParameterExpandable =
  "${" varname:ParameterName "}" { return { "envvar" : varname } ; }
  / "$" varname:ParameterName "" { return { "envvar" : varname } ; }

/* Rule for parameter expansion, including an operation, e.g. $(VAR:=VALUE} .
   NOTE: the "VAR" can only contain valid parameter-name characters,
         but the "VALUE" part can recursively contain more expandable items. */
ParameterOperationExpandable =
  "${" varname:ParameterName varop:ParameterExpansionOperator opvalue:ParameterOperationValue* "}" { return { "envvar_operation" : { "envvar" : varname, "operation" : varop, "value": opvalue } }; }

/* In a "${}" parameter expansion, backslash-quoted braces are allowed, as are parens. */
ParameterOperationValue =
  Expandable / "\\{" / "\\}" / "(" / ")" / "\\$" / AllowedCharacters { return text(); }

/* Alphanumeric parameter name, or special parameter name (section 2.5.2) */
ParameterName =
  ( [A-Za-z_][A-Za-z0-9_]* / [\@\*\#\?\-\$\!\0] ) { return text(); }

/* Section 2.6.2 Parameter Expansions
   TODO: what about "/" operator? seems to be commonly implemented.
           $ FOO=helloworld
           $ echo ${FOO/world}
           hello
*/
ParameterExpansionOperator =
  ( ":-" / "-" / ":=" / "=" / ":?" / "?" / ":+" / "+" /"%" / "%%" / "#" / "##" ) { return text(); }


/******************************************************
Artihmetic Expressions, Section 2.6.4.

NOTE: The parsing starts with "ArithmeticExpandable",
      goes all the way up to "Factor" - which recursively goes back
      to "Expandable" (because arithmetic operations are allowed to have
      expandable parameters inside them).

TODO: The parsing tree is more-or-less standard for arithmetic expressions,
      but currently only +,-,*,/ operators are implemented.
      The full list to be implemented is here:
        http://pubs.opengroup.org/onlinepubs/009695399/utilities/xcu_chap01.html#tag_01_07_02_01
        (without "sizeof", selection, jump, interation operatiors).
******************************************************/

ArithmeticExpandable =
  "$((" whitespace expr:ArithmeticExpression whitespace "))" { return { "arithmetic" : expr } ; }


ArithmeticExpression
  = first:Term rest:( whitespace ("+" / "-") whitespace Term)* {
		if (rest.length===0)
			return first;

		var list=[];
		list.push(first);
		for (var i in rest) {
			list.push( rest[i][1] ); // the operator + or -
			list.push( rest[i][3] ); // the value
		}
		return { "arithmetics_add_sub" : list } ;
	}

Term
  = first:Factor rest:( whitespace ("*" / "/") whitespace Factor)* {
		if (rest.length===0)
			return first;

		var list=[];
		list.push(first);
		for (var i in rest) {
			list.push( rest[i][1] ); // the operator * or /
			list.push( rest[i][3] ); // the value
		}
		return { "arithmetics_mul_div" : list } ;
	}


Factor
  = "(" whitespace expr:ArithmeticExpression whitespace ")" { return expr ; }
  / value:Integer { return { "literal" : value } ; }
  / ArithmeticParameterName
  / Expandable

Integer =
  DecimalInteger / HexInteger / OctalInteger

DecimalInteger
  = [1-9][0-9]* { return parseInt(text(), 10); }

HexInteger
  = "0x" hexvalue:[A-Fa-f0-9]+ { return parseInt(text(), 16); }

OctalInteger
  = "0" [0-7]+ { return parseInt(text(), 8); }

/* Parameter Variable Names which can appear inside $(()) without a '$' - special variables can't.
   e.g. invalid: $((?))
        valid:   $(($?)) */
ArithmeticParameterName =
  [A-Za-z0-9_]+ { return text(); }


/* TODO: add newlines \r\n? */
whitespace
  = [ \t]*

