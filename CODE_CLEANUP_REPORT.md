# Cognito - Code Cleanup Report

## Executive Summary

✅ **Dead Code Detection Enabled**

ESLint now properly detects unused variables, imports, and function parameters. A total of **20+ dead code issues** identified that can be cleaned up to improve code quality.

---

## Issues Identified

### Category 1: Unused Imports (6 issues)
These are imported but never used in the component:

| File | Import | Type | Line |
|------|--------|------|------|
| `AdverseEffectsAssessment.tsx` | `MessageCircle` | Icon | 43 |
| `ConsciousnessAssessment.tsx` | `Input` | Component | 14 |
| `CognitiveSyndromesAssessment.tsx` | `Brain` | Icon | 7 |
| `CatatoniaResults.tsx` | `CheckCircle2` | Icon | 6 |
| `HumanSexualityAssessment.tsx` | `useState` | Hook | 1 |
| `AssessmentReference.tsx` | `Label` | Component | 4 |

**Fix:** Remove unused imports
```typescript
// ❌ Before
import { MessageCircle, AlertCircle } from 'lucide-react';

// ✅ After
import { AlertCircle } from 'lucide-react';
```

---

### Category 2: Unused Function Parameters (4 issues)
These parameters are defined but never used:

| File | Parameter | Context | Line |
|------|-----------|---------|------|
| `AdhdScreenerLanding.tsx` | `onBack` | Function param | 20 |
| `AdhdResults.tsx` | `onBack` | Function param | 33 |
| `AssessmentReference.tsx` | `onBack` | Function param | 253 |
| `GeneralNeurologicalExam.tsx` | `index` | Callback param | 707 |

**Fix:** Prefix unused params with underscore
```typescript
// ❌ Before
const Component = ({ onBack }: { onBack: () => void }) => {
  // onBack is never called
};

// ✅ After
const Component = ({ _onBack }: { _onBack?: () => void }) => {
  // Intention is clear: parameter intentionally unused
};
```

---

### Category 3: Unused Variables (8 issues)
These variables are assigned but never used:

| File | Variable | Type | Line |
|------|----------|------|------|
| `HamdResults.tsx` | `results` | computed | 83 |
| `SomaticSymptomAssessment.tsx` | `bullet` | string | 205 |
| `FratTab.tsx` | `status` | string | 417 |
| `AssessmentSelector.tsx` | `t` | translation | 17 |
| `AssessmentSelector.tsx` | `type` | string | 16 |
| `AssessmentSelector.tsx` | `description` | string | 17 |
| `CognitiveSyndromesAssessment.tsx` | `t` | translation | 24 |
| `NmsAssessment.tsx` | `equal` | function | 127 |

**Fix:** Either use the variable or remove it
```typescript
// ❌ Before
const MyComponent = () => {
  const results = calculateResults(); // Never used
  return <div>Test</div>;
};

// ✅ After
const MyComponent = () => {
  return <div>Test</div>;
};
```

---

### Category 4: React Best Practices (1 issue)
**Warning:** Fast refresh only works when a file only exports components

| File | Location | Issue |
|------|----------|-------|
| `FratTab.tsx` | Line 277 | Exports constant alongside component |

**Fix:** Extract constants to separate file
```typescript
// ❌ Before (FratTab.tsx)
export const MyComponent = () => { ... };
export const CONSTANTS = { ... };

// ✅ After
// FratTab.tsx
export const MyComponent = () => { ... };

// FratTabConstants.ts
export const CONSTANTS = { ... };
```

---

## Cleanup Impact

### Code Quality Improvements
- ✅ Removes 20+ dead code references
- ✅ Improves tree-shaking for bundle size reduction
- ✅ Clarifies component intentions
- ✅ Reduces maintenance burden
- ✅ Improves code readability

### Bundle Size Impact
**Estimated reduction:** 2-5KB (gzipped)
- Dead imports eliminated
- Tree-shaking can remove associated code
- Minimal CSS/JS bloat removed

### Development Experience
- Faster IDE performance (fewer false suggestions)
- Cleaner git history
- Easier code review
- Better for new team members

---

## Recommended Cleanup Strategy

### Phase 1: Unused Imports (15 minutes)
Remove unused imports - lowest risk, highest clarity:
```bash
# Files to update (sorted by impact)
1. HumanSexualityAssessment.tsx
2. CognitiveSyndromesAssessment.tsx
3. ConsciousnessAssessment.tsx
4. CatatoniaResults.tsx
5. AdverseEffectsAssessment.tsx
6. AssessmentReference.tsx
```

