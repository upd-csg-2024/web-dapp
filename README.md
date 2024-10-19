# SecuriMed: Web Application

Welcome to the documentation for running the SecuriMed web application locally. This guide will walk you through the steps needed to get the application up and running on your machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Git
- Node.js (which includes npm)

## Installation

Follow these steps to install the application:

1. **Clone the repository** into your target directory

   ```bash
   git clone <repository-url> <target-directory>
   ```

   Replace `<repository-url>` with actual URL of the SecuriMed repository and `<target-directory>` with the path where you want to clone the repository.

2. **Navigate to the project directory**

   ```bash
   cd <target-directory>
   ```

3. **Install dependencies** using npm

   ```bash
   npm install
   ```

   This command installs all the necessary dependencies used to run the application.

## Running the Application

To run the application locally, use the following command:

```bash
npm run dev --open
```

This automatically opens the web application in your default browser once it's ready.

After running the application, it should automatically open in your default browser. If it doesn't or if you didn't use the `--open` flag, you can manually access the application by navigating to the URL provided in the terminal output, usually something like <http://localhost:5173>.
