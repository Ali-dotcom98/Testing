const fs = require('fs');
const { execSync } = require('child_process');

const testDir = './tests';
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.js'));

let passed = 0;
let failed = 0;
let report = '';

for (const file of files) {
    const filePath = `${testDir}/${file}`;
    report += `\n🧪 Running: ${file}\n`;

    try {
        execSync(`node ${filePath}`, { stdio: 'inherit' });
        report += `✅ Passed: ${file}\n`;
        passed++;
    } catch (err) {
        report += `❌ Failed: ${file}\n`;
        failed++;
    }
}

report += `\n✅ Total Passed: ${passed}`;
report += `\n❌ Total Failed: ${failed}\n`;

fs.writeFileSync('test-report.txt', report);
console.log(report);
