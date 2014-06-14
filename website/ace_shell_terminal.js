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
This module creates an ACE (http://ace.c9.io) Editor object,
and initializes an Agnostic Interactive Shell in it.

NOTES:
1. It is assumed that "ace.js" and "agnostic.js" are already loaded.
*/

function CreateAceShellTerminal(html_id)
{
    var shell_prompt = "$ ";

    var shell = agnostic.createInteractiveShell();

    var editor = ace.edit(html_id);


    function ExecuteShellCommand(cmd)
    {
		var res = shell.execute(cmd);
		var doc = editor.getSession().getDocument();
		if ("stderr" in res) {
            var maxline = doc.getLength();
			doc.insertLines(maxline,res.stderr);
		}
		if ("stdout" in res) {
            var maxline = doc.getLength();
			doc.insertLines(maxline,res.stdout);
		}
    }




    editor.setTheme("ace/theme/github");
    editor.getSession().setUseWrapMode(false);
    editor.setHighlightActiveLine(false);
    editor.setShowPrintMargin(false);
    editor.setShowFoldWidgets(false);
    editor.setShowInvisibles(false);
    editor.renderer.setShowGutter(false);
    editor.setFontSize(18);

    // This trick limits the Ace Editor's cursor to the last line
    // of text, effectively emulating a terminal window.
    editor.selection.on("changeCursor",function() {
        var pos = editor.getCursorPosition();
        var maxline = editor.getSession().getDocument().getLength();

	//If the cursor is not on the last line - move it there
	//(might have been moved by a mouse click)
	//If the cursor is on the last line, ensure it is AFTER
	//the shell prompt.
        if ( (pos.row != maxline-1)
             ||
             (pos.column < shell_prompt.length)) {
          editor.gotoLine(maxline,shell_prompt.length,false);
          return;
        }
    });

    // Bind keys as similar as possible to the Shell's EMACS-compatible
    // short-cut keys.
    // NOTE:
    //   Loading Ace's built-in EMACS key-bindings is wasteful, as it
    //   adds to many editor-related short-cuts, which aren't needed in the shell.
    editor.commands.bindKeys({
      "shift-Return": function() { },

      "ctrl-A": function(cmdLine) { editor.navigateLineStart(); },
      "ctrl-E": function(cmdLine) { editor.navigateLineEnd(); },
      "alt-F":  function(cmdLine) { editor.navigateWordRight(); },
      "alt-B":  function(cmdLine) { editor.navigateWordLeft(); },

      "Return": function(cmdLine){
            var doc = editor.getSession().getDocument();
            var maxline = doc.getLength();
            var shell_command = doc.getLine(maxline-1);

            //Remove shell Prompt
            shell_command = shell_command.substr(shell_prompt.length);
            console.log("return: ", shell_command);

            //Execute the command
			ExecuteShellCommand(shell_command);

            //Add a new line prompt
            maxline = doc.getLength();
            doc.insertLines(maxline,[ shell_prompt ]);
          },
      "Up": function(cmdLine){
            console.log("Up");
          },

      "Down": function(cmdLine){
            console.log("Down");
          }
      });


/*
"selectleft",
"gotostart", "selectup", "golineup", "selecttoend",
"gotoend", "selectdown", "golinedown", "selectwordleft",
"gotowordleft", "selecttolinestart", "gotolinestart", "selectwordright", "gotowordright", "selecttolineend", "gotolineend", "selectright",
"gotoright", "selectpagedown", "pagedown", "gotopagedown", "selectpageup", "pageup",
"gotopageup", "scrollup", "scrolldown", "selectlinestart", "selectlineend", "togglerecording",
"backspace", "cut_or_delete",
"inserttext", "del",

"overwrite","insertstring",
*/

    //Disable many of ACE's default commands - these are text editing commands
    //which aren't relevent to the Shell's terminal.
    editor.commands.removeCommands([
		"showSettingsMenu", "goToNextError", "goToPreviousError",
		"selectall", "centerselection", "gotoline", "fold", "unfold",
		"toggleFoldWidget", "toggleParentFoldWidget", "foldall", "foldOther",
		"unfoldall", "findnext", "findprevious", "selectOrFindNext",
		"selectOrFindPrevious",	"find",  "selecttostart",
		"replaymacro", "jumptomatching", "selecttomatching", "cut",
		"removeline", "duplicateSelection", "sortlines",
		"togglecomment", "toggleBlockComment", "modifyNumberUp",
		"modifyNumberDown", "replace", "undo", "redo",
		"copylinesup", "movelinesup", "copylinesdown", "movelinesdown",
		"removetolinestart", "removetolineend", "removewordleft",
		"removewordright", "outdent", "indent", "blockoutdent",
		"blockindent", "splitline", "transposeletters", "touppercase",
		"tolowercase"]);


    return editor;
}

