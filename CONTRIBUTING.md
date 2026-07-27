# Contributing to Furnix.

First off, thank you for considering contributing to **Furnix**!
Your help makes this project better for everyone.

## How Can You Contribute?

### 🐛 Reporting Bugs

- Check the [issues](../../issues) to see if the bug has already been reported.
- Open a new issue with:
  - A clear description of the bug
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots/logs will be helpful

### 💡 Suggesting Features

- Open an issue and label it as a **feature request**.
- Clearly explain the problem the feature solves.
- Suggest a possible implementation (if you have one).

### Project Setup Guide

1. **Fork the repository**

2. **Create a branch**
   Use standard naming conventions to identify your branch:
   - For bug fixes or specific issues: `issue/issue-id-short-description` (e.g., `issue/256-update-contributing`)
   - For new features: `feature/feature-name` (e.g., `feature/user-dashboard`)

   ```bash
   git checkout -b issue/issue-id-short-description
   ```

3. **Make your changes using the Isolated Submissions Workflow**
   To preserve the stability of the main production branch and minimize merge conflicts, **do not edit core/root files directly** (such as `index.html`, `style.css`, etc.) in your initial contribution.
   
   Instead, use the following **Submissions Workflow**:
   - Create isolated demonstration/test files inside the `submissions/` directory (e.g., `submissions/issue-xxx-demo.html`, `submissions/issue-xxx-style.css`).
   - Duplicate or reference existing page logic/styling inside your isolated files to showcase your fix or feature in a sandbox environment.
   - Commit and push only these isolated files (or clean updates to existing files in the `submissions/` directory).

4. **Commit your changes**
   ```bash
   git commit -m "Add fix/feature: description"
   ```
5. **Push to your fork**
   ```bash
   git push origin issue/issue-id-short-description
   ```
6. **Open a Pull Request**
   - Describe what you changed and why.
   - Reference any related issues.
   
### Submissions Workflow Review & Integration

Once a pull request containing your isolated submissions files is opened:
1. **Maintainer Review**: The project maintainer will review, run, and test your changes within the isolated sandbox files inside the `submissions/` folder.
2. **Integration**: After approval, the maintainer will merge the PR and integrate/apply the sandbox changes to the core main codebase files (`index.html`, `style.css`, etc.).
3. **Cleanup**: The temporary submission files will then be removed or kept as test cases as appropriate.

### Code Style

- Use clear and consistent naming conventions.
- Keep functions small and focused.
- Write comments where needed.

### ✅ Pull Request Checklist

- I updated relevant documentation (if needed)
- I linked the PR to any relevant issues

### Legal / License

By contributing to this repository, you agree that your contributions will be licensed under the terms of the [MIT License](LICENSE).

All contributions should be original work or properly credited if derived from other sources.
