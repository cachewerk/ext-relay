RELAY_TMPDIR := $(shell mktemp --directory)
RELAY_ARTIFACT := $(notdir $(RELAY_DOWNLOAD_URL))

$(PHP_PECL_EXTENSION): $(RELAY_ARTIFACT)
	echo "$(shell curl -fsL $(RELAY_DOWNLOAD_URL).sha256)  $(RELAY_TMPDIR)/$<" | shasum -a 256 --check
	@tar -xf $(RELAY_TMPDIR)/$< --strip-components=1 -C $(RELAY_TMPDIR)
	@LC_ALL=C $(SED) -iE "s/00000000-0000-0000-0000-000000000000/$(shell uuidgen)/" $(RELAY_TMPDIR)/$@.so
	@cp $(RELAY_TMPDIR)/$@.ini $(phplibdir)/../
	@cp $(RELAY_TMPDIR)/$@.so $(phplibdir)
	@rm -fr $(RELAY_TMPDIR)

$(RELAY_ARTIFACT):
	curl -fsL $(RELAY_DOWNLOAD_URL) -o $(RELAY_TMPDIR)/$@

ifdef RELAY_PRIORITY
install: install-ini
install-ini: $(phplibdir)/../$(PHP_PECL_EXTENSION).ini
	@cp $< $(shell $(PHP_CONFIG) --ini-dir)/$(RELAY_PRIORITY)-$(PHP_PECL_EXTENSION).ini
endif
