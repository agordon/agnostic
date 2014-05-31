/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* ProgramDate Class Tester
(not really a test, just ensures it runs)
 */

var assert = require('assert');
require('utils/object_utils');
require('utils/time_utils');
var OperatingSystem = require('os/os_state');
var FileSystem = require('os/filesystem');
var Streams = require('os/streams');
var ProcessState = require('os/process_state');
var ProgramBase = require('programs/program_base');
var ProgramDate = require('programs/date');

var os = new OperatingSystem.OperatingSystem();
var fs = new FileSystem.FileSystem();
var ps = new ProcessState.ProcessState(os,fs);
ps.stdin = new Streams.InputStream();
ps.stdout = new Streams.OutputStream();
ps.stderr = new Streams.OutputStream();

var d = new ProgramDate.ProgramDate();
var exit_code = d.run(ps,["/bin/date"]);
assert.strictEqual(exit_code,0);
var time = ps.stdout.__shift_line();
console.log("ProgramDate reported: " + time);
