BINDIR ?= /usr/local/bin
DOCDIR ?= /usr/local/share/doc/cryptochat
LIBDIR ?= /var/lib/cryptochat

all:
	@echo run \'make install\' to install and \'make uninstall\' to uninstall.

install:
	@mkdir -p $(BINDIR)
	@mkdir -p $(DOCDIR)
	@mkdir -p $(LIBDIR)
	@cp -R node_modules $(LIBDIR)/node_modules
	@cp package.json $(LIBDIR)/package.json
	@cp cli.js $(LIBDIR)/cli.js
	@cp eff.js $(LIBDIR)/eff.js
	@cp .env $(LIBDIR)/.env
	@cp cryptochat $(BINDIR)/cryptochat
	@cp README.md $(DOCDIR)
	@chmod 755 $(BINDIR)/cryptochat
	@chown root:root -R $(LIBDIR)
	@chmod 755 -R $(LIBDIR)
	@chown root:root $(DOCDIR)
	@chmod 755 $(DOCDIR)
	@echo Installed!

uninstall:
	@rm -f $(BINDIR)/cryptochat
	@rm -rf $(LIBDIR)
	@rm -rf $(DOCDIR)
	@echo Uninstalled!
