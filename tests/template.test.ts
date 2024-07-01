import fs, { PathLike } from 'node:fs';
import path from 'node:path';
import ejs from 'ejs';
import { renderTemplate } from '../src/index'; // Adjust import paths as per your project structure

jest.mock('ejs');

describe('Template Rendering Tests', () => {
  it('should render templates correctly', async () => {
    const templatePath = '/mock/template/path';
    const destPath = '/mock/dest/path';
    const data = { name: 'test-project', description: 'Testing project', license: 'MIT', orgname: 'test-org' };
    const mockRenderedTemplate = 'Mock rendered content';

    // Mocking ejs renderFile
    (ejs.renderFile as jest.MockedFunction<typeof ejs.renderFile>).mockResolvedValueOnce(mockRenderedTemplate);

    // Mocking mkdirSync and writeFileSync
    jest.spyOn(fs, 'mkdirSync').mockReturnValue(''); // Ensure mockReturnValue matches expected type
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {}); // Mock writeFileSync properly

    await renderTemplate(templatePath, destPath, data);

    // Expectations
    expect(ejs.renderFile).toHaveBeenCalledWith(templatePath, data);
    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(destPath), { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(destPath, mockRenderedTemplate);
  });

  it('should handle rendering errors', async () => {
    const templatePath = '/mock/template/path';
    const destPath = '/mock/dest/path';
    const data = { name: 'test-project', description: 'Testing project', license: 'MIT', orgname: 'test-org' };

    // Mocking ejs renderFile to throw an error
    (ejs.renderFile as jest.MockedFunction<typeof ejs.renderFile>).mockRejectedValueOnce(new Error('Render error'));

  });
});