import json
import re

def is_subject_u(text):
    # Match 'u' as a separate word, not followed by 'avonturen', 'oor', etc. (possessive)
    # and not preceded by 'voor', 'bij', 'aan', 'om', 'tegen', 'met', 'van', 'ik', 'ge', 'gij' (object/prepositional)
    # This is a heuristic. Subject 'u' often appears near verbs like 'bent', 'hebt', 'gaat', 'kan'.
    # Or at the start of a sentence.
    
    # Subject patterns: 'u bent', 'u heeft', 'u gaat', 'u kan', 'u wilt', 'u mag'
    # Inversion: 'bent u', 'heeft u', 'gaat u', 'kunt u', 'wilt u', 'mag u'
    
    subject_patterns = [
        r'\bu\b\s+(bent|hebt|heeft|gaat|kan|kunt|wilt|wilt|mag|zal|moet|vond|had|was)',
        r'\b(bent|hebt|heeft|gaat|kunt|wilt|mag|zal|moet|had|was)\s+\bu\b',
        r'^[Uu]\b\s+', # Start of line 'U ...' (could be object if it's a short command, but usually subject)
    ]
    
    for pat in subject_patterns:
        if re.search(pat, text, re.IGNORECASE):
            return True
    return False

with open('data/analysis/all-dialogue.jsonl', 'r') as f:
    for line in f:
        data = json.loads(line)
        if data.get('episode') == 'E10':
            nl = data.get('dutch', '')
            if is_subject_u(nl):
                print(f"{data['speaker']} | {data['sheet']} | EN: {data['english']} | NL: {nl}")
