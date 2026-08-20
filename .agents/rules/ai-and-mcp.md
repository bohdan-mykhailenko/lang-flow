# AI & MCP Integration Rules

- **Deterministic Outputs**: All Gemini API calls for extraction must enforce strict JSON Schema (`responseSchema`).
- **Model Context Protocol (MCP)**: Expose all database retrieval and mutation capabilities as MCP tools in `crates/mcp-server`.
- **Tutor Chat**: The conversational tutor interacts with user notes via tool calling (`search_library`, `create_flashcard`, `get_due_cards`).
