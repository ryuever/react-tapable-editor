# Runtime Output

Runtime output components make tool execution visible without forcing logs into
plain text.

## Terminal

```tsx
import { TerminalBlock } from 'react-tapable-editor';

<TerminalBlock
  command="npm run release:check"
  output={'build ok\ne2e ok\ndocs ok'}
  status="success"
/>
```

## Test results

```tsx
import { TestResultsBlock } from 'react-tapable-editor';

<TestResultsBlock
  results={[
    { id: 'payload', name: 'structured payload', status: 'passed', duration: '1.2s' },
    { id: 'docs', name: 'docs build', status: 'passed', duration: '4.1s' },
  ]}
/>
```

## Status model

Terminal status: `idle | running | success | error`.

Test status: `passed | failed | skipped`.
