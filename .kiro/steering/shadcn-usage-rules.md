# Shadcn Component Usage Rules

## Usage Rule

When asked to use shadcn components, use the MCP server.

## Planning Rule

When asked to plan using anything related to shadcn:

- Use the MCP server during planning
- Apply components wherever components are applicable
- Use whole blocks where possible (e.g., login page, calendar)

## Implementation Rule

When implementing:

1. First call the demo tool to see how it is used
2. Then implement it so that it is implemented correctly

## MCP Server Guidelines

- Always leverage the shadcn MCP server tools for component discovery and implementation
- Use `mcp_shadcn_ui_list_components` to explore available components
- Use `mcp_shadcn_ui_get_component` to get component source code
- Use `mcp_shadcn_ui_get_component_demo` to understand proper usage patterns
- Use `mcp_shadcn_ui_list_blocks` and `mcp_shadcn_ui_get_block` for complete UI sections

## Best Practices

- Prioritize using complete blocks over individual components when building full pages
- Always check component demos before implementation to ensure correct usage
- Follow shadcn/ui v4 patterns and conventions
- Ensure proper TypeScript integration and accessibility compliance
