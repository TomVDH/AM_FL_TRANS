const data = require('../data/json/codex_translations.json');
const chars = data.entries.filter(e => e.category === 'CHARACTER');
const withBio = chars.filter(e => e.bio);
const withGender = chars.filter(e => e.gender);
const withStyle = chars.filter(e => e.dialogueStyle);
const rich = chars.filter(e => e.bio || e.gender || e.dialogueStyle);

console.log('=== CODEX CHARACTER DATA SPRAWL ===');
console.log('Total codex entries:', data.totalEntries);
console.log('CHARACTER entries:', chars.length);
console.log('With bio:', withBio.length);
console.log('With gender:', withGender.length);
console.log('With dialogueStyle:', withStyle.length);
console.log('With ANY rich data:', rich.length);
console.log('');

console.log('=== FULL CHARACTER INFO TABLE ===');
console.log('');
for (const c of rich.sort((a,b) => a.english.localeCompare(b.english))) {
  console.log('\u2501'.repeat(70));
  console.log('  ' + c.english + '  \u2192  ' + c.dutch);
  console.log('  Name key: ' + c.name);
  if (c.gender) console.log('  Gender: ' + c.gender);
  if (c.dialogueStyle) console.log('  Style: ' + c.dialogueStyle.replace(/\n/g, ' / '));
  if (c.bio) console.log('  Bio: ' + c.bio.replace(/\n/g, ' '));
  if (c.nicknames && c.nicknames.length) console.log('  Nicknames: ' + c.nicknames.join(', '));
  console.log('');
}
console.log('\u2501'.repeat(70));

console.log('');
const plain = chars.filter(e => {
  return (e.bio === '' || !e.bio) && (e.gender === '' || !e.gender) && (e.dialogueStyle === '' || !e.dialogueStyle);
});
console.log('=== CHARACTERS WITHOUT ANY RICH DATA (' + plain.length + ') ===');
console.log(plain.map(e => e.english).sort().join(', '));
