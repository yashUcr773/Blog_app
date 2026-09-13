You are performing a complete modernization and maintenance audit of an old software repository.

This repository is an old test, hobby, experimental, or personal project that has not been actively opened or maintained for a long time.

Your goal is to determine:
1. Whether the project still works.
2. What is broken or outdated.
3. What can be safely improved.
4. What should be removed.
5. What should be modernized.
6. Whether the project is secure, maintainable, performant, and production-quality.
7. Whether the project is still worth keeping.

IMPORTANT:
- Do NOT blindly rewrite the project.
- First understand the existing architecture and intent.
- Preserve the original functionality unless there is a clear reason to change it.
- Prefer small, incremental, well-justified improvements.
- Do not introduce unnecessary dependencies.
- Do not upgrade everything just because newer versions exist.
- Before making changes, create an audit/findings summary.
- After changes, verify that the project still works.
- If something cannot be verified, explicitly state that.

==================================================
PHASE 1 — UNDERSTAND THE PROJECT
==================================================

First inspect the entire repository.

Determine:

- What the project does
- Original purpose/use case
- Main features
- Application type
  - frontend
  - backend
  - full-stack
  - CLI
  - library
  - script
  - experiment
  - infrastructure
  - other
- Main technologies/frameworks
- Runtime/language versions
- Package manager
- Build system
- Database
- External services/APIs
- Authentication/authorization
- Deployment strategy
- Testing strategy
- CI/CD
- Environment/configuration requirements
- Repository structure
- Entry points
- Important architectural decisions

Read:
- README
- package manifests
- lock files
- configuration files
- environment examples
- Docker files
- CI/CD configuration
- source code
- tests
- scripts
- database migrations
- infrastructure files

Do not assume the README is correct.

Compare documentation against the actual implementation.

==================================================
PHASE 2 — DETERMINE CURRENT HEALTH
==================================================

Attempt to run the project.

Identify:

- Does dependency installation work?
- Does the project build?
- Does it start?
- Does the application run?
- Do tests run?
- Do lint/type checks run?
- Do database migrations work?
- Do development scripts work?
- Do production builds work?

Record every failure.

Distinguish between:

- Environment/setup problems
- Dependency problems
- Deprecated APIs
- Actual application bugs
- Missing services
- Missing environment variables
- Broken tests
- Incorrect documentation

Do not "fix" failures before understanding their cause.

==================================================
PHASE 3 — DEPENDENCY AUDIT
==================================================

Inspect all dependencies.

Check for:

- Outdated dependencies
- Deprecated packages
- Abandoned packages
- Unmaintained libraries
- Duplicate libraries solving the same problem
- Unnecessary dependencies
- Unused dependencies
- Incorrect dependency classification
- Security vulnerabilities
- Deprecated framework APIs
- Deprecated Node/browser APIs

For every significant dependency upgrade, determine:

- Current version
- Recommended version
- Breaking changes
- Compatibility concerns
- Whether the upgrade is actually worthwhile

Avoid unnecessary major-version upgrades if they provide little value.

Remove clearly unused dependencies where safe.

==================================================
PHASE 4 — CODE QUALITY AUDIT
==================================================

Review the codebase for:

- Dead code
- Unused files
- Unused functions
- Unused variables
- Duplicate code
- Copy/paste implementations
- Overly complex functions
- Large components/modules
- Poor separation of concerns
- Tight coupling
- Incorrect abstractions
- Premature abstractions
- Inconsistent naming
- Inconsistent coding patterns
- Magic numbers
- Magic strings
- Hardcoded configuration
- Poor error handling
- Swallowed errors
- Incorrect async handling
- Race conditions
- Promise issues
- Resource leaks
- Memory leaks
- Incorrect state management
- Unnecessary re-renders
- Poor data flow
- Difficult-to-test code
- Poor module boundaries

Look for places where the original implementation was probably written quickly as a hobby/test project and improve them only when the improvement provides meaningful value.

==================================================
PHASE 5 — BUG AUDIT
==================================================

Look for functional bugs including:

- Null/undefined handling
- Empty states
- Invalid inputs
- Boundary conditions
- Incorrect assumptions
- Race conditions
- Concurrency issues
- State synchronization issues
- Error states
- Retry behavior
- Timeout handling
- Partial failures
- Incorrect caching
- Stale data
- Incorrect pagination
- Incorrect sorting/filtering
- Date/time bugs
- Timezone bugs
- Number/precision issues
- File handling issues
- Network failures
- Browser compatibility issues

Pay special attention to bugs that would only appear after long periods of inactivity or under unusual conditions.

==================================================
PHASE 6 — SECURITY AUDIT
==================================================

Perform a security review.

Check for:

- Hardcoded secrets
- API keys
- Passwords
- Tokens
- Private keys
- Sensitive data committed to git
- Dangerous environment variables
- Authentication bypasses
- Authorization issues
- IDOR
- Broken access control
- XSS
- CSRF
- SSRF
- SQL injection
- NoSQL injection
- Command injection
- Path traversal
- Prototype pollution
- Unsafe deserialization
- Insecure file uploads
- Open redirects
- CORS problems
- Cookie security
- Session security
- JWT problems
- Weak password handling
- Missing rate limiting
- Sensitive information leakage
- Excessive permissions
- Unsafe dependencies
- Dependency vulnerabilities
- Debug endpoints
- Development-only functionality exposed in production

