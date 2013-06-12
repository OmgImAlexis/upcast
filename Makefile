
# Group targets
all: deps lint test

# Install dependencies
deps:
	@echo "Installing dependencies..."
	@npm install

# Lint JavaScript
lint:
	@echo "Linting JavaScript..."
	@./node_modules/.bin/jshint \
		--config ./test/config/jshint.json \
		./lib ./test/unit

# Run all tests
test: test-unit

# Run unit tests
test-unit:
	@echo "Running unit tests..."
	@./node_modules/.bin/mocha \
		--reporter spec \
		--colors \
		--recursive \
		./test/unit

# Run the Node Test app for browser testing
test-server:
	@echo "Running test server..."
	@./node_modules/.bin/mocha-srv ./test/unit
