BINDIR ?= /usr/local/bin
DOCDIR ?= /usr/local/share/doc/cryptochat
LIBDIR ?= /var/lib/cryptochat

all:
	@echo Run \'make install\' to install cryptochat.

install:
	@mkdir -p $(BINDIR)
	@mkdir -p $(DOCDIR)
	@mkdir -p $(LIBDIR)
	@cp -pR node_modules $(LIBDIR)/node_modules
	@cp -p package.json $(LIBDIR)/package.json
	@cp -p cli.js $(LIBDIR)/cli.js
	@cp -p .env $(LIBDIR)/.env
	@cp -p cryptochat $(BINDIR)/cryptochat
	@cp -p README.md $(DOCDIR)
	@chmod 755 $(BINDIR)/cryptochat

uninstall:
	@rm -f $(BINDIR)/cryptochat
	@rm -rf $(LIBDIR)
	@rm -rf $(DOCDIR)
