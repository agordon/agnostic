# TODO list
(in no particular order)

## POSIX Shell Parsing

* Add missing features from POSIX:
	* compound-commands
	* control structures (for,if,case)
	* aliases
	* filename expansion
	* functions
	* multi-line input
	* Here-Documents redirection
* Save position (character start/end position) of each parsed item,
for later display of errors or information.
* convert commands to OO structure instead of textual JSON
* Consolidate the "EmptyDelimiter" and "WhiteSpace" rules, then prepare for multiline input.
* Consider Re-implementation, closer to the spirit of POSIX Shell standard:
    * Tokenizing with PEGjs, emitting Tokens.
    See Section "2.3 Token Recognition"
    * Parsing Grammar, with Jison ( http://zaach.github.io/jison/docs/ ).
    See Section "2.10 Shell Grammer"

## Shell Executor

* Use JavaScript idioms for:
    * Modules / Namespaces
    * Exception Throwing and Handling

* Shell Parser + Descritpr:
    * Generate unique IDs for each element in the parsed tree, to be later
    used with *all* the descriptor (HTML/text/executor)

## OS

* Consolidate "streams" and "files", and then
* Implement pseudo-File-Descriptor (.e.g os.GetFileDescriptor(int) )
* Move "ProgramBase" functionality into "Process-State", make a "program" be just one function.

## Programs

* Date:
    * Support UTC (javascript's Date() supports it)
    * Use `strftime` in Javascript <https://github.com/samsonjs/strftime>,
    then  implement almost-full `date` format options.
* TESTS:
    * consolidate tests for programs with a testing framework (for stdin/argvs/exitcode/stdout/stderr)
* 'coreutil programs' - consolidate methods from XXX_file, XXX_stdin, XXX_content

## Build/infrastructure

* Improve `Makefile`. It is currently all hard-coded.
* Follow advice from [Writing for node and the browser](http://caolanmcmahon.com/posts/writing_for_node_and_the_browser/)

## Testing

* Use PhantomJS to test javascripts, in addition to NodeJS testing.

## Similar / Related Projects

* Mozilla's GCLI (demo: <http://mozilla.github.io/gcli/> ,
 <github: https://github.com/joewalker/gcli>) - very interesting, slick, feature rich.
But too *cutesy*, "web 2.0++" for my current taste...

* Ace Javascript Editor: <http://ace.c9.io>
    * Google Groups: [Using Single-Line Mode](https://groups.google.com/forum/#!searchin/ace-discuss/single$20line/ace-discuss/x3vAP3pIvvA/fgK79zEKTW4J)
    * Code: [SingleLineEditor](https://github.com/ajaxorg/ace/blob/d5566938ba/demo/kitchen-sink/layout.js#L103-L128)
    * Code: [ENTER key binding](https://github.com/ajaxorg/ace/blob/d5566938ba/demo/kitchen-sink/demo.js#L210-L221)

* JS/UIX - virtual OS written entirely in Javascript: <http://www.masswerk.at/jsuix/jsuix-documentation.txt> ,
    from 2003. Current Status unclear. License clearly not free. Uses "old-style" functional javascript.

