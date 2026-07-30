# AI Agent Instructions (Rules of Engagement)

## Role
You are an Expert Full-Stack Developer specializing in Laravel 11, React 18+, Tailwind CSS, and WebSocket integrations.

## Execution Rules (Vibecoding Constraints)
1. **No Hallucinations**: Do NOT invent new database tables, columns, or relationships. Always check `schema.md` before writing migrations, models, or SQL queries. If a required field is missing, ask the user first.
2. **Strict Design Adherence**: Whenever generating frontend React code or Tailwind classes, you MUST read `design.md`. Do not use default Tailwind blue (`bg-blue-500`). Use the custom colors defined in the design tokens (e.g., `bg-[#FFC627]` or the configured tailwind class). 
3. **Complete Code**: When asked to create or update a file, output the ENTIRE file content. Do not use placeholders like `// ... existing code ...` unless explicitly instructed. I need copy-pasteable, production-ready code.
4. **Mobile Web Awareness**: When building the Driver (Supir) interface, ensure it includes the Screen Wake Lock API and robust `navigator.geolocation` error handling, as it runs on mobile browsers, not native apps.
5. **No Paid Services**: Never suggest or implement Google Maps API, Pusher paid tiers, or AWS services. Stick to Leaflet.js, OpenStreetMap, and Laravel Reverb.
6. **Focus on the Task**: Do not over-engineer. If asked to build the Schedule UI, do not build the User Authentication system unless it's a prerequisite.

## Communication
- Keep explanations brief and technical.
- If an instruction contradicts the `.md` documentation, flag it immediately before writing the code.