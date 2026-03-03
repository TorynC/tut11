DIRNAME := $(notdir $(CURDIR))
ZIPFILE := t6-$(DIRNAME).zip

.PHONY: install clean migrate seed zip
install:
	npm install

migrate:
	npx prisma migrate dev --name init
	npx prisma generate

seed:
	node database/seed.js

clean:
	rm -rf node_modules package-lock.json dev.db prisma/migrations .env

zip: clean
	rm -rf ../$(ZIPFILE)
	zip -r ../$(ZIPFILE) .