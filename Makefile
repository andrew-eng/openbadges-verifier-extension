all: firefox chrome

firefox:
	mkdir -p build; \
	cd src/; \
	zip -FSr ../build/openbadges-verifier.xpi ./chrome.manifest ./install.rdf ./common/ ./firefox/ -x ./common/test/\*;

chrome:
	mkdir -p build; \
	cd src/; \
	zip -FSr ../build/openbadges-verifier.zip ./manifest.json ./_locales ./common ./chrome -x ./common/test/\*; \

clean:
	@rm -fr build

lint:
	@jshint src/common/js/displayer.js src/common/js/verifier.js
