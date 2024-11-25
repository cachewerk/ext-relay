RELAY_TMPDIR := $(shell mktemp --directory)
RELAY_ARTIFACT := $(notdir $(RELAY_DOWNLOAD_URL))

$(PHP_PECL_EXTENSION).$(SHLIB_SUFFIX_NAME): $(RELAY_ARTIFACT)
	echo "$(shell curl -fsL $(RELAY_DOWNLOAD_URL).sha256) $(RELAY_TMPDIR)/$<" | sha256sum --check
	@tar -xf $(RELAY_TMPDIR)/$< --strip-components=1 -C $(RELAY_TMPDIR)
	@$(SED) -i "s/00000000-0000-0000-0000-000000000000/$(shell cat /proc/sys/kernel/random/uuid)/" $(RELAY_TMPDIR)/$@
	@cp $(RELAY_TMPDIR)/$@ $(phplibdir)
	#@cp $(RELAY_TMPDIR)/$(PHP_PECL_EXTENSION).ini $(shell $(PHP_CONFIG) --ini-dir)
	@rm -fr $(RELAY_TMPDIR)

$(RELAY_ARTIFACT):
	curl -fsL $(RELAY_DOWNLOAD_URL) -o $(RELAY_TMPDIR)/$@

