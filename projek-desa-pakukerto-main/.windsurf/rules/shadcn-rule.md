---
trigger: always_on
---

1. NEVER create Shadcn UI components manually in src/components/ui/
2. ALWAYS check in src/components/ui/ to make sure the shacn component already added or not. if the component not added yet, ALWAYS use: "npx shadcn@latest add component-name" command!
3. Only modify components in src/components/ui/ if absolutely necessary for customization
4. Check Shadcn UI docs before adding new components
5. ALWAYS use CSS variable colors defined in src/styles/global.css