Check both application code and infrastructure/configuration.

Do not expose or reproduce real secrets if found.

If secrets are discovered:
- identify their location
- recommend rotation
- remove them from source where appropriate
- update examples/documentation safely
- do NOT assume deleting them from the latest commit removes them from git history

==================================================
PHASE 7 — FRONTEND AUDIT
==================================================

If this is a frontend application, inspect:

### UI
- Broken layouts
- Missing loading states
- Missing empty states
- Missing error states
- Inconsistent spacing
- Inconsistent typography
- Poor visual hierarchy
- Accessibility problems
- Keyboard navigation
- Focus states
- Mobile responsiveness
- Tablet responsiveness
- Desktop responsiveness
- Overflow problems
- Broken interactions
- Poor forms
- Poor validation
- Unclear error messages
- Missing confirmation for destructive actions

### UX
Check whether the application feels like an old prototype.

Improve:
- navigation
- onboarding
- feedback
- loading behavior
- error handling
- empty states
- form usability
- responsive behavior
- accessibility
- consistency

Do not redesign the entire application unless necessary.

==================================================
PHASE 8 — BACKEND/API AUDIT
==================================================

If there is a backend/API, inspect:

- API design
- HTTP semantics
- Status codes
- Validation
- Error responses
- Authentication
- Authorization
- Rate limiting
- Timeouts
- Retries
- Idempotency
- Pagination
- Filtering
- Sorting
- Logging
- Observability
- Input validation
- Output validation
- API versioning
- Database access
- Connection management
- Transaction handling
- Concurrency
- Background jobs
- Queue handling

Check for APIs that accidentally expose internal implementation details.

==================================================
PHASE 9 — DATABASE AUDIT
==================================================

If a database exists, inspect:

- Schema
- Relationships
- Indexes
- Constraints
- Foreign keys
- Unique constraints
- Nullability
- Data types
- Migrations
- Seed scripts
- Query efficiency
- N+1 queries
- Transactions
- Connection handling
- Data validation
- Cascading deletes
- Soft deletes
- Pagination

Identify obvious performance problems.

Do not make destructive schema/data changes without clearly explaining them.

==================================================
PHASE 10 — PERFORMANCE AUDIT
==================================================

Look for:

Frontend:
- Large bundles
- Unnecessary dependencies
- Excessive JavaScript
- Unnecessary renders
- Large images
- Missing lazy loading
- Blocking resources
- Poor caching
- Inefficient data fetching

Backend:
- Slow queries
- N+1 queries
- Excessive network calls
- Missing caching
- Inefficient algorithms
- Memory-heavy operations
- Blocking operations
- Poor concurrency

Only optimize where there is a reasonable bottleneck or clear improvement.

==================================================
PHASE 11 — TESTING AUDIT
==================================================

Inspect existing tests.

Determine:

- What is tested?
- What is not tested?
- Are tests still valid?
- Are tests flaky?
- Are tests testing implementation details?
- Are important business rules untested?
- Are edge cases missing?
- Are integration tests missing?
- Are critical API paths untested?
- Are UI flows untested?

Improve the test suite where valuable.

Prioritize:

1. Core business logic
2. Critical user flows
3. API behavior
4. Security-sensitive behavior
5. Important edge cases
6. Regression tests for bugs discovered during this audit

Do not add meaningless tests just to increase coverage.

==================================================
PHASE 12 — DEV EXPERIENCE
==================================================

Evaluate how easy it is for a developer to clone and run this repository today.

Check:

- README accuracy
- Setup instructions
- Required runtime version
- Package manager
- Environment setup
- .env.example
- Database setup
- Seed data
- Development scripts
- Build scripts
- Test scripts
- Lint scripts
- Formatting
- Type checking
- Git hooks
- Docker setup
- CI setup

The goal should be:

clone → install → configure → run → test

with minimal confusion.

Fix documentation that no longer matches reality.

==================================================
PHASE 13 — INFRASTRUCTURE / DEPLOYMENT
==================================================

If applicable, inspect:

- Dockerfile
- Docker Compose
- Kubernetes
- Terraform
- AWS/GCP/Azure configuration
- Vercel/Netlify/etc.
- CI/CD
- Environment configuration
- Secrets handling
- Health checks
- Graceful shutdown
- Logging
- Monitoring
- Resource limits
- Production configuration

Check for obsolete infrastructure assumptions.

==================================================
PHASE 14 — GIT / REPOSITORY HYGIENE
==================================================

Inspect repository hygiene.

Check:

- .gitignore
- tracked build artifacts
- node_modules
- generated files
- local databases
- logs
- temporary files
- IDE files
- OS-specific files
- secrets
- stale branches if visible
- huge files
- accidental binaries
- outdated documentation
- meaningless commits only if history review is useful

