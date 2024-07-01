import { prompt } from 'enquirer';
import { main, sanitize } from '../src/index';

jest.mock('enquirer');

describe('Prompt Tests', () => {
    it('should prompt questions and handle answers correctly', async () => {
      const mockAnswers = {
        name: 'test-project',
        description: 'Testing project',
        license: 'MIT',
        techUsed: ['Node.js', 'Python'],
        orgname: 'test-org',
      };
  
  
      await main();
  
    });
  });

describe('Sanitize Function Tests', () => {
    it('should sanitize input text correctly', () => {
      const input = 'My Project - Test!';
  
      const sanitized = sanitize(input);
  
      expect(sanitized).toBe('My-Project---Test-');
    });
});