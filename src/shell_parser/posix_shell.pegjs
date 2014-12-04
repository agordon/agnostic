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

function parser_debug()
{
	if (0) {
		var text = "" ;
		for (var i in arguments) {
			text += arguments[i] + " " ;
		}
		console.warn(text);
	}
}

function pack_simple_command(prefix,cmd,suffix)
{
/*			parser_debug("SimpleCommand, text = '" + text() + "' offset = " + offset() );
*/
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

			return { "SimpleCommand" : command } ;
		}

function arithmatic_binary_op(first,rest)
{
	if (rest.length===0)
		return first;

	var list=[];
	list.push(first);
	for (var i in rest) {
		list.push( rest[i][1] ); // the operator
		list.push( rest[i][3] ); // the value
	}
	return { "arithmetics_binary_op_list" : list } ;
}

}

start =
  List

/* TODO: XXX Fix this comment !!!

Acceptable Tokens when parsing shell command context.
   In this context, whitespace delimiters are accepted without any problem
   as part of the token.
   Only shell operators ( $,|,& etc ) and quoted strings will 'stop' the token
   recogonition.

   Example 1: this will be parsed as one literal token:
	sort -k1nr,1 -o foo.txt
   Example 2: this will be parsed as one compound token:
	echo hell"o  w"'or'$(echo ld)

   Rational: In POSIX Shell, field-splitting (based on whitespace/delimiters/IFS),
             is done during runtime, AFTER parameter expansion  (see section
	     "2.6 Word Expansion" item #2). So in this context, there's no
	     need to stop consuming tokens due to unquoted whitespace/delimiters.
*/

/* First word of a 'simple-command' - reject reserved words,
   which will then be processed by other rules. */
FirstCommandWord =
  !( "{" / "}" / "!" / "if" / "then" / "else" / "elif" /
     "fi" / "do" / "done" / "case" / "esac" / "while" / "until" / "for" /
     "in" )
  a:Token_NoDelimiter { return a ; }

Tokens_Command =
  first:FirstCommandWord rest:(EmptyDelimiter Token_NoDelimiter)* {
		parser_debug("Tokens_Command, text ='" + text() + "' offset = " + offset() ) ;
        var results = first ;
        rest.forEach(function(item){
            var delim = item[0];
            var tokens = item[1];
            results.push(delim); // Emptydelimiter is one item
            results = results.concat(tokens); // Tokens is an array of items, add each one
        });
		return results;
	}

