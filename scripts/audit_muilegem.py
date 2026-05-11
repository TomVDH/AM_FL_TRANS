import json

# Canonical Mapping
MAPPING = {
    "Fannyside": "Muilenbeek",
    "Bumpkin Village": "Klotegem",
    "Bumpkin": "Klotegem",
    "Bumpkinites": "Klotegemmers"
}

audit_rows = []

with open('data/analysis/all-dialogue.jsonl', 'r') as f:
    for line in f:
        data = json.loads(line)
        nl = data.get('dutch', '')
        en = data.get('english', '')
        
        if 'Muilegem' in nl:
            # Determine correct term based on English source
            proposed_nl = nl
            target_term = "???"
            rationale = "UNKNOWN"
            
            if 'Bumpkin' in en:
                target_term = "Klotegem"
                proposed_nl = nl.replace('Muilegemmers', 'Klotegemmers').replace('Muilegem', 'Klotegem')
                rationale = "EN source specifies Bumpkin"
            elif 'Fannyside' in en:
                target_term = "Muilenbeek"
                proposed_nl = nl.replace('Muilegem', 'Muilenbeek')
                rationale = "EN source specifies Fannyside"
            else:
                # Contextual fallback or flags for human review
                rationale = "No explicit Fannyside/Bumpkin in EN; needs review"
            
            audit_rows.append({
                "loc": f"{data['episode']} | {data['sheet']}",
                "speaker": data['speaker'],
                "en": en,
                "current_nl": nl,
                "proposed_nl": proposed_nl,
                "rationale": rationale
            })

# Print a human-readable Markdown table for audit
print("| Location | Speaker | English Source | Current NL | Proposed NL | Rationale |")
print("|---|---|---|---|---|---|")
for row in audit_rows:
    print(f"| {row['loc']} | {row['speaker']} | {row['en']} | {row['current_nl']} | {row['proposed_nl']} | {row['rationale']} |")