Determine whether the repository contains things that should never have been committed.

Do not rewrite git history unless explicitly instructed.

==================================================
PHASE 15 — DOCUMENTATION
==================================================

Update documentation to reflect the actual project.

At minimum, README should explain:

- What the project is
- Features
- Tech stack
- Architecture overview
- Prerequisites
- Installation
- Environment variables
- Running locally
- Running tests
- Building
- Deployment
- Important design decisions
- Known limitations
- Current project status

If this is intentionally a hobby/experimental project, say so rather than pretending it is production software.

==================================================
PHASE 16 — MODERNIZATION
==================================================

After completing the audit, identify modernization opportunities.

Consider:

- Framework upgrades
- Runtime upgrades
- Dependency upgrades
- Better TypeScript usage
- Better project structure
- Modern APIs
- Better error handling
- Better testing
- Better security defaults
- Better accessibility
- Better performance
- Better developer experience

Categorize every proposed change:

CRITICAL
HIGH
MEDIUM
LOW
OPTIONAL

Also categorize as:

- Must fix
- Recommended
- Nice to have
- Not worth doing

Do not modernize for the sake of modernization.

==================================================
PHASE 17 — CLEANUP
==================================================

Identify things that can safely be removed:

- Dead files
- Unused dependencies
- Unused scripts
- Obsolete configuration
- Old experiments
- Duplicate implementations
- Debug code
- Temporary workarounds
- Deprecated code paths

Before deleting anything, verify that it is actually unused.

==================================================
PHASE 18 — IMPLEMENT IMPROVEMENTS
==================================================

After the audit:

1. Fix critical issues.
2. Fix obvious bugs.
3. Fix security issues.
4. Fix broken setup/build/test functionality.
5. Remove safe dead code.
6. Improve important code-quality problems.
7. Improve documentation.
8. Improve tests.
9. Apply worthwhile dependency upgrades.
10. Apply reasonable UX/performance improvements.

Keep changes focused.

Do NOT:
- Rewrite the whole application
- Replace the framework without justification
- Introduce unnecessary architecture
- Add dependencies unnecessarily
- Convert everything to a different language/framework
- Remove features simply because they are old
- Change behavior without documenting it

==================================================
PHASE 19 — VERIFY EVERYTHING
==================================================

After making changes, run as many of these as applicable:

- Install dependencies
- Type checking
- Lint
- Formatting check
- Unit tests
- Integration tests
- Build
- Production build
- Application startup
- Database migrations
- API tests
- End-to-end tests

If browser access is available, launch the application and manually inspect the major user flows.

Test:

- happy paths
- invalid inputs
- empty states
- loading states
- error states
- responsive layouts
- authentication
- authorization
- important CRUD operations
- destructive operations

Fix regressions discovered during verification.

==================================================
PHASE 20 — FINAL REPORT
==================================================

At the end, provide a concise but comprehensive report with:

# Project Health

Overall rating:

- Broken
- Poor
- Needs maintenance
- Healthy
- Very healthy

# What This Project Does

Brief summary.

# Current Stack

List major technologies and versions.

# Problems Found

Group by:

- Critical
- Security
- Bugs
- Dependencies
- Code quality
- Performance
- Testing
- UX/UI
- Documentation
- Infrastructure
- Repository hygiene

For every important issue include:

- Problem
- Why it matters
- File/location
- Recommended fix
- Whether you fixed it

# Changes Made

List every meaningful change made.

# Dependencies

Show important dependency changes and explain why.

# Tests

Show:

- Tests before
- Tests after
- Tests added
- Tests fixed
- Tests still failing

# Security

State whether any security issues were found and what was done.

Do NOT print secrets.

# Remaining Issues

List things that should still be addressed.

# Not Worth Fixing

Explicitly identify things that are technically outdated but not worth spending time on.

# Project Recommendation

Choose one:

KEEP
KEEP & MODERNIZE
KEEP AS ARCHIVE
REWRITE
DELETE

Explain why.

# Suggested Next Steps

Give the 5–10 highest-value things to do next.

==================================================
IMPORTANT OPERATING PRINCIPLES
==================================================

1. Audit before modifying.
2. Understand before refactoring.
3. Verify before deleting.
4. Prefer minimal changes.
5. Preserve behavior.
6. Fix security issues seriously.
7. Don't blindly upgrade dependencies.
8. Don't optimize without a reason.
9. Don't add tests purely for coverage numbers.
10. Don't introduce unnecessary architecture.
11. Treat old documentation as potentially incorrect.
12. Treat old dependencies as potentially vulnerable.
13. Treat environment/configuration as potentially stale.
14. Assume the project may contain forgotten secrets.
15. Verify the final application rather than assuming it works.
16. Clearly distinguish facts from assumptions.
17. If something cannot be tested because an external service/account is unavailable, document that limitation.
18. Never silently ignore a failing test, build, or command.
19. Make changes in logical groups so they are easy to review.
20. The goal is to make this old repository genuinely useful again, not simply make the code look newer.