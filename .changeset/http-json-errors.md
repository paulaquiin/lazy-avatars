---
"lazy-avatars": major
---

Return structured JSON error bodies from the self-hosted HTTP server instead of plain status text. Error responses include a stable code, message and resolution hint without reflecting the requested seed. Successful SVG responses and their bytes are unchanged. Consumers that parse error bodies must update their handling.
