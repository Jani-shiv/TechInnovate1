.PHONY: install dev build docker-build clean test

install:
	npm install
	cd client && npm install

dev:
	# Run backend and frontend concurrently (requires npm-run-all or similar, or just separate terminals)
	# For now, just backend as frontend should be run separately for dev
	npm run dev

build:
	cd client && npm run build
	# Copy to public is done manually or via script, usually not needed if serving client/dist directly
	# But preserving current behavior:
	rm -rf public/*
	cp -r client/dist/* public/

docker-build:
	docker-compose build

clean:
	rm -rf node_modules
	rm -rf client/node_modules
	rm -rf client/dist
	rm -rf public/*

test:
	npm test
