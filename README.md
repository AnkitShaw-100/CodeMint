# CodeMint

CodeMint is a modern web application for generating secure JWT secrets and strong passwords. All generation happens in the browser using cryptographically secure randomness.

## Features

* JWT secret generator with customizable length (32–512 characters)
* Password generator with configurable rules
* Password strength indicator
* Dark and light mode
* Responsive interface
* One-click copy to clipboard
* Secure generation using `crypto.getRandomValues()`

## Tech Stack

**Frontend**

* React
* Vite
* Tailwind CSS
* Shadcn UI

**Libraries**

* React Router DOM
* Sonner (notifications)
* Lucide Icons

## Installation

```bash
git clone https://github.com/yourusername/codemint.git
cd codemint
npm install
npm run dev
```

Open in your browser:

```
http://localhost:5173
```

## Usage

1. Select the JWT secret generator or password generator.
2. Adjust the desired settings.
3. Generate and copy the result for your application.

All secrets and passwords are generated locally in the browser. No data is stored or sent to any server.
