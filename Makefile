start:
	npm run start

dev:
	npm run dev

watch:
	npm run test -- --watch

test:
	npm run test

docs:
	rm -rf docs
	npm run docs

.PHONY: test