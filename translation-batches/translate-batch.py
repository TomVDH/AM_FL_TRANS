#!/usr/bin/env python3
"""
Translate batch files from English to Dutch for Asses to Masses game.
This script processes one batch at a time using Claude API.
"""

import json
import os
import sys
import anthropic

BATCH_DIR = '/Users/tomlinson/AM_FL_TRANS/translation-batches'

# Character name mappings from existing translations
CHARACTER_NAMES = {
    "Old Ass": "Ouwe Zak",
    "Trusty Ass": "Trouwe Zak",
    "Nice Ass": "Schoon Beest",
    "Big Ass": "Mega Ezel",
    "Thirsty Ass": "Dorstlap",
    "Smart Ass": "Betweter",
    "Slow Ass": "Slome Ezel",
    "Kick Ass": "Stampgast",
    "Sick Ass": "Snotezel",
    "Hard Ass": "Felle Gast",
    "Sturdy Ass": "Stoere Ezel",
    "Sad Ass": "Triestigaard",
    "Lazy Ass": "Luie Zak",
    "Bad Ass": "Waaghalske",
    "Cole-Machine": "Piet-Machine",
    "Golden Ass": "Gouden Ezel",
    "The Masses": "De Massa",
    "Hee": "Hieee",
    "Haw": "Haaa",
    "THE GODS": "DE GODEN",
    "Sheep": "Schaap",
    "Eli the Elephant": "Ollie de Olifant",
    "Pig": "Varken",
    "Cow": "Koe",
    "Human": "Mens",
    "Ass Handler Melvin": "Zakkenzeuler Zeno",
    "Ass Handler Wedgie": "Zakkenzeulster Zita",
    "Yes": "Ja",
    "No": "Nee",
}

def load_examples():
    """Load a subset of translation examples for context"""
    examples_path = os.path.join(BATCH_DIR, 'translation-examples.json')
    with open(examples_path, 'r', encoding='utf-8') as f:
        all_examples = json.load(f)

    # Filter for Dutch (not Italian) and return first 100
    dutch_examples = []
    for ex in all_examples[:300]:
        dutch = ex.get('dutch', '')
        # Check for Dutch characteristics
        if any(marker in dutch.lower() for marker in ['ezel', 'zak', 'beest', 'gast', 'ij', 'ë']):
            dutch_examples.append(ex)
            if len(dutch_examples) >= 100:
                break

    return dutch_examples

def build_translation_prompt(batch_data, examples):
    """Build the prompt for translation"""

    # Character names section
    char_section = "Character name translations:\n"
    for eng, dut in list(CHARACTER_NAMES.items())[:20]:
        char_section += f"- {eng} → {dut}\n"

    # Example translations section
    example_section = "\nExample dialogue translations:\n"
    for ex in examples[:15]:
        if len(ex.get('english', '')) > 5 and ex.get('dutch'):
            example_section += f"EN: {ex['english']}\nNL: {ex['dutch']}\n\n"

    prompt = f"""You are translating game dialogue from English to Dutch for "Asses to Masses", an irreverent satirical game about donkeys and labor politics.

{char_section}

{example_section}

CRITICAL TRANSLATION RULES:
1. Preserve ALL variables like {{$NewName}} EXACTLY as-is
2. Keep line breaks (\\n) intact
3. Match the irreverent, playful, satirical tone
4. Use the character name translations provided above
5. Yes → Ja, No → Nee
6. Keep UI text concise and clear
7. Empty keys or "???" should stay as-is
8. Try to maintain alliteration and wordplay where possible
9. For very short entries like "PRESS X", translate literally: "DRUK OP X"

Translate these {len(batch_data)} entries. Return ONLY a valid JSON array where each entry has all the original fields PLUS a new "translatedDutch" field with the Dutch translation.

Input to translate:
{json.dumps(batch_data, ensure_ascii=False, indent=2)}

Return ONLY the JSON array, no other text."""

    return prompt

def translate_batch(batch_num, client):
    """Translate a single batch file"""

    batch_file = f"batch-{batch_num:03d}.json"
    batch_path = os.path.join(BATCH_DIR, batch_file)
    output_file = f"batch-{batch_num:03d}-translated.json"
    output_path = os.path.join(BATCH_DIR, output_file)

    # Skip if already exists
    if os.path.exists(output_path):
        print(f"✓ Batch {batch_num} already translated, skipping...")
        return True

    print(f"\n{'='*60}")
    print(f"Translating batch {batch_num}...")
    print(f"{'='*60}")

    # Load batch data
    with open(batch_path, 'r', encoding='utf-8') as f:
        batch_data = json.load(f)

    # Load examples
    examples = load_examples()

    # Build prompt
    prompt = build_translation_prompt(batch_data, examples)

    try:
        # Call Claude API
        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=16000,
            temperature=0.3,
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )

        response_text = message.content[0].text

        # Parse response
        # Remove markdown code blocks if present
        json_text = response_text.strip()
        if json_text.startswith('```'):
            json_text = json_text.split('```')[1]
            if json_text.startswith('json'):
                json_text = json_text[4:]
            json_text = json_text.strip()

        translated_data = json.loads(json_text)

        # Validate
        if not isinstance(translated_data, list):
            print(f"ERROR: Response is not an array")
            return False

        if len(translated_data) != len(batch_data):
            print(f"ERROR: Expected {len(batch_data)} entries, got {len(translated_data)}")
            return False

        # Check that translations were added
        missing_translations = 0
        for entry in translated_data:
            if 'translatedDutch' not in entry or not entry['translatedDutch']:
                missing_translations += 1

        if missing_translations > 0:
            print(f"WARNING: {missing_translations} entries missing Dutch translations")

        # Write output
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, ensure_ascii=False, indent=2)

        print(f"✓ Batch {batch_num} translated successfully!")
        print(f"  - {len(translated_data)} entries processed")
        print(f"  - Output: {output_file}")

        return True

    except Exception as e:
        print(f"ERROR translating batch {batch_num}: {e}")
        return False

def update_status(completed_batches):
    """Update the status.json file"""
    status_path = os.path.join(BATCH_DIR, 'status.json')

    with open(status_path, 'r', encoding='utf-8') as f:
        status = json.load(f)

    status['completedBatches'] = len(completed_batches)

    for batch_info in status['batches']:
        if batch_info['batchNumber'] in completed_batches:
            batch_info['status'] = 'completed'

    with open(status_path, 'w', encoding='utf-8') as f:
        json.dump(status, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Updated status.json: {len(completed_batches)}/64 batches completed")

def main():
    """Main function to process all batches"""

    # Get API key
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY environment variable not set")
        print("Set it with: export ANTHROPIC_API_KEY='your-key-here'")
        sys.exit(1)

    # Initialize client
    client = anthropic.Anthropic(api_key=api_key)

    # Check if specific batch requested
    if len(sys.argv) > 1:
        batch_num = int(sys.argv[1])
        success = translate_batch(batch_num, client)
        sys.exit(0 if success else 1)

    # Process all batches
    print("\n" + "="*60)
    print("TRANSLATION TASK: All 64 batches")
    print("="*60)

    completed = []

    for batch_num in range(1, 65):
        success = translate_batch(batch_num, client)

        if success:
            completed.append(batch_num)

            # Update status every 5 batches
            if batch_num % 5 == 0:
                update_status(completed)
        else:
            print(f"\n⚠️  Failed on batch {batch_num}, stopping...")
            break

    # Final update
    update_status(completed)

    print("\n" + "="*60)
    print(f"TRANSLATION COMPLETE!")
    print(f"Processed: {len(completed)}/64 batches")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
