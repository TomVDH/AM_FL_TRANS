# CSV Components Architecture

## 🏗️ **Component Separation Overview**

The CSV functionality has been separated into dedicated, modular components for better maintainability and reusability:

```
CSV System Architecture:
├── Scripts/
│   ├── excel-to-json.js      # Main processing (JSON + CSV output)
│   └── excel-to-csv.js       # Dedicated CSV processing
├── Utils/
│   └── csvProcessor.ts       # CSV processing utilities
├── Components/
│   ├── CSVConsultationPanel.tsx    # Main consultation interface
│   └── CSVQuickSuggestions.tsx     # Compact suggestion display
├── Hooks/
│   └── useCSVConsultation.ts       # CSV consultation logic
└── API/
    └── csv-data/route.ts           # CSV data serving endpoint
```

## 📦 **Component Details**

### **Processing Scripts**

#### **`scripts/excel-to-csv.js`** - Dedicated CSV Processor
- **Purpose**: Pure CSV processing without JSON dependencies
- **Features**: Optimized CSV format, metadata handling, batch processing
- **Usage**: `npm run csv-only` or `node scripts/excel-to-csv.js`
- **Output**: `data/csv/[filename].csv`

#### **`scripts/excel-to-json.js`** - Combined Processor  
- **Purpose**: Maintains dual JSON+CSV output for backward compatibility
- **Features**: Uses modular CSV processor for consistency
- **Usage**: `npm run excel-to-json` (generates both formats)

### **Utility Modules**

#### **`src/utils/csvProcessor.ts`** - CSV Processing Utilities
```typescript
// Key functions:
escapeCSVValue(value, config)     // Safe CSV value escaping
parseCSVContent(content)          // Parse CSV to structured data
searchCSVData(data, term)         // Search functionality
generateCSVStats(data)            // Analytics and statistics
```

**Features:**
- ✅ **Type-safe** CSV processing with TypeScript
- ✅ **Configurable** delimiters, encoding, headers
- ✅ **Robust parsing** with proper quote handling
- ✅ **Search optimization** with filtering and ranking
- ✅ **Statistics generation** for analytics

### **React Components**

#### **`src/components/CSVConsultationPanel.tsx`** - Main Interface
```typescript
interface CSVConsultationPanelProps {
  currentText?: string;              // Auto-consult based on current text
  onSuggestionSelect?: (suggestion: CSVEntry) => void;
  maxSuggestions?: number;           // Limit suggestions
  showFileSelector?: boolean;        // File selection UI
  autoConsult?: boolean;             // Auto-consultation on text change
}
```

**Features:**
- 🔍 **Real-time search** across multiple CSV files
- 📂 **File selection** with batch search capabilities  
- 💡 **Auto-suggestions** based on current translation text
- 🎛️ **Expandable interface** (compact/detailed views)
- 🔧 **Configurable** display and behavior options

#### **`src/components/CSVQuickSuggestions.tsx`** - Compact Suggestions
```typescript
interface CSVQuickSuggestionsProps {
  suggestions: CSVEntry[];           // Suggestion data
  onSelect: (suggestion: CSVEntry) => void;
  maxDisplay?: number;               // Limit displayed suggestions
  compact?: boolean;                 // Layout style
}
```

**Features:**
- ⚡ **Lightning fast** display of top suggestions
- 🎯 **Smart prioritization** (exact matches first)
- 📱 **Compact/detailed** layout options
- 🖱️ **One-click selection** for instant insertion

### **React Hook**

#### **`src/hooks/useCSVConsultation.ts`** - Data Management
```typescript
const {
  availableFiles,           // List of CSV files
  searchResults,           // Current search results
  isLoading,              // Loading state
  loadCSVFile,            // Load specific file
  searchAcrossFiles,      // Multi-file search
  consultForTranslation,  // Get suggestions for text
  clearCache             // Memory management
} = useCSVConsultation();
```

**Features:**
- 💾 **Intelligent caching** for performance
- 🔄 **Lazy loading** of CSV files
- 🔍 **Cross-file searching** with result aggregation
- 📊 **Performance monitoring** and memory management

### **API Endpoint**

#### **`src/app/api/csv-data/route.ts`** - Data Serving
```bash
# Load specific CSV file
GET /api/csv-data?file=1_asses.masses_E1Proxy.csv&format=json

# Search across files
POST /api/csv-data
{
  "files": ["1_asses.masses_E1Proxy.csv"],
  "searchTerm": "Big Ass",
  "maxResults": 50
}
```

## 🔧 **NPM Scripts**

```bash
# Process both JSON and CSV (backward compatible)
npm run excel-to-json

# Process CSV only (optimized, faster)
npm run excel-to-csv
npm run csv-only              # Alias for excel-to-csv

# Test processing
npm run test-readme
```

## 🚀 **Usage Examples**

### **Basic CSV Consultation**
```tsx
import CSVConsultationPanel from './components/CSVConsultationPanel';

function TranslationScreen() {
  const [currentText, setCurrentText] = useState('');
  
  const handleSuggestionSelect = (suggestion: CSVEntry) => {
    setCurrentText(suggestion.dutch);
  };
  
  return (
    <div>
      <textarea value={currentText} onChange={e => setCurrentText(e.target.value)} />
      <CSVConsultationPanel 
        currentText={currentText}
        onSuggestionSelect={handleSuggestionSelect}
        autoConsult={true}
      />
    </div>
  );
}
```

### **Quick Suggestions Only**
```tsx
import CSVQuickSuggestions from './components/CSVQuickSuggestions';
import { useCSVConsultation } from './hooks/useCSVConsultation';

function QuickAssist({ currentText }: { currentText: string }) {
  const { consultForTranslation } = useCSVConsultation();
  const [suggestions, setSuggestions] = useState<CSVEntry[]>([]);
  
  useEffect(() => {
    consultForTranslation(currentText).then(setSuggestions);
  }, [currentText]);
  
  return (
    <CSVQuickSuggestions 
      suggestions={suggestions}
      onSelect={handleSelect}
      compact={true}
      maxDisplay={3}
    />
  );
}
```

### **Direct CSV Processing**
```typescript
import { parseCSVContent, searchCSVData } from './utils/csvProcessor';

// Parse CSV file
const csvData = parseCSVContent(csvFileContent);

// Search for translations
const matches = searchCSVData(csvData, "Big Ass", "Character", 10);

// Generate statistics
const stats = generateCSVStats(csvData);
console.log(`${stats.totalRows} entries, ${stats.translationCoverage}% translated`);
```

## 🔄 **Migration Benefits**

### **Before (Monolithic)**
- ❌ Mixed JSON/CSV logic in single script
- ❌ Tightly coupled processing and UI
- ❌ Limited reusability
- ❌ Hard to test individual components

### **After (Modular)**
- ✅ **Separation of concerns** - each component has single responsibility
- ✅ **Reusable utilities** - CSV processing logic shared across app
- ✅ **Testable components** - isolated units for testing
- ✅ **Performance optimized** - dedicated CSV processor
- ✅ **Maintainable architecture** - clear dependencies and interfaces
- ✅ **Extensible design** - easy to add new CSV features

## 🎯 **Next Steps for Integration**

1. **Add to existing TranslationHelper**: Import `CSVQuickSuggestions` for instant assistance
2. **Expand search capabilities**: Use `CSVConsultationPanel` for advanced searches
3. **Performance monitoring**: Implement analytics using CSV statistics
4. **Custom processing**: Extend `csvProcessor.ts` utilities for specific needs

The modular architecture makes it easy to integrate CSV consultation anywhere in the app while maintaining performance and code quality.