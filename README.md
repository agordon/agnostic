# Agnostic

**Agnostic** is an attempt to implement the unix user interface (shell + common programs) in Javascript.

The long-term goal is to provide a web-based educational environment for users to experiment with the unix user interface, and provide structured tutorials (akin to <http://try.github.com>, <http://codeacademy.com>, etc.).

Demo at: <http://agnostic.housegordon.org> .

## Current Status

1. POSIX shell interface.
    * Implemented:
        * posix-compliant tokenizing, shell-quotes, field-splitting.
        * variable assignment (`CC=clang`)
        * parameter expansion (`$HOME`),
        * partial arithmetic expressions (`$((42/9))`)
        *  Subshells (`NAME=$(basename "$FILE" .txt)`)
        * Pipes (`seq 10 | wc -l`),
        * And/Or operations (`make && echo ok || echo failed`)
        * Sequential commands ( `sleep 10 ; touch 1.txt` )
        * Compound commands ( `make || { echo make failed ; exit 1 ; }` )
        * some Special built-in utilities ( `export`, `readonly`, `set`, `unset`).
    * Not yet implemented:
        * redirection
        * filename-expansion
        * control structures (`if`,`case`,`while`,etc.)
        * Parameter expansion string operations ( `${FOO:-BAR}` )
        * aliases
        * multiline statements
        * Here-Documents

2. POSIX utilities
    * (almost) fully implemented: `basename`, `cat`, `cut`, `dirname`, `echo`, `false`, `head`, `printf`, `seq`, `tac`,
    `tail`, `true`, `wc` 
    * partialyl implemented: `date`
    * not yet implemented (but planned): `paste`, `env`, `grep`, `find`, `xargs`
    * Challenging but highly desired: `sed`, `awk`.

3. Local execution (mainly for testing) using NodeJS.

4. Web-based execution, with "terminal-like" behavior implemented in Javascript.


## Try it

1. Locally with NodeJS:

        $ npm install -g browserify
        $ npm install -g pegjs
        $ npm install -g uglify-js
        $ git clone https://github.com/agordon/agnostic
        $ cd agnostic
        $ ./shell

    The `./shell` script will start an interactive-shell session, emulating a 'real' unix shell environment,
    except it will all be running using javascript. Try running some command (e.g. `seq 10 | wc -l`) and compare
    the output to a real unix environment.

2. Web - visit one of the following:
    * [Terminal Emulation Page](http://agnostic.housegordon.org/) - A demo of interactive shell session in a dumb terminal, with minimal command-line editing.
    * [Shell Parser](http://agnostic.housegordon.org/parse_demo.html) - A demo of the shell syntax parser output (without  actual execution).


## Project Goals

When/If the project is ever done, it will have:

* Client-side, browser-based Console/Terminal/Command-line emulation interface.
* Complete (or near-complete) POSIX Shell parsing capabilities.
* Partial implementation unix programs (e.g. `seq`, `cut`, `sort`, `head`, `grep`),
enough to run typical unix commands inside the Javascript emulation environment.
* Classes / Lessons
    * Teaching the many aspects of UNIX environment: parameters, long/short options,
    redirection, pipes, etc.
    * Domain-specific lessons (e.g. UNIX for bioinformatics)
* UNIX command-line demystifier: users could paste a unix-command line, and have
different parts of it explained (e.g. what does `grep -iw foo | cut -f3,5 | sort -k2n,2 | uniq -c > foo.txt` do?)

## Technical goals

* free as in speech: code and lesson plans will be available under GPLv3 (or later).
* Lessons, classes should be *easy enough* to add, with minimal programming requirements.
* Lessons and classes and programs should have translatable strings.
* The project should be able to include any command-line program, even if implemented as an empty stub.
* for more details, see `PLANS.md` file.

## Helping out

The project is in very early development stage, and many details are not yet set.
If you're interested in helping, send me an email.  Also see `PLANS.md` and `HACKING.md` files for details.

## Requirements

To run / hack the project, you'll need:

* [NodeJS](http://nodejs.org)
* [npm](http://npmjs.org) (NodeJS's package manager)
* The following NPM packages:
    * [PEGjs](http://pegjs.majda.cz/) - Parser Generator for Javascript
    * [Browserify](http://browserify.org) - Bundles Javascript modules for browser usage.
    * [UglifyJS](http://marijnhaverbeke.nl//uglifyjs) - Javascript minifier
* [jq](http://stedolan.github.io/jq/) - (optional) for pretty JSON printing.

### Contact

Assaf Gordon <assafgordon@gmail.com>

### License

All code written for this project is released under GPLv3 or later.

The code uses multiple libraries, with varying free/open-source licenses,
see `LICENSE` file for details.


