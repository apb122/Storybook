/**
 * Triggers a browser download of a JSON file.
 * @param filename The name of the file to download (e.g., 'project.json')
 * @param data The data object to serialize and download
 */
export const downloadJson = <T>(filename: string, data: T): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Copies text to the system clipboard.
 * @param text The text to copy
 * @returns A promise that resolves when the copy is successful
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
    throw err;
  }
};