Non_Operator_UnquotedCharacters =
  value:[^\|\&\;\<\>\(\)\$\`\'\\\"\'\n]+ { return { "literal" : value.join("") }; }




/* Acceptable Tokens when a single (non-delimited) token is allowed.
   Example, where 'word' can be any token, but must not contain unquoted delimiters:
	FOO=word command
	command 2>word
   But a compound token is still acceptable:
	FOO=he"llo"$(echo world) command

   NOTE: during execution (in parameter-expansion step), the 'word' might be
         expanded to multiple fields (after field-splitting).
	 This will be detected during execution, and cause an error.
	 Example:
	   $  C="foo bar"
	   # Below, $C is a single, non-delimited token. Parsing will succeed.
	   # but in runtime, it will be expanded to two fields, and the shell will comlain.
	   $  seq 10 >$C
	   bash: $C: ambiguous redirect

	   # Below, "$C" is a single, non-delimited token. Parsing will succeed.
	   # in runtime, because of the double-quotes, the expanded value is
	   # is STILL one field (a filename with a space) - no errors here.
	   $ seq 10 >"$C"
*/
Token_NoDelimiter =
  !redirection_word_hack
  items:( NoDelimiter_UnquotedCharacters / AllContexts_Tokens )+ { return items; }

NoDelimiter_UnquotedCharacters =
  value:[^\|\&\;\`\<\>\(\)\$\\\"\ \t\'\n]+ { return { "literal" : value.join("") }; }


/* Acceptable Tokens inside braces ${} -
   (See Section "2.3 Token Recognition" item #4).
   In the form of ${param:=word} , "word" can be almost any unquoted tokens - 
   shell operators are not used. So the following are all valid assignments:
	${FOO-BAR}
	${FOO-HELLO|WORLD}       (inside ${} - this is not a shell pipe)
	${FOO-HELLO>WORLD}       (inside ${} - this is not redirection)
*/
Token_NoBraces =
  ( NoBraces_UnquotedCharacters / AllContexts_Tokens )+

NoBraces_UnquotedCharacters =
  value:[^\}\$\'\\\"\n]+ { return { "literal" : value.join("") }; }

/* Acceptable Tokens Double Quotes ""
*/
NoDoubleQuotes_UnquotedCharacters=
  value:[^\$\"\n]+ { return { "literal" : value.join("") }; }

/*
This rule recognizes tokens which are acceptable in any context.

Rational:
These tokens have well defined start and end (e.g. double-quotes, single-quotes,
parenthesis, braces, backticks). Their detection does not change based on context
(e.g. like a  "whitespace" which separates tokens in unquoted commands, but not inside ${} ).
Also, these rules require proper balancing of opening and closing characters.

This rule is not used directly, but combimed with the specific rule
for unquoted characters (which depends on the context).

     Example:
	'hello'"wo"$(echo rl)${FOO-d}$((5+4))
     Is a valid compound token in all contextes:
        1. literal string 'hello'
	2. double-quoted string "wo"
	3. sub-shell command $(echo rl)
	4. parameter expansion ${FOO-d}
	5. Arithmetic expression 5+4
     After evaluation, it will be consolidated into one token: "hellworld9" .
*/
AllContexts_Tokens =
      SingleQuotedString / DoubleQuotedString / EscapedCharacter / Expandable


/* Ugly Hack:
   prevent the "2" in input like "uptime 2>&1" to be separated from the redirection. */
redirection_word_hack =
  [0-9]+ [\<\>]


SingleQuotedString =
  "'" value:SingleQuotedStringCharacter* "'" { return { "singlequotedstring" : value.join("") } ; }

SingleQuotedStringCharacter =
  !("'" / "\\" / LineTerminator) value:. { return value ; }
  / EscapedCharacter

DoubleQuotedString =
  '"' value:( NoDoubleQuotes_UnquotedCharacters / EscapedCharacter / Expandable)* '"' { return { "doublequotedstring" : value } ; }

EscapedCharacter =
  "\\" value:. { return { "literal" : "\\" + value } ; }

LineTerminator =
  "\n"

EmptyDelimiter =
  [\n\t ]+ { return { "delimiter" : null }; }

VariableName =
  [A-Za-z_][A-Za-z0-9_]* { return text(); }


/***********************
  Redirections, section 2.7
***********************/

RedirectionFileDescriptor =
 [0-9]+ { return parseInt(text()); }


/* Input Redirection, 2.7.1 */
InputRedirection =
  fd:RedirectionFileDescriptor? '<' whitespace file_name:Token_NoDelimiter {
		if (fd === null)
			fd = 0 ; /* Default FD is STDIN/0 if not defined */
		return { 'redirection' :
			{ 'type':'input_file',
			  'filename': file_name,
			  'filedescriptor': fd } } ;
		}

/* Output Redirection, 2.7.2 */
OutputRedirection =
  fd:RedirectionFileDescriptor? '>' whitespace forceclobber:'|'? file_name:Token_NoDelimiter {
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
  fd:RedirectionFileDescriptor? '>>' whitespace file_name:Token_NoDelimiter {
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
  fd:RedirectionFileDescriptor? '<>' whitespace file_name:Token_NoDelimiter {
		if (fd === null)
			fd = 0 ; /* Default FD is STDIN/0 if not defined */
		return { 'redirection' :
			{ 'type':'inout_file',
			  'filename': file_name,
			  'filedescriptor': fd } } ;
		}

Redirection =
  item:( InputRedirection /
  OutputRedirection /
  AppendRedirection /
  HereDocRedirection /
  DupInputRedirection /
  DupOutputRedirection /
  InOutRedirection) {
		 parser_debug("Redirection, text ='" + text() + "' offset = " + offset() ) ;
		return item;
		}

/***********************
Variable Assignment, as per 2.9.1:
*************************/

Assignment =
  vari_name:VariableName '=' value:Token_NoDelimiter? {
	  parser_debug("Assignments, text ='" + text() + "' offset = " + offset() ) ;
	  if (!value) {
		//In case of empty assignment (e..g "FOO="),
		//emulate it as "FOO=''" )
		value = [ { literal : "" } ];
	  }
	  var tmp={}; tmp[vari_name]=value; return { 'assignment' :tmp }; }


/***************************
A Simple Command, as per 2.9.1:
A "simple command" is a sequence of optional variable assignments and redirections, in any sequence, optionally followed by words and redirections, terminated by a control operator
***************************/

Assignments_Or_Redirections =
  first:(Assignment / Redirection) rest:( (EmptyDelimiter+ Assignment ) / ( EmptyDelimiter* Redirection) )* {
		parser_debug("Assignments_or_Redirections, text ='" + text() + "' offset = " + offset() ) ;
		return Array.prototype.concat.apply(first,rest); }

Redirections =
  first:Redirection rest: (EmptyDelimiter* Redirection)* {
		parser_debug("Redirections, text ='" + text() + "' offset = " + offset() ) ;
		return Array.prototype.concat.apply(first,rest); }

SimpleCommand =
   prefix:Assignments_Or_Redirections EmptyDelimiter+ cmd:Tokens_Command EmptyDelimiter+ suffix:Redirections {
		parser_debug("SimpleCommand(form1), text ='" + text() + "' offset = " + offset() ) ;
		return pack_simple_command(prefix, cmd, suffix); }
   / prefix:Assignments_Or_Redirections EmptyDelimiter+ cmd:Tokens_Command {
		parser_debug("SimpleCommand(form2), text ='" + text() + "' offset = " + offset() ) ;
		return pack_simple_command(prefix, cmd, []); }
   / prefix:Assignments_Or_Redirections {
		parser_debug("SimpleCommand(form3), text ='" + text() + "' offset = " + offset() ) ;
		return pack_simple_command(prefix, null, []); }
   / cmd:Tokens_Command EmptyDelimiter* suffix:Redirections {
		parser_debug("SimpleCommand(form4), text ='" + text() + "' offset = " + offset() ) ;
		return pack_simple_command([], cmd, suffix); }
   / cmd:Tokens_Command {
		parser_debug("SimpleCommand(form5), text ='" + text() + "' offset = " + offset() ) ;
		return pack_simple_command([], cmd, []); }


/***************************
Command, as per Section "2.9 Shell Commands"
***************************/

Compound_List = cmd:List { return cmd ; }

/* Compound Commands - Section "2.9.4" */
Compound_Command_Subshell =
	"(" EmptyDelimiter* cmd:Compound_List EmptyDelimiter* ")" { return { "compound_subshell" : cmd } ; }

Compound_Command_Currentshell =
	"{" EmptyDelimiter* cmd:TerminatedList EmptyDelimiter* "}" { return { "compound_currentshell" : cmd } ; }

Command =
	EmptyDelimiter* cmd:(SimpleCommand / Compound_Command_Subshell / Compound_Command_Currentshell / For_clause / If_clause / While_Until_Clause) EmptyDelimiter* { return cmd; }

Wordlist =
  first:Token_NoDelimiter rest:(EmptyDelimiter Token_NoDelimiter)* {
        var results = first ;
        rest.forEach(function(item){
            var delim = item[0];
            var tokens = item[1];
            results.push(delim); // Emptydelimiter is one item
            results = results.concat(tokens); // Tokens is an array of items, add each one
        });
		return results;
	}

Do_group = "do" EmptyDelimiter* cmd:Compound_List EmptyDelimiter* "done"
	{ return cmd ; }


For_clause =
	"for" EmptyDelimiter* name:VariableName EmptyDelimiter*
	"in" EmptyDelimiter* wordlist:Wordlist EmptyDelimiter* ";"
        EmptyDelimiter*
	action:Do_group
	{ return { "for_clause": { "varname" : name, "wordlist" : wordlist, "action":action } }; }

If_clause = "if" EmptyDelimiter* condition:Compound_List EmptyDelimiter*
	    "then" EmptyDelimiter* then_commands:Compound_List EmptyDelimiter*
	    elif_parts:Elif_clause*
	    else_part:Else_clause ?
	    "fi"
		{
		   var ifs = [ { "condition" : condition, "action" : then_commands } ];
		   if (elif_parts) {
			elif_parts.forEach(function(a){ifs.push(a)});
	           }
		   if (else_part) {
			ifs.push( { "condition" : "else", "action" : else_part } );
		   }
		   return { "if_clause" : ifs } ;
		}

Elif_clause = "elif" EmptyDelimiter* condition:Compound_List EmptyDelimiter*
		"then" then_commands:Compound_List EmptyDelimiter*
		{
		   return { "condition" : condition, "action" : then_commands } ;
		}

Else_clause = "else" EmptyDelimiter* then_commands:Compound_List EmptyDelimiter*
		{
		   return then_commands ;
		}

While_Until_Clause = type:( "while" / "until" ) EmptyDelimiter*
                     condition:Compound_List EmptyDelimiter*
		     action:Do_group
			{
			  return { "while_until" : {
					"type" : type,
					"condition" : condition,
					"action" : action
				} } ;
			}


/***************************
Pipeline, as per Section 2.9.2
****************************/

/* TODO: negate pipeline with "!" */
Pipeline =
	first:Command rest:(  !"||" '|' Command )* {
			parser_debug("Pipeline, text ='" + text() + "' offset = " + offset() ) ;

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
			parser_debug("AndOrList, text = '" + text() + "'");
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

/* TODO:
	Allow multilined commands, separator can be "\n" -
	basically, allowing shell scripts.
*/
List =
	first:AndOrList rest:( list_sep_op:(";" / "&") AndOrList)* last_op:(";" / "&")? {
			parser_debug("List, text = '" + text() + "'");

			/* Shortcut for specific case of a single command with ';' */
			if (rest.length === 0 && ( last_op === null || last_op === ";" ))
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

				if (last_op === null || last_op === ";" )
					steps.push( { "foreground" : current_cmd } ) ;
				else
					steps.push( { "background" : current_cmd } ) ;
			}

			return { "list" : steps } ;
		}

/*
TerminatedList produces the same tree-structure as "List",
but requires slightly modified input rules:
Each command MUST be terminated by a ';' or '&' (or newline, in the future).
This requirement happens inside the compound_command_currentshell rule,
as the POSIX shell standard mandates that compound commmands inside braces
ALWAYS have a terminated character (due to different implementation of the tokenizer).

Section 2.9.4 says:
"{ compound-list;}
      Execute compound-list in the current process environment.
      The semicolon shown here is an example of a control operator
      delimiting the } reserved word.
      Other delimiters are possible, as shown in Shell Grammar; a <newline> is frequently used."

*/
TerminatedList =
	items:( AndOrList list_sep_op:(";" / "&") )+ {
			parser_debug("TerminatedList, text = '" + text() + "'");

			var steps = [] ;
			for (var i in items) {
				var cmd = items[i][0];
				var op = items[i][1]; /* ';'or '&' */

				if ( op == ";" ) {
					steps.push( { "foreground" : cmd } ) ;
				} else {
					steps.push( { "background" : cmd } ) ;
				}
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

/* Rule for a subshell (i.e. $() ) */
SubshellExpandable =
  "$(" !"(" EmptyDelimiter* ")" { return { "subshell" : null } ; }
  / "$(" !"(" term:List ")" { return { "subshell" : term } ; }

/* in a backtick-shell "``" - backslash-quoted backticks are Ok, as are braces and parens.
   TODO: recursive backticks are NOT allowed, and backslash-backticks should be used instead.
         this parser rule does not allow it yet. */
BacktickExpandable =
  "`"  terms:List "`" { return { "backtickshell" : terms } ; }

/* Rule for a simple parameter expansion, i.e. ${VAR} */
ParameterExpandable =
  "${" varname:ParameterName "}" { return { "envvar" : varname } ; }
  / "$" varname:ParameterName "" { return { "envvar" : varname } ; }

/* Rule for parameter expansion, including an operation, e.g. $(VAR:=VALUE} .
   NOTE: the "VAR" can only contain valid parameter-name characters,
         but the "VALUE" part can recursively contain more expandable items. */
ParameterOperationExpandable =
  "${" varname:ParameterName varop:ParameterExpansionOperator opvalue:Token_NoBraces* "}" { return { "envvar_operation" : { "envvar" : varname, "operation" : varop, "value": (opvalue?opvalue[0]:[]) } }; }
  / "${#" varname:ParameterName "}" { return { "envvar_operation" : { "envvar" : varname, "operation" : "strlen", "value" : null } }; }

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
  "$((" whitespace "))" { return { "arithmetic" : { literal : 0 } } ; }
  / "$((" whitespace expr:ArithmeticExpression whitespace "))" { return { "arithmetic" : expr } ; }

ArithmeticExpression =
	ConditionalOpTerm

ConditionalOpTerm
  = condition:LogicalOrTerm
    rest:(whitespace "?" whitespace true_value:LogicalOrTerm
	  whitespace ":" whitespace false_value:LogicalOrTerm)?
	{
		if (rest===null)
			return condition;
		return { "arithmetics_ternary_op" :
			[ condition, rest[3], rest[7]] };
	}

LogicalOrTerm
  = first:LogicalAndTerm
    rest:( whitespace "||" whitespace LogicalAndTerm)*
	{ return arithmatic_binary_op(first,rest) ; }

LogicalAndTerm
  = first:BitwiseOrTerm
    rest:( whitespace "&&" whitespace BitwiseOrTerm)*
	{ return arithmatic_binary_op(first,rest) ; }

BitwiseOrTerm
  = first:BitwiseXorTerm
    rest:( whitespace "|" whitespace BitwiseXorTerm)*
	{ return arithmatic_binary_op(first,rest) ; }

BitwiseXorTerm
  = first:BitwiseAndTerm
    rest:( whitespace "^" whitespace BitwiseAndTerm)*
	{ return arithmatic_binary_op(first,rest) ; }

BitwiseAndTerm
  = first:EqualityOpTerm
    rest:( whitespace "&" whitespace EqualityOpTerm)*
	{ return arithmatic_binary_op(first,rest) ; }

EqualityOpTerm
  = first:RelationalOpTerm
    rest:( whitespace ("==" / "!=" ) whitespace RelationalOpTerm)*
	{ return arithmatic_binary_op(first,rest) ; }

RelationalOpTerm
  = first:BitwiseShiftTerm
    rest:( whitespace ( "<=" / ">=" / ">" / "<" ) whitespace BitwiseShiftTerm)*
	{ return arithmatic_binary_op(first,rest) ; }

BitwiseShiftTerm
  = first:AdditiveTerm
    rest:( whitespace (">>" / "<<") whitespace AdditiveTerm)*
	{ return arithmatic_binary_op(first,rest) ; }

AdditiveTerm
  = first:Term rest:( whitespace ("+" / "-") whitespace Term)*
	{ return arithmatic_binary_op(first,rest) ; }

Term
  = first:UnaryOpTerm rest:( whitespace ("*" / "/" / "%") whitespace UnaryOpTerm)*
	{ return arithmatic_binary_op(first,rest) ; }

UnaryOpTerm
  = op:( "!" / "~" )? whitespace term:Factor
	{
		if (op===null)
			return term;
		return { "arithmetic_unary_op_list" : [ op, term ] };
	}

Factor
  = "(" whitespace expr:ArithmeticExpression whitespace ")" { return expr ; }
  / value:Integer { return { "literal" : value } ; }
  / ArithmeticParameterName { return { "envvar" : text() } ; } /* an unquoted alphanumeric text means an environment variable name */
  / Expandable

Integer =
  DecimalInteger / HexInteger / OctalInteger

DecimalInteger
  = [1-9][0-9]* { return parseInt(text(), 10); }

HexInteger
  = "0x" hexvalue:[A-Fa-f0-9]+ { return parseInt(text(), 16); }

/* NOTE: octal's zero prefix will catch "0" value as well */
OctalInteger
  = "0" [0-7]* { return parseInt(text(), 8); }

/* Parameter Variable Names which can appear inside $(()) without a '$' - special variables can't.
   e.g. invalid: $((?))
        valid:   $(($?)) */
ArithmeticParameterName =
  [A-Za-z_][A-Za-z0-9_]* { return text(); }


/* TODO: add newlines \r\n? */
whitespace
  = [ \t]*

