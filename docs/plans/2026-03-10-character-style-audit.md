# Character Style Audit & Codex Editor Enhancement

## Problem
1. The CodexEditor on Screen 1 only displays `dialogueStyle` (English) — it has no field for `dutchDialogueStyle`. This means Dutch translation styles are invisible in the UI even though they exist in the JSON and are consumed by the AI suggest API.
2. 38 characters have Dutch styles that need review and potential revision (e.g., Smart Ass was just updated from heavy Flemish to snooty ABN Dutch).

## Part 1: Codex Editor Enhancement

### 1A. Add `dutchDialogueStyle` to the CodexEditor interface
- Add `dutchDialogueStyle?: string` to the `CodexEntry` interface in `CodexEditor.tsx`
- Add a second textarea/input field below "Dialogue Style" labeled "Dutch Translation Style"
- Wire up display, edit, and save for the new field

### 1B. Make the style fields expandable
- The `dialogueStyle` and `dutchDialogueStyle` fields contain multi-paragraph markdown-like text
- Currently rendered as a single-line `<input>` — should be a `<textarea>` with expand/collapse
- Show a preview/summary when collapsed, full text when expanded

### 1C. Import/Export support
- Ensure CSV/JSON import picks up `dutchDialogueStyle` column
- Ensure export includes it
- The `handleSave` function needs to persist `dutchDialogueStyle` back to the JSON

### 1D. API route support
- Verify `/api/codex` route reads and writes `dutchDialogueStyle`
- Ensure round-trip: load from JSON → edit in UI → save back to JSON preserves the field

## Part 2: Character Style Review (37 characters)

Go through each character with a Dutch style, one by one:
1. Present the current English style + Dutch style + bio
2. Discuss with user whether the voice/register/Flemish density is correct
3. Amend the codex entry based on feedback

### Characters to review (alphabetical):
1. Ass Handler Melvin / Zakkenzeuler Zeno
2. Ass Handler Wedgie / Zakkenzeulster Zita
3. Bad Ass / Stoere Ezel
4. Big Ass / Mega Ezel
5. Child Joey / Luukske Vermeulen
6. Cole-Machine / Piet-Machine
7. Decrepit Sign / Verlept Bord
8. DJ Dope Ass / DJ Lijpe Ezel
9. Golden Ass / Gouden Ezel
10. Grandma Kulan / Grootmoe Vermeulen
11. Greedy Ass / Inhalige Ezel
12. Happy Ass / Blije Ezel
13. Hard Ass / Bikkeharde Ezel
14. Hasty Ass / Haastige Ezel
15. Haw / HAA
16. Hee / HIE
17. Helpful Ass / Hulpvaardige Ezel
18. Kick Ass / Stamp Ezel
19. Lazy Ass / Luie Ezel
20. Miner Jenny / Mijnwerker Jenny
21. Mme. Derriere / Mevr. Derrière
22. Mr. Butte / Mr. Vanscheetvelde
23. Nice Ass / Lieve Ezel
24. Old Ass / Oude Ezel
25. Proper Ass / Keurige Ezel
26. Radio Host Marcos / DJ Tom
27. Ringmaster Rico / Circusdirecteur Baptiste
28. Sad Ass / Triestige Ezel
29. Sick Ass / Snot Ezel
30. Slow Ass / Slome Ezel
31. Sturdy Ass / Stevige Ezel
32. The Masses / De Massa
33. Thirsty Ass / Beschonken Ezel
34. Tight Ass / Strakke Ezel
35. Trusty Ass / Trouwe Ezel
36. Welcome Sign / Welkomsbord
37. Zookeeper Rose / Dierendokter Dina

## Part 3: Characters missing styles entirely

After the review, consider which frequently-appearing characters need profiles added:
- Characters with English style but no Dutch style (5): Bleak Ass, Edgy Ass, Foal, Resentful Ass, Skinny Ass
- High-frequency unnamed characters that appear often in scripts

## Execution Order
1. Part 1 first (fix the editor so styles are visible/editable in UI)
2. Part 2 in a separate interactive session (one-by-one review with user)
3. Part 3 as needed
