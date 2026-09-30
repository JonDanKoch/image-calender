# AGENTS.md

## Project Overview

This is a modern web application built with:

* JavaScript (ES202x)
* React
* Vite
* Firebase
* CSS / CSS Modules / project-specific styling

The application should remain simple, maintainable, and modular. Prefer existing project conventions over introducing new patterns.


## Project Structure

Follow the existing repository structure. A typical structure may look like:

```text
src/
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
├── firebase/
├── utils/
├── assets/
├── styles/
├── App.jsx
└── main.jsx

public/
.env
.env.example
vite.config.js
package.json
```

Do not create new top-level directories unless they are justified by the project architecture.

### Responsibilities

* `components/`

  * Reusable UI components.
  * Components should generally be focused and composable.

* `pages/`

  * Route-level components.
  * Page components may compose multiple reusable components.

* `layouts/`

  * Shared page layouts and structural UI.

* `hooks/`

  * Reusable React hooks.
  * Hooks should not contain unrelated UI concerns.

* `services/`

  * External service/API logic.
  * Keep Firebase and other backend interactions out of presentational components when practical.

* `firebase/`

  * Firebase initialization and Firebase-specific configuration/helpers.

* `utils/`

  * Small, reusable, framework-independent helper functions.

---

## JavaScript

Use modern JavaScript.

Prefer:

```js
const user = users.find((user) => user.id === id);
```

over:

```js
var user = null;

for (var i = 0; i < users.length; i++) {
  if (users[i].id === id) {
    user = users[i];
    break;
  }
}
```

### Rules

* Prefer `const`.
* Use `let` only when reassignment is required.
* Do not use `var`.
* Prefer `async/await` over promise chains when it improves readability.
* Use optional chaining (`?.`) and nullish coalescing (`??`) where appropriate.
* Avoid deeply nested conditionals.
* Keep functions small and focused.
* Avoid unnecessary mutation.
* Do not introduce TypeScript unless the project is explicitly being migrated to TypeScript.

### Error handling

Handle expected failures explicitly.

```js
try {
  const result = await loadData();
  return result;
} catch (error) {
  console.error("Failed to load data:", error);
  throw error;
}
```

Do not silently swallow errors:

```js
try {
  await loadData();
} catch {
  // Do nothing
}
```

unless intentionally justified.

---

## React

Use functional components and React hooks.

Prefer:

```jsx
function UserCard({ user }) {
  return (
    <article>
      <h2>{user.name}</h2>
    </article>
  );
}
```

Avoid class components unless an existing project requirement requires them.

### Components

Components should:

* Have one clear responsibility.
* Prefer props over hidden global dependencies.
* Avoid unnecessary local state.
* Avoid excessive prop drilling by restructuring components before introducing global state.

### State

Use the simplest appropriate state mechanism:

1. Local `useState`
2. Derived values
3. `useReducer` for genuinely complex local state
4. Existing application state solution
5. Context when the state is genuinely shared

Do not introduce Redux, Zustand, Jotai, or another state library unless the project already uses it or the task explicitly requires it.

### Effects

Use `useEffect` only for synchronization with external systems.

Do not use effects merely to calculate derived values.

Prefer:

```js
const fullName = `${firstName} ${lastName}`;
```

over:

```js
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

Always review effect dependencies carefully.

---

### Security

Never put actual secrets in:

* Source code
* Git
* `.env` files that are committed
* React components
* Firebase configuration committed to a public repository when it contains actual secrets

Important: Firebase web configuration values such as the Firebase API key are generally not treated as secret credentials. Security must instead be enforced through Firebase Authentication, Firestore/Storage Security Rules, App Check where appropriate, and backend authorization.

Never expose:

* Service account private keys
* Firebase Admin credentials
* Private API keys
* Database credentials
* Server-side secrets

Client-side code must never import or use Firebase Admin SDK credentials.

---

## Firebase

Use the Firebase client SDK in React/Vite code.

Keep Firebase initialization centralized.

Example structure:

```text
src/
└── firebase/
    ├── config.js
    ├── auth.js
    ├── firestore.js
    └── storage.js
```

Avoid initializing Firebase separately in multiple components.