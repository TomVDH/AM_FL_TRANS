# Translation Screen Architecture (Screen 2)

## 🏗️ **Current 3-Block Stack Structure**

Based on the existing `TranslationHelper.tsx`, the translation screen has this vertical stack layout:

```
┌─────────────────────────────────────────────┐
│              BLOCK 1: TRANSLATOR            │
│  ┌─────────────────┬──────────────────────┐  │
│  │  Source Text    │  Current Translation │  │
│  │  (with auto-    │  (textarea with      │  │
│  │   highlighting) │   suggestions)       │  │
│  └─────────────────┴──────────────────────┘  │
│        Progress Bar & Navigation              │
└─────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│        BLOCK 2: JSON/SPECIAL SETTINGS       │
│  ┌─────────────────┬──────────────────────┐  │
│  │  JSON Data      │  Display Mode        │  │
│  │  Viewer         │  Controls           │  │
│  │  (file/sheet    │  (Eye/Gamepad/etc)   │  │
│  │   selection)    │                      │  │
│  └─────────────────┴──────────────────────┘  │
└─────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│         BLOCK 3: TRANSLATED OUTPUT          │
│  ┌─────────────────────────────────────────┐  │
│  │     All Translations Display            │  │
│  │     (with row info & export)            │  │
│  └─────────────────────────────────────────┘  │
│          Progress Stats (Current/Done/%)      │
└─────────────────────────────────────────────┘
```

## 🔧 **CSV Integration Strategy**

### **Option 1: Sidebar Integration (Recommended)**
Add CSV consultation as a **collapsible sidebar** that works alongside all blocks:

```
┌─────────────────────────────┬──────────────────────┐
│                             │                      │
│                             │   CSV CONSULTATION   │
│        BLOCK 1:             │      SIDEBAR         │
│      TRANSLATOR             │ ┌──────────────────┐ │
│                             │ │ Quick Suggestions│ │
│  ┌────────────┬───────────┐ │ │                  │ │
│  │Source Text │Translation│ │ │ [Big Ass] →      │ │
│  │(highlight) │(textarea) │ │ │ Grote Moker      │ │
│  └────────────┴───────────┘ │ │                  │ │
│       Progress Bar          │ └──────────────────┘ │
├─────────────────────────────┤ ┌──────────────────┐ │
│                             │ │   File Search    │ │
│        BLOCK 2:             │ │                  │ │
│   JSON/SETTINGS             │ │ [Search Term...] │ │
│                             │ │ ☑ E1Proxy.csv    │ │
│ ┌─────────┬─────────────────┐ │ │ ☑ E2Proxy.csv    │ │
│ │JSON View│Display Controls │ │ │                  │ │
│ └─────────┴─────────────────┘ │ └──────────────────┘ │
├─────────────────────────────┤                      │
│                             │ ┌──────────────────┐ │
│        BLOCK 3:             │ │   Results        │ │
│    TRANSLATED OUTPUT        │ │                  │ │
│                             │ │ 5 matches found  │ │
│ ┌───────────────────────────┐ │ │ [Click to use]   │ │
│ │   All Translations        │ │ │                  │ │
│ └───────────────────────────┘ │ └──────────────────┘ │
│      Progress Stats           │                      │
└─────────────────────────────┴──────────────────────┘
```

### **Option 2: Integrated Block Enhancement**
Enhance existing blocks with CSV consultation features:

```
┌─────────────────────────────────────────────┐
│         ENHANCED BLOCK 1: TRANSLATOR       │
│  ┌─────────────────┬──────────────────────┐  │
│  │  Source Text    │  Current Translation │  │
│  │  (JSON + CSV    │  (with CSV           │  │
│  │   highlighting) │   suggestions)       │  │
│  └─────────────────┴──────────────────────┘  │
│  ┌─────────────────────────────────────────┐  │
│  │         CSV QUICK SUGGESTIONS           │  │
│  │  [Grote Moker] [Logzak] [More...]      │  │
│  └─────────────────────────────────────────┘  │
│        Progress Bar & Navigation              │
└─────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│    ENHANCED BLOCK 2: JSON/CSV SETTINGS      │
│  ┌─────────────────┬──────────────────────┐  │
│  │  JSON Data      │  CSV Consultation    │  │
│  │  Viewer         │  Panel              │  │
│  │  (codex data)   │  (episode data)      │  │
│  └─────────────────┴──────────────────────┘  │
│  ┌─────────────────────────────────────────┐  │
│  │        Display Mode Controls            │  │
│  │  [Eye] [Gamepad] [Highlight] [CSV]     │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│         BLOCK 3: TRANSLATED OUTPUT          │
│  (unchanged - shows completed translations)  │
└─────────────────────────────────────────────┘
```

