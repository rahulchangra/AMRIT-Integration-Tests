# AMRIT Integration Tests

This repository contains integration tests for the AMRIT application, built using Playwright. These tests ensure the core functionalities of the application, such as authentication and registration, are working as expected.

## Features

- **End-to-End Testing:** Comprehensive test coverage for critical user flows.
- **Playwright Framework:** Leverages Playwright for reliable and fast browser automation.
- **Headless and Headed Modes:** Supports running tests in both headless (default) and headed browser modes for debugging.
- **Authentication & Registration Tests:** Specific test suites for user login and registration processes.

## Installation

To set up the project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/rahulchangra/AMRIT-Integration-Tests
    cd AMRIT-Integration-Tests
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

## Usage

### Running Tests

To run all tests in headless mode (default):

```bash
npm test
```

To run tests in headed mode (browser UI visible):

```bash
npm run test:headed
```

### Running Specific Tests

You can run specific test files or suites by providing their path:

```bash
npx playwright test tests/aam/authentication/login.spec.js
```

## Project Structure

```
.env.example
├───tests/
│   └───aam/
│       └───authentication/
│           ├───login.spec.js
│           └───registration.spec.js
├───playwright.config.js
├───package.json
└───...
```

- `tests/`: Contains all the Playwright test files.
  - `aam/authentication/`: Houses tests related to authentication and registration.
- `playwright.config.js`: Playwright configuration file.
- `.env.example`: Example environment variables file. Copy this to `.env` and fill in your credentials.

## License

This project is licensed under the ISC License. See the `LICENSE` file for details (if present, otherwise it's implied by package.json).
