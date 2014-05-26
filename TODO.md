# TODO list
(in no particular order)

## POSIX Shell Parsing

* Add missing features from POSIX:
	* compound-commands
	* control structures (for,if,case)
	* aliases
	* parameter expansion
	* filename expansion
	* sub-shells
	* functions
	* multi-line input
	* Here-Documents redirection
* Save position (character start/end position) of each parsed item,
for later display of errors or information.
* convert commands to OO structure instead of textual JSON

## Shell Executor

* Use JavaScript idioms for:
    * Modules / Namespaces
    * Exception Throwing and Handling
* Instead of "console.log" - report events with using an external interface/object


## Build/infrastructure

* Improve `Makefile`. It is currently all hard-coded.

## Similar / Related Projects

* Mozilla's GCLI (demo: <http://mozilla.github.io/gcli/> ,
 <github: https://github.com/joewalker/gcli>) - very interesting, slick, feature rich.
But too *cutesy*, "web 2.0++" for my current taste...

* Ace Javascript Editor: <http://ace.c9.io>
