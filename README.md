# Forkd: Recipe Journal and Version Control


<figure>
<img src=".github/images/demo.gif" width="500" />
<a href="https://www.youtube.com/watch?v=ZVaxeGYfDWc">
<figcaption>Demo video on Youtube</figcaption>
</a>

<a href="http://3.14.77.97">Live Demo Site</a>
</figure>

An app where users can save, record 'experiments', and track edits for recipes.

This is the frontend repo corresponding to the backend [here](https://github.com/bianxm/forkd-backend).

## Features
- Save recipes, which can be inputted by the user, or extracted from a webpage
- Log 'experiments' to recipes
- Track edits to recipes and display them in a Github-like visual style
- Delete recipes, experiments, and edits
- Control global and per-user permissions to recipes
- Edit user settings such as username, email, password, and avatar

## Technologies Used
- Vite
- React, React Router
- TailwindCSS, Headless UI for styling
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
- [ ] Upload images for recipes via Cloudinary
- [ ] Experiment-only collaborators can submit edits for owner approval
- [ ] Saving experiment drafts
- [ ] Email support (confirm email, password reset)
- [ ] Real-time diff highlighting with [Mergely](https://www.mergely.com/)

## Install locally
1. Clone this repo
2. Install all dependencies with ```npm install```. This will include Vite. 
3. Run the Vite dev server with ```npm run dev```. The Vite dev server has proxy rules set up to forward /api requests to the backend, so ensure that the [corresponding backend](https://github.com/bianxm/forkd-frontend) is running on localhost:5000

## Sources
- This is my capstone project for [Hackbright Academy](https://hackbrightacademy.com/), which taught us Python, Flask, Javascript, and React from the ground up in a whirlwind five weeks. 
- I relied heavily on Miguel Grinberg's [React Mega-Tutorial](https://blog.miguelgrinberg.com/post/introducing-the-react-mega-tutorial), especially for the flash message and user authentication functionality.
- I learned React Router from The Net Ninja's [React Router in Depth video series](https://www.youtube.com/watch?v=OMQ2QARHPo0).