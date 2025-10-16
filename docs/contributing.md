# Contributing to USDrop AI

## Cursor AI Rules

✅ **Cursor AI reads `.cursorrules` from the repo root.**  
❌ **Do not rename or move this file.**

The `.cursorrules` file contains the master ruleset for Cursor AI and must remain at the project root with this exact filename (no extension). This ensures Cursor can properly detect and apply the project's coding standards, conventions, and behavioral rules.

### File Location
- **Correct**: `.cursorrules` (at project root)
- **Incorrect**: `.cursorrules.md`, `cursorrules.md`, `docs/.cursorrules`, etc.

### Persistence Rule
In future refactors or code moves, ensure `.cursorrules` always stays at the root and keeps its filename. This file is critical for maintaining consistent AI assistance across the project.

## Development Guidelines

Please follow the standards defined in `.cursorrules` for:
- Code quality and architecture
- UI/UX patterns and accessibility
- Database schema and security
- Documentation and testing
- MCP integration and environment handling

## Questions?

If you have questions about the project standards, refer to the comprehensive rules in `.cursorrules` or the documentation in `/docs/`.
