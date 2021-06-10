BINDIR ?= /usr/local/bin
DOCDIR ?= /usr/local/share/doc/cryptochat
LIBDIR ?= /var/lib/cryptochat

all:
	@echo Run \'make install'\ to install cryptochat, and \'make uninstall'\ to uninstall.

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
