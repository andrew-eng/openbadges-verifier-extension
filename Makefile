all: firefox chrome

firefox:
	mkdir -p build; \
	cd src/; \
	zip -FSr ../build/openbadges-verifier.xpi ./chrome.manifest ./install.rdf ./common/ ./firefox/ ./defaults/ -x ./common/test/\*;

chrome:
	mkdir -p build; \
	cd src/; \
	zip -FSr ../build/openbadges-verifier.zip ./manifest.json ./_locales ./common ./chrome -x ./common/test/\*; \

clean:
	@rm -fr build

lint:
	@jshint js/displayer.js js/verifier.js js/background.js js/content.js
