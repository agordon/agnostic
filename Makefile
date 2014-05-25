NODEBIN ?= nodejs

all: info

.PHONY: info
info:
	@echo "The following targets are available:"
	@echo ""
	@echo "  make check    -     Run tests"
	@echo ""
	@echo "Shell Syntax Parsing Examples:"
	@echo "  make ex1 -     a simple command"
	@echo "  make ex2 -     a command with redirection"
	@echo "  make ex3 -     a command variable assignment and redirection"
	@echo "  make ex4 -     commands with pipes"
	@echo "  make ex5 -     commands with and,or"
	@echo ""


.PHONY: check
check: test_posix_shell_syntax

.PHONY: test_posix_shell_syntax
test_posix_shell_syntax:
	$(NODEBIN) ./tests/test_posix_shell_syntax.js

.PHONY: ex1 ex2 ex3 ex4
ex1:
	$(NODEBIN) ./tools/shell_parse.js "sort -k1n,1 -u input.txt" | jq .

ex2:
	$(NODEBIN) ./tools/shell_parse.js "grep -i FOO <input.txt >output.txt" | jq .

ex3:
	$(NODEBIN) ./tools/shell_parse.js "LC_ALL=C sort -k5nr,5 input.txt >output.txt" | jq .

ex4:
	$(NODEBIN) ./tools/shell_parse.js 'cut -f1-5 -d"|" foo.txt | grep -v ^bar | wc -l' | jq .

ex5:
	$(NODEBIN) ./tools/shell_parse.js 'grep -q FOO bar.txt && echo found || echo notfound' | jq .

