RELAY_WORKDIR := .libs/$(PHP_PECL_EXTENSION)
RELAY_ARTIFACT := $(RELAY_WORKDIR)/$(notdir $(RELAY_DOWNLOAD_URL))

$(PHP_PECL_EXTENSION): $(phplibdir)/$(PHP_PECL_EXTENSION).so

$(phplibdir)/$(PHP_PECL_EXTENSION).so: $(RELAY_WORKDIR)/$(PHP_PECL_EXTENSION).so
	$(INSTALL) $< $@

$(RELAY_WORKDIR)/$(PHP_PECL_EXTENSION).so: $(RELAY_ARTIFACT)
	echo "$(shell curl -fsL $(RELAY_DOWNLOAD_URL).sha256)  $<" | shasum -a 256 --check
	@tar -xf $< --strip-components=1 -C $(RELAY_WORKDIR)
	@LC_ALL=C $(SED) -iE "s/00000000-0000-0000-0000-000000000000/$(shell uuidgen)/" $@

$(RELAY_ARTIFACT):
	curl -fsL $(RELAY_DOWNLOAD_URL) --create-dirs -o $@

ifdef RELAY_PRIORITY
RELAY_INI := $(shell $(PHP_CONFIG) --ini-dir)/$(RELAY_PRIORITY)-$(PHP_PECL_EXTENSION).ini
install: install-ini
install-ini: $(RELAY_WORKDIR)/$(PHP_PECL_EXTENSION).ini
	$(INSTALL) $< $(RELAY_INI)
endif
