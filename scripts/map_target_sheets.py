import json

EPISODE_MAP = {
    "E0": "0_asses.masses_Manager+Intermissions+E0Proxy.xlsx",
    "E1": "1_asses.masses_E1Proxy.xlsx",
    "E2": "2_asses.masses_E2Proxy.xlsx",
    "E3": "3_asses.masses_E3Proxy.xlsx",
    "E4": "4_asses.masses_E4Proxy.xlsx",
    "E5": "5_asses.masses_E5Proxy.xlsx",
    "E6": "6_asses.masses_E6Proxy.xlsx",
    "E7": "7_asses.masses_E7Proxy.xlsx",
    "E8": "8_asses.masses_E8Proxy.xlsx",
    "E9": "9_asses.masses_E9Proxy.xlsx",
    "E10": "10_asses.masses_E10Proxy.xlsx"
}

target_sheets = set()

with open('data/analysis/all-dialogue.jsonl', 'r') as f:
    for line in f:
        data = json.loads(line)
        if 'Muilegem' in data.get('dutch', ''):
            file_name = EPISODE_MAP.get(data['episode'], "unknown")
            target_sheets.add((file_name, data['sheet']))

print("| Excel File | Target Sheet |")
print("|---|---|")
for file_name, sheet in sorted(list(target_sheets)):
    print(f"| {file_name} | {sheet} |")
