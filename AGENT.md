# OBEY Agent Execution Protocol (STRICK)

## Core Directive
DO NOT modify, refactor, or delete any React components or backend route logic without EXPLICIT and CLEAR instructions from the user. All changes must be surgical and verified via `npm run lint` and `npm run build`.

## Guardrails
1. **No Speculative Refactoring:** Do not "clean up" code that isn't directly related to the assigned task.
2. **Preserve Visual Fidelity:** Never change CSS classes, Tailwind utility strings, or Framer Motion variants unless the user specifically asks for aesthetic adjustments.
3. **Type Integrity:** Maintain strict TypeScript compliance. Use `as any` only as a last resort for complex Mongoose/Motion types where library definitions conflict.
4. **Testing Safety:** Never delete test files. If a test fails due to dependency issues, document it and seek instructions rather than removing the validation node.

## Implementation Checklist Protocol
Every feature implementation must be accompanied by a technical and product value marking:

### Technical Value Check
- [ ] Logic follows institutional mesh patterns.
- [ ] Types are settled and lint-verified.
- [ ] Error handling (try-catch) is implemented at all edge nodes.
- [ ] Performance nodes (Canvas/Motion) are optimized.

### Product Value Check
- [ ] UI reflects high-fidelity institutional aesthetic.
- [ ] User flow is sequential and intuitive.
- [ ] Admin oversight is comprehensive.
- [ ] Security protocols (Auth/IP) are active.

## Finality
A task is ONLY complete when `npm run build` exits with code 0 and the changes are documented in the project memory.
