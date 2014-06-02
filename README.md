# UGP - (UNIX) Guide for the Perplexed

This is an early-alpha-stage project, which I hope one day will become
the UNIX equivalent of online tutorials such as <http://try.github.io>,
CodeSchool, CodeAcademy, and others.

### Current Status

1. Implemeted: a partial POSIX shell syntax parser in Javascript, accepts shell command
syntax (e.g. `grep -iw FOO <input.txt | LC_ALL=C sort -k2n2 | wc -l && echo ok`)
and returns a JSON representation of the commands:

    ```
    {
      "and_or_list": [
        {
          "pipeline": [
            {
              "SimpleCommand": {
                "tokens": [ "grep", "-iw", "FOO" ],
                "redirections": [
                  { "filedescriptor": 0, "filename": "input.txt", "type": "input_file" }
                ]
              }
            },
            {
              "SimpleCommand": {
                "tokens": [ "sort", "-k2n2" ],
                "assginments": [ { "LC_ALL": "C" } ]
              }
            },
            {
              "SimpleCommand": { "tokens": [ "wc", "-l" ] }
            }
          ]
        },
        "&&",
        {
          "SimpleCommand": { "tokens": [ "echo", "ok" ] }
        }
      ]
    }
    ```

2. Emulated operating system, implemented:
    * Streams (emulating stdin/stdout/stderr)
    * File Objects (functioning more like 'object storage' than posix files)
    * File System (files, directories, stats). Partial, non-posix-compliant at all.
    * Opeating-System class
    * Process-State class (encapsulating per-process information)

3. Emulated programs, implemented:
    * date(1) - partial
    * head(1)
    * seq(1)

### Project Goals

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

### Technical goals

* free as in speech: code and lesson plans will be available under GPLv3 (or later).
* Lessons, classes should be *easy enough* to add, with minimal programming requirements.
* Lessons and classes and programs should have translatable strings.
* The project should be able to include any command-line program, even if implemented as an empty stub.
* for more details, see `PLANS.md` file.

### Helping out

The project is in very early development stage, and many details are not yet set.
If you're interested in helping, send me an email.  Also see `TODO.md` file for details.

To try it out yourself, clone this repository and run `make`.

### Requirements

* [nodejs](http://nodejs.org/)
* [PEGjs](http://pegjs.majda.cz/)
* [jq](http://stedolan.github.io/jq/) - (optional) for pretty JSON printing.

### Contact

Assaf Gordon <assafgordon@gmail.com>

### License

All code written for this project is GPLv3 or later.

See `LICENSE` file for details.
