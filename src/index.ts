import pkg from 'enquirer';
const { prompt } = pkg;
import fs from 'node:fs';
import path from 'node:path';
import ejs from 'ejs';
import winston from 'winston';

// Create a custom format for Winston that colorizes log levels and formats messages as plain text
const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message }) => {
      return `${level}: ${message}`;
    })
  );
  
  // Configure Winston with the custom format
  const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [new winston.transports.Console()],
  });

const _dirname = '.';

const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter project name:',
    initial: 'shoveler',
  },
  {
    type: 'input',
    name: 'description',
    message: 'Enter project description:',
    initial: 'Yet another flying shoveler',
  },
  {
    type: 'select',
    name: 'license',
    message: 'Choose a license:',
    choices: [
        { name: 'MIT License', value: 'MIT', checked: true },
        { name: 'Apache License 2.0', value: 'Apache-2.0' },
        { name: 'GNU General Public License v2.0', value: 'GPL-2.0' },
        { name: 'GNU General Public License v3.0', value: 'GPL-3.0' },
        { name: 'BSD 2-Clause "Simplified" License', value: 'BSD-2-Clause' },
        { name: 'BSD 3-Clause "New" or "Revised" License', value: 'BSD-3-Clause' },
        { name: 'Boost Software License 1.0', value: 'BSL-1.0' },
        { name: 'Creative Commons Zero v1.0 Universal', value: 'CC0-1.0' },
        { name: 'Eclipse Public License 2.0', value: 'EPL-2.0' },
        { name: 'GNU Affero General Public License v3.0', value: 'AGPL-3.0' },
        { name: 'GNU Lesser General Public License v2.1', value: 'LGPL-2.1' },
        { name: 'GNU Lesser General Public License v3.0', value: 'LGPL-3.0' },
        { name: 'Mozilla Public License 2.0', value: 'MPL-2.0' },
        { name: 'The Unlicense', value: 'Unlicense' },
        { name: 'Zlib License', value: 'Zlib' },
        { name: 'None', value: 'None' },
      ],
  },
  {
    type: 'multiselect',
    name: 'techUsed',
    message: 'Choose technologies used:',
    choices: [
      { name: 'Node.js', value: 'Node.js', checked: true },
      { name: 'Python', value: 'Python' },
      { name: 'Go', value: 'Go' },
      { name: 'Rust', value: 'Rust' },
      { name: 'Ruby', value: 'Ruby' },

    ],
  },
  {
    type: 'input',
    name: 'orgname',
    message: 'GitHub Organisation name?',
    initial: 'orgname',
  },
];

interface Answers {
  name: string;
  description: string;
  license: string;
  techUsed: string[];
  orgname: string;
}

export async function main() {
  try {

    const answers: Answers = await prompt(questions) as Answers;
    answers.name = sanitize(answers.name);
    answers.orgname = sanitize(answers.orgname);
    await generateProject(answers);
    logger.info(`Project ${answers.name} generated successfully!`);
  } catch (error) {
    logger.error('Error generating project', error);
  }
}

export function sanitize(text: string): string {
    return text.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/\s+/g, '-');
  }

async function generateProject(answers: Answers) {
  const { name, description, license, techUsed, orgname } = answers;

  for (const tech of techUsed) {
    await generateTechFiles(name, description, license, orgname, tech);
  }

  await generateReadme(name, description, license, orgname);
}

async function generateTechFiles(name: string, description: string, license: string, orgname: string, tech: string) {
  const templateDir = path.join(_dirname, 'templates', tech.toLowerCase());
  const files = fs.readdirSync(templateDir);

  for (const file of files) {
    const templatePath = path.join(templateDir, file);
    const destPath = path.join(process.cwd(), name, file.replace('.ejs', ''));
    await renderTemplate(templatePath, destPath, { name, description, license, orgname });
  }
}

async function generateReadme(name: string, description: string, license: string, orgname: string) {
  const readmeTemplatePath = path.join(_dirname, 'templates', 'README.ejs.md');
  const readmeDestPath = path.join(process.cwd(), name, 'README.md');
  await renderTemplate(readmeTemplatePath, readmeDestPath, { name, description, license, orgname });
}

export async function renderTemplate(templatePath: string, destPath: string, data: Record<string, unknown>) {
  try {
    const str = await ejs.renderFile(templatePath, data);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, str);
    logger.info(`Generated ${destPath}`); 
  } catch (error: unknown) {
    if (error instanceof Error) {
        logger.error(`Error generating project: ${error.stack}`);
    }
  }
}

main();
