import csv
import os
import json

file_path = 'data/csv/11_asses.masses_NonCSVBasedTranslations.csv'
rules = ['Machine', 'Machines', 'Oom', 'Nonkel', 'Boerderij', 'ezel', 'hoe-hoe', 'U ', ' u ', 'Uw ', ' uw ', 'Muilegem', 'Ass Power']

audit_results = []

with open(file_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader, 1):
        # Based on earlier scans, EN is usually col 5 (index 4) or col 6 (index 5)
        # and NL is usually col 7 (index 6) or col 8 (index 7)
        # Let's be safe and check all columns for the NL string "Muilegem" or others.
        
        found_rule = False
        content_str = " ".join(row)
        for r in rules:
            if r.lower() in content_str.lower():
                found_rule = True
                break
        
        if found_rule:
            audit_results.append({
                "row": idx,
                "content": row
            })

print(json.dumps(audit_results))
