# Future Plans

## Technical

* Each programs (e.g. `cut`, `seq`, `wc`)
    * Each program is a Javascript module.
    * has a "main" method
        * Accepting:
            * STDIN - as multi-line string
            * Parameters from 'shell' module, after expansion
        * Returning:
            * two multi-lined strings (representing STDOUT,STDERR)
            * Numeric exit code
            * Whether the command was fully emulated (and the output should be
            identical to the output a user would get on a real machine). Otherwise,
            show a helpful warning to the user.
        * Implement few (just most common) options?
        * Detects unimplemented options, prints friendly message
        (e.g. "this is a real feature, but demo does not implement it. to learn more - visit URL")
    * File access?? Using emscripten's FileSystem module?
    * Has "more info" method:
       * Explaining what the program does (long/short description variants?)
       * Link to an official website?
       * Explain what each parameter does
* Create "OS" object/class, representing the state of each process:
    * has STDIN, STDOUT, STDERR streams
           * For each, provide "GetLine" and "PutLine" - Always line-buffered.
    * Has "FileSystem" object, based on emscripten's FileSystem class
    * Has few OS-related emulation functions:
        * getuid, geteuid, getgid,getegid ?
    * STDIN/STDOUT should maintain an open/close state? accommedate the following:

            $ seq 10 | echo $(head -n2) ==$(head -n1)==
            1 2 ====
            $ seq 10 | echo $(sed 1q) ==$(head -n1)==
            1 ====
            $ seq 10 | echo $(sed -u 1q) ==$(head -n1)==
            1 ==2==
    * SIGPIPE ?

* Shell Execution Environment
    * See Section [2.12 Shell Excution ENV](http://pubs.opengroup.org/onlinepubs/009695399/utilities/xcu_chap02.html#tag_02_12)
    * implement it
    * Pass it to sub-proceses ?
* Allows plugins/extension of programs
    * A collection of javascript "program emulators" - for external contributors


## Classes / Lessons

* Some easy JSON structure, easily extended by others
* Messages should support internationalization
* Safe Sandbox / Blinders
    * In each lesson, define list of "allowed" shell operators / programs.
    * Shell executer can detect "disallowed" operators, and give friendly message
    (e.g. in basic lessons, disallow redirection. If the user enters `seq 10 >foo.txt`,
    detect this, and instead of giving an error, or using pipes, tell the user:
    "pipes are useful shell feature, but they are not available in this lesson.
    This lesson can be completed without using pipes. To learn more about pipes,
    go to lesson XXXX").

## Shell / Interface

* Block-on-STDIN detection - When a user runs a command which would normally
block forever on STDIN (connected to a terminal), such as `cut -f1` instead of `cut -f1 <input.txt`,
stop and display a warning to the user.

* **Guided execution** - The shell executor (and every implemented program) have
a verbose mode, when it tells the user what's going on.
    * For each shell "simple-command", explain redirection.
    * For each shell "simple-command", explain what is executed, and what are the parameters.
    * For each piped command, show the user the STDIN and STDOUT of every step.
    * Optionally - wait for user ACK before contiuing to the next step.
    * Example: the user enters `seq 10 | wc -l >foo.txt` , **guided execution** will print:

        ```
        SHELL: executing command 'seq' with 1 parameter '10'
        SEQ:   printing numbers from 1 to 10 to STDOUT.
        SHELL: The output from 'seq' was:
                1
                2
                3
                ...
        SHELL: Using PIPE, passing OUTPUT from 'seq' to next program 'wc'.
        SHELL: Executing command 'wc' with 1 parameter '-l'
        WC:    Counting number of lines.
        WC:    Found 10 lines. Printing number "10".
        SHELL: The output from 'wc' wc:
               10
        SHELL: Using REDIRECTION, saving OUTPUT from 'wc' to file 'foo.txt'
        ```

    * Optionally: instead of textual output, use fancy HTML/CSS/D3 to visualize this process.
