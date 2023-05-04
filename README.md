# Forkd: A Recipe Journal and Version Control System

An app where users can save, record 'experiments', and track edits for recipes.

This is the frontend repo corresponding to the backend [here](https://github.com/bianxm/forkd-backend).

## Technologies Used
- Vite
- React, React Router
- Tailwind, Headless UI for styling
- JSDiff, Diff2html for edit diff-ing

## Roadmap
### MVP
- [x] Public User
  - [x] View user profiles
  - [x] View public recipes
  - [x] Sign up, log in
- [x] Authenticated User
  - [x] Add and delete recipes, edits, and experiments
  - [x] Set global permissions for a recipe
  - [x] Grant, edit, revoke permissions to specific users
  - [x] Update user details -- avatar, username, password, email
    - [x] Upload user avatar via Cloudinary 
  - [x] Log out
### 2.0
- Upload images for recipes via Cloudinary
- Experiment-only collaborators can submit edits for owner approval
- Saving experiment drafts
- Email support (confirm email, password reset)
- Real-time diff highlighting with [Mergely](https://www.mergely.com/)