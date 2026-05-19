import playwright from '@playwright/test';

const { expect, test } = playwright;

test('submits structured text, chips, blocks, and portable payload', async ({
  page,
}) => {
  await page.goto('/');

  const editor = page.getByLabel('AI editor input');
  await expect(editor).toBeVisible();

  await editor.click();
  await page.keyboard.type('Plan the migration');
  await page.getByRole('button', { name: '@', exact: true }).click();
  await page.getByRole('button', { name: /react-tapable-editor/ }).click();
  await page.getByRole('button', { name: '/', exact: true }).click();
  await page.getByRole('button', { name: 'Insert artifact block' }).click();
  await page.getByRole('button', { name: 'Insert agent run' }).click();
  await page.getByRole('button', { name: 'Mark running' }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  const payloadPreview = page.getByTestId('payload-json');
  await expect(payloadPreview).toContainText('Plan the migration');
  await expect(payloadPreview).toContainText('"portable"');
  await expect(payloadPreview).toContainText('"version": 2');
  await expect(payloadPreview).toContainText('"kind": "context"');
  await expect(payloadPreview).toContainText('"kind": "artifact"');
  await expect(payloadPreview).toContainText('"kind": "tool-call"');
  await expect(payloadPreview).toContainText('"status": "running"');
});

test('allows structured-only submits while blocking fully empty submits', async ({
  page,
}) => {
  await page.goto('/');

  const submit = page.getByRole('button', { name: 'Send' });
  await expect(submit).toBeDisabled();

  await page.getByRole('button', { name: '@', exact: true }).click();
  await page.getByRole('button', { name: /react-tapable-editor/ }).click();
  await expect(submit).toBeEnabled();
  await submit.click();

  const payloadPreview = page.getByTestId('payload-json');
  await expect(payloadPreview).toContainText('"text": ""');
  await expect(payloadPreview).toContainText('"kind": "context"');
});

test('shows default mention suggestions for people, files, folders, and actions', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('button', { name: '@', exact: true }).click();

  const mentionPanel = page.getByLabel('Mention suggestions');
  await expect(mentionPanel).toContainText('People');
  await expect(mentionPanel).toContainText('Files');
  await expect(mentionPanel).toContainText('Folders');
  await expect(mentionPanel).toContainText('Actions');

  await page.getByLabel('Search mentions').fill('portable');
  await expect(mentionPanel).toContainText('src/schema/portable.ts');
});

