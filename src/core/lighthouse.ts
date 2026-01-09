

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

export async function runLighthouseAudit(url: string, opts: any = {}): Promise<any> {
    console.log(`Starting Lighthouse audit for ${url}`);
    
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { 
        logLevel: 'info', 
        output: 'json', 
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], 
        port: chrome.port,
        ...opts
    };
    
    // For local files/simple testing, we might need more config, but this is standard usage
    const runnerResult = await lighthouse(url, options);

    // `.report` is the JSON report path or string depending on output option.
    // With output: 'json', it returns the JSON string in `.report` usually, 
    // but newer lighthouse versions might return it directly.
    // runnerResult.lhr is the JS object.

    await chrome.kill();

    if (!runnerResult) throw new Error('Lighthouse failed to run');
    return runnerResult.lhr;
}