### **Option 3: Tab-Based Integration**
Add CSV consultation as tabs within existing blocks:

```
┌─────────────────────────────────────────────┐
│              BLOCK 1: TRANSLATOR            │
│                 (unchanged)                  │
└─────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│        BLOCK 2: DATA & SETTINGS             │
│  ┌─────────────────────────────────────────┐  │
│  │  [JSON Data] [CSV Search] [Settings]   │  │  ← Tabs
│  └─────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────┐  │
│  │                                         │  │
│  │         Active Tab Content              │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────┐
│         BLOCK 3: TRANSLATED OUTPUT          │
│                 (unchanged)                  │
└─────────────────────────────────────────────┘
```

## 🎯 **Recommended Implementation: Sidebar + Enhanced Block 1**

### **Why This Approach:**
- ✅ **Non-disruptive**: Doesn't break existing workflow
- ✅ **Always accessible**: CSV suggestions available during translation
- ✅ **Space efficient**: Collapsible sidebar saves screen real estate
- ✅ **Context-aware**: Shows suggestions based on current source text
- ✅ **Scalable**: Can add more consultation tools to sidebar

### **Implementation Plan:**

#### **1. Add CSV Sidebar Toggle**
```tsx
// Add to display mode controls in Block 2
const [showCSVSidebar, setShowCSVSidebar] = useState(false);

// New control button
<button 
  onClick={() => setShowCSVSidebar(!showCSVSidebar)}
  className="..."
  title="CSV Consultation"
>
  📊 CSV
</button>
```

#### **2. Enhance Block 1 with Quick Suggestions**
```tsx
// Add below source text area
{currentText && (
  <CSVQuickSuggestions 
    suggestions={csvSuggestions}
    onSelect={handleCSVSuggestion}
    maxDisplay={3}
    compact={true}
  />
)}
```

#### **3. Add Collapsible Sidebar**
```tsx
// Conditional sidebar rendering
{showCSVSidebar && (
  <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-10">
    <CSVConsultationPanel 
      currentText={sourceTexts[currentIndex]}
      onSuggestionSelect={handleCSVSuggestion}
      autoConsult={true}
    />
  </div>
)}
```

#### **4. Integration Points**
```tsx
const handleCSVSuggestion = (suggestion: CSVEntry) => {
  // Insert Dutch translation into current translation
  setCurrentTranslation(suggestion.dutch);
  
  // Optional: Auto-advance to next item
  if (suggestion.dutch) {
    setTimeout(() => handleSubmit(), 500);
  }
};
```

## 📱 **Responsive Behavior**

### **Desktop (>1024px)**
- **Sidebar**: Fixed right panel (320px wide)
- **Quick Suggestions**: Horizontal row below source text
- **All blocks**: Full width with sidebar overlay

### **Tablet (768-1024px)**
- **Sidebar**: Slide-over panel covering right 60%
- **Quick Suggestions**: Compact horizontal buttons
- **Blocks**: Stack vertically with adjusted width

### **Mobile (<768px)**
- **Sidebar**: Full-width bottom sheet
- **Quick Suggestions**: Single row with scroll
- **Blocks**: Full-width stack

## 🔄 **User Workflow Enhancement**

### **Current Workflow:**
1. Read source text
2. Type translation manually
3. Submit and move to next

### **Enhanced Workflow:**
1. Read source text
2. **See instant CSV suggestions below source**
3. **Click suggestion OR type manually**
4. **Use sidebar for complex searches if needed**
5. Submit and move to next

### **Power User Features:**
- **Keyboard shortcuts**: `Ctrl+1,2,3` for quick suggestion selection
- **Auto-consultation**: Suggestions appear as you type source text
- **Cross-file search**: Search all episodes simultaneously
- **Context filtering**: Filter by character, dialogue type, etc.

This architecture maintains the existing 3-block structure while seamlessly integrating powerful CSV consultation capabilities that enhance rather than disrupt the translation workflow.