test('formats text with toolbar controls', async ({ page }) => {
  await page.goto('/');

  const editor = page.getByLabel('AI editor input');
  await editor.click();
  await page.keyboard.type('Important heading');
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A');

  await page.getByRole('button', { name: 'Bold' }).click();
  await page.getByRole('button', { name: 'Heading 1' }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  const payloadPreview = page.getByTestId('payload-json');
  await expect(payloadPreview).toContainText('"type": "heading"');
  await expect(payloadPreview).toContainText('"tag": "h1"');
  await expect(payloadPreview).toContainText('"marks"');
  await expect(payloadPreview).toContainText('"bold"');
});

test('updates image block through imperative handle', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Insert demo image' }).click();
  await page.getByRole('button', { name: 'Update demo image' }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  const payloadPreview = page.getByTestId('payload-json');
  await expect(payloadPreview).toContainText('"kind": "image"');
  await expect(payloadPreview).toContainText('"src": "https://placehold.co/640x360/png"');
  await expect(payloadPreview).toContainText('"width": "240px"');
  await expect(payloadPreview).toContainText('"alignment": "right"');
  await expect(payloadPreview).toContainText('Updated demo image');
});

test('inserts image blocks from the media insert component', async ({ page }) => {
  await page.goto('/');

  const imageInsert = page.getByLabel('Image insert');
  await imageInsert.getByPlaceholder('https://...').fill('https://placehold.co/320x180/png');
  await imageInsert.getByPlaceholder('Describe the image').fill('Generated UI preview');
  await imageInsert.getByPlaceholder('Optional caption').fill('Inserted from media primitive');
  await imageInsert.getByRole('button', { name: 'Insert image' }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  const payloadPreview = page.getByTestId('payload-json');
  await expect(payloadPreview).toContainText('"kind": "image"');
  await expect(payloadPreview).toContainText('https://placehold.co/320x180/png');
  await expect(payloadPreview).toContainText('Generated UI preview');
  await expect(payloadPreview).toContainText('Inserted from media primitive');
});

test('edits image blocks with the selected block toolbar', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Insert demo image' }).click();
  await page.getByAltText('Demo image').click();
  await page.getByRole('button', { name: 'left' }).click();
  await page.getByRole('button', { name: '160px' }).click();
  await page.getByRole('button', { name: 'Duplicate' }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  const payloadPreview = page.getByTestId('payload-json');
  await expect(payloadPreview).toContainText('"alignment": "left"');
  await expect(payloadPreview).toContainText('"width": "160px"');
  await expect(payloadPreview).toContainText('demo-image-copy');
});

test('loads prompt history and selected model into the payload', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'History prev' }).click();
  await page.getByLabel('AI model').selectOption('reasoning');
  await page.getByRole('button', { name: 'Send' }).click();

  const payloadPreview = page.getByTestId('payload-json');
  await expect(payloadPreview).toContainText('Review the selected files and identify risks.');
  await expect(payloadPreview).toContainText('"id": "reasoning"');
  await expect(payloadPreview).toContainText('"label": "Reasoning"');
});

test('emits standard prompt input message and runtime adapter payloads', async ({
  page,
}) => {
  await page.goto('/');

  const editor = page.getByLabel('AI editor input');
  await editor.click();
  await page.keyboard.type('Explain the package API');
  await page.getByRole('button', { name: '@', exact: true }).click();
  await page.getByRole('button', { name: /react-tapable-editor/ }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  const messagePreview = page.getByTestId('prompt-message-json');
  await expect(messagePreview).toContainText('Explain the package API');
  await expect(messagePreview).toContainText('"referencedSources"');
  await expect(messagePreview).toContainText('"toolMode": "chat"');

  const adaptersPreview = page.getByTestId('runtime-adapters-json');
  await expect(adaptersPreview).toContainText('"aiSDK"');
  await expect(adaptersPreview).toContainText('"openAIResponses"');
  await expect(adaptersPreview).toContainText('"input_text"');
});

test('updates agent run through imperative handle', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Insert agent run' }).click();
  await page.getByRole('button', { name: 'Mark success' }).click();
  await page.getByRole('button', { name: 'Send' }).click();

  const payloadPreview = page.getByTestId('payload-json');
  await expect(payloadPreview).toContainText('"kind": "tool-call"');
  await expect(payloadPreview).toContainText('"status": "success"');
  await expect(payloadPreview).toContainText('Agent completed successfully.');
  await expect(payloadPreview).toContainText('"runId"');
  await expect(payloadPreview).toContainText('"invocationId"');
  await expect(payloadPreview).toContainText('"logs"');
  await expect(payloadPreview).toContainText('"output"');
});

test('handles tool-call lifecycle action buttons', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: '/', exact: true }).click();
  await page.getByRole('button', { name: 'Insert tool-call block' }).click();
  await page.getByRole('button', { name: 'Approve chat tool call' }).click();

  const lastActionPreview = page.getByTestId('last-action-json');
  await expect(lastActionPreview).toContainText('"action": "approve"');
  await expect(lastActionPreview).toContainText('"kind": "tool-call"');

  await page.getByRole('button', { name: 'Send' }).click();

  const payloadPreview = page.getByTestId('payload-json');
  await expect(payloadPreview).toContainText('"status": "running"');
  await expect(payloadPreview).toContainText('approve requested.');
});
