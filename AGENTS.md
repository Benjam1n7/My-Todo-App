# AGENTS.md

## Project

This is a simple Todo List web application built with React and TypeScript.

The application allows users to:

* Add todos
* Edit todos
* Complete/uncomplete todos
* Delete todos
* Filter todos by All, Active, and Completed
* Persist todos using localStorage

## Development Principles

* Keep the application simple and maintainable.
* Do not introduce unnecessary features.
* Do not rewrite working code without a clear reason.
* Prefer small, focused changes.
* Reuse existing components and utilities where appropriate.
* Keep dependencies minimal.
* Do not add authentication, a backend, a database, payments, or unnecessary AI functionality unless explicitly requested.

## UI/UX Guidelines

* Maintain the existing visual design.
* Keep the interface clean, minimal, responsive, and accessible.
* Do not introduce excessive animations, gradients, shadows, or decorative elements.
* Preserve consistent spacing, typography, buttons, inputs, and interaction patterns.
* Any new UI should feel like part of the existing product.

## Code Guidelines

* Use TypeScript.
* Use clear and descriptive names.
* Keep components focused on a single responsibility.
* Avoid unnecessary abstraction.
* Handle user input safely.
* Do not leave unused imports, variables, or dead code.
* Do not expose secrets or API keys in source code.

## Before Making Changes

Before modifying the project:

1. Understand the existing implementation.
2. Identify the files that actually need to change.
3. Avoid modifying unrelated files.
4. Consider whether the requested change can be made with the smallest possible change.

## Testing

After making a change:

1. Check for TypeScript or build errors.
2. Test the affected functionality.
3. Make sure existing functionality still works.
4. Check the responsive layout when UI changes are made.
5. Do not consider a task complete if the application is broken.

## Change Management

When a request is ambiguous:

* Make the smallest reasonable assumption.
* Do not add features that were not requested.
* Ask for clarification when the ambiguity could significantly change the implementation.

When fixing a bug:

* Identify the cause before changing the code.
* Fix the underlying problem rather than hiding the symptom.
* Avoid unrelated refactoring.

## Completion Checklist

Before considering a task complete:

* The requested feature works.
* Existing functionality still works.
* There are no obvious errors.
* The implementation follows these instructions.
* No unnecessary files or dependencies were added.
