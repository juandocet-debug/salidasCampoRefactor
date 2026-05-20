const fs = require('fs');
const readline = require('readline');

async function recover() {
    const transcriptPath = 'C:/Users/SOPORTE/.gemini/antigravity/brain/bc7b0b5d-b882-4dd6-85b3-be19ccef550f/.system_generated/logs/transcript.jsonl';
    const fileStream = fs.createReadStream(transcriptPath);
    
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let parts = [];
    
    for await (const line of rl) {
        if (!line) continue;
        try {
            const row = JSON.parse(line);
            const text = JSON.stringify(row);
            if (text.includes('AppConductor.jsx') && text.includes('import React')) {
                parts.push(text);
            }
        } catch (e) {
        }
    }
    
    fs.writeFileSync('recovered_raw.txt', parts.join('\n\n=====\n\n'), 'utf8');
    console.log('Recovery raw written.');
}

recover();