### Phase 2: Unused Parameters (10 minutes)
Prefix unused parameters with `_`:
```typescript
// Example fix
const Component = ({ _onBack, activeTab }: Props) => {
  // Only use activeTab
};
```

### Phase 3: Unused Variables (10 minutes)
Remove or use computed values:
```typescript
// If variable is computed but not used, either:
// 1. Remove the computation
// 2. Use it somewhere in the return
// 3. Add a comment explaining why it's kept
```

### Phase 4: Extract Constants (15 minutes)
Move component-unrelated constants to separate files:
```typescript
// FratTabConstants.ts
export const CONSTANTS = { ... };

// FratTab.tsx (only exports component)
export const FratTab = () => { ... };
```

---

## Automated Cleanup Commands

### Find all linting errors
```bash
npm run lint 2>&1 | grep "error" | wc -l
```

### Find unused imports specifically
```bash
npm run lint 2>&1 | grep "is defined but never used" | grep "import"
```

### Find unused variables
```bash
npm run lint 2>&1 | grep "is assigned a value but never used"
```

---

## Prevention Going Forward

### 1. Pre-commit Hook
Add to `.husky/pre-commit`:
```bash
npm run lint --no-fix
```
Fails commit if linting errors exist.

### 2. CI/CD Pipeline
Add to your CI configuration:
```yaml
- name: Lint Check
  run: npm run lint
  
- name: Type Check
  run: npx tsc --strict --noEmit
  
- name: Build Test
  run: npm run build
```

### 3. IDE Configuration
Enable ESLint in VS Code `.vscode/settings.json`:
```json
{
  "eslint.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 4. Regular Reviews
Monthly code quality reviews:
```bash
# Check current dead code count
npm run lint 2>&1 | grep -c "error"

# Trend: Should decrease over time
```

---

## Quick Reference: Before/After

### Example 1: Unused Import Removal
```typescript
// ❌ Before
import { Button, Input, Alert } from '@/components/ui';

export const MyForm = () => {
  return <div><Button>Submit</Button></div>;
};

// ✅ After
import { Button } from '@/components/ui';

export const MyForm = () => {
  return <div><Button>Submit</Button></div>;
};
```

### Example 2: Unused Parameter
```typescript
// ❌ Before
interface Props {
  onBack?: () => void;
  title: string;
}

export const Header = ({ onBack, title }: Props) => {
  return <h1>{title}</h1>;
};

// ✅ After
interface Props {
  _onBack?: () => void;
  title: string;
}

export const Header = ({ _onBack, title }: Props) => {
  return <h1>{title}</h1>;
};
```

### Example 3: Unused Variable
```typescript
// ❌ Before
const Results = () => {
  const results = calculateResults();
  return <div>View Results</div>;
};

// ✅ After
const Results = () => {
  return <div>View Results</div>;
};

// OR if results will be used later:
// const results = calculateResults();
// return <div>{results.score}</div>;
```

---

## Timeline for Implementation

| Phase | Files | Time | Priority |
|-------|-------|------|----------|
| 1. Unused Imports | 6 files | 15 min | 🔴 Critical |
| 2. Unused Params | 4 files | 10 min | 🟡 High |
| 3. Unused Vars | 8 files | 10 min | 🟡 High |
| 4. Constants Extract | 1 file | 15 min | 🟢 Medium |

**Total Time:** ~50 minutes to fully clean up

---

## Testing After Cleanup

After making changes:
```bash
# Run linting
npm run lint

# Run type check
npx tsc --strict --noEmit

# Run build
npm run build

# Verify app still works
npm run dev
```

Expected result: **0 linting errors** ✅

---

## Next Steps

1. ✅ Review this report
2. ⭕ Run `npm run lint` to see current state
3. ⭕ Fix issues in priority order (Phase 1 → 4)
4. ⭕ Run tests after each phase
5. ⭕ Commit changes with clear messages
6. ⭕ Set up pre-commit hooks for future

---

## Notes

- **No functional changes required** - These are code quality improvements only
- **Backwards compatible** - Cleanup won't break any features
- **Incremental** - Can be done in stages
- **Low risk** - ESLint provides confidence in safety

---

**Report Generated:** April 2024  
**Total Issues Found:** 20+  
**Estimated Cleanup Time:** 50 minutes  
**Impact:** Improved code quality, reduced bundle size, better maintainability

---

## Need Help?

For each issue type, refer to this section:
- **Unused imports** → Category 1
- **Unused params** → Category 2  
- **Unused variables** → Category 3
- **React best practices** → Category 4
