/*
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

/*
This module creates a JQuery-Terminal (https://github.com/jcubic/jquery.terminal)
and initializes an Agnostic Interactive Shell in it.

NOTES:
It is assumed that "jquery.terminal-min.js" and "agnostic.js" are already loaded.
*/

function CreateShellJQueryTerminal(html_id)
{
    var shell_prompt = "$ ";

    var shell = agnostic.createInteractiveShell();

    $(html_id).terminal(function(command,term) {
            if (command === '')
              return;

            var shell_command = agnostic.str_utils.trimWhitespace(command);

            //Execute the command
            var res = shell.execute(shell_command);
            if ("stderr" in res) {
              term.error(res.stderr.join("\n"));
            }
            if ("stdout" in res) {
              term.echo(res.stdout.join("\n"));
            }
          },
          {
            greetings: 'Welcome to Agnostic Unix Shell',
            name: 'agnostic_shell',
            height: 400,
            width: '%100',
            history: true,
            prompt: '$ '
          }
      );
}
