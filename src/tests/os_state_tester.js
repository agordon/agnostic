/****************************************
 * This file is part of UNIX Guide for the Perplexed project.
 * Copyright (C) 2014 by Assaf Gordon <assafgordon@gmail.com>
 * Released under GPLv3 or later.
 ****************************************/

/* OS encapsulation Tester
 *
 */

var count_pass = 0 ;
var count_fail = 0 ;

require('utils/object_utils');
require('os/os_state');

console.log("OS time = " + OperatingSystemState.time() );

var uname = OperatingSystemState.uname();
var kernel_version = uname["sysname"] + " " + uname["version"] ;
console.log("OS uname kernel+version = " + kernel_version);
