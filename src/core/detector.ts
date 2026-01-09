
import fs from 'fs';
import path from 'path';

export async function detectLanguageAndFramework(projectPath: string): Promise<{
  language: string;
  framework: string;
  buildTool: string;
  files: string[];
  confidence: number;
}> {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    let framework = 'Unknown';
    let buildTool = 'npm/yarn/pnpm';
    
    if (packageJson.dependencies) {
      if (packageJson.dependencies['react']) framework = 'React';
      else if (packageJson.dependencies['vue']) framework = 'Vue';
      else if (packageJson.dependencies['@angular/core']) framework = 'Angular';
      else if (packageJson.dependencies['next']) { framework = 'Next.js'; buildTool = 'Next.js'; }
      else if (packageJson.dependencies['svelte']) framework = 'Svelte';
    }

    if (packageJson.devDependencies) {
         if (packageJson.devDependencies['vite']) buildTool = 'Vite';
         else if (packageJson.devDependencies['webpack']) buildTool = 'Webpack';
    }

    return { language: 'JavaScript/TypeScript', framework, buildTool, files: [], confidence: 0.95 };
  }

  const requirementsPath = path.join(projectPath, 'requirements.txt');
  if (fs.existsSync(requirementsPath)) {
    return { language: 'Python', framework: 'Django/Flask/Unknown', buildTool: 'pip', files: [], confidence: 0.9 };
  }

  return { language: 'Unknown', framework: 'Unknown', buildTool: 'Unknown', files: [], confidence: 0.5 };
}

// Re-exporting is not needed as we changed the consumers to use specific files,
// but for safety if I missed any import in other files (though I am updating server.ts next):
// I will NOT re-export to force clean usage.