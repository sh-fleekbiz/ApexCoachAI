# Phase 4 Visual Guide - Knowledge Base Admin Page

## 🎯 Overview

The Knowledge Base admin page is the **final piece** of the ApexCoachAI frontend enhancement project. It provides a comprehensive interface for managing training documents that power the RAG (Retrieval Augmented Generation) system.

---

## 🏗️ Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│ 📚 Knowledge Base                    [📤 Upload Document]  │
│ Manage training documents for RAG-powered AI responses      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │📚 Total  │  │✅ Trained│  │🔄Training│  │⏳Not Yet │  │
│  │   45     │  │    32    │  │    5     │  │    8     │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🔍 Search...           [All Status ▼]                      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [✓] Title              Type    Status    Program   Actions│
│  ─────────────────────────────────────────────────────────  │
│  [ ] 📄 Sales Training  PDF     ✅Trained  Sales     🔄 🗑️ │
│  [ ] 📝 Onboarding Doc  DOCX    🔄Training Program1  🔄 🗑️ │
│  [✓] 📋 FAQ Document    TXT     ⏳Not Yet  None     🔄 🗑️ │
│  [ ] 🔗 Company Website URL     ✅Trained  None     🔄 🗑️ │
│  [✓] 📄 Product Guide   PDF     ❌Failed   Support  🔄 🗑️ │
│                                                              │
└─────────────────────────────────────────────────────────────┘

When documents selected (✓):
┌─────────────────────────────────────────────────────────────┐
│ 3 documents selected                                         │
│          [🔄 Retrain All] [📚 Assign] [🗑️ Delete] [✕ Clear]│
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Breakdown

### 1. Header Section

```
┌─────────────────────────────────────────────────┐
│ 📚 Knowledge Base         [📤 Upload Document] │
│ Manage training documents...                    │
└─────────────────────────────────────────────────┘
```

- **Title**: "Knowledge Base"
- **Subtitle**: Brief description
- **Action Button**: Opens upload modal

### 2. Stats Dashboard (4 Cards)

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│📚 Total  │ │✅ Trained│ │🔄Training│ │⏳Not Yet │
│   45     │ │    32    │ │    5     │ │    8     │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

- Real-time counts
- Hover effects
- Color-coded icons

### 3. Filters Bar

```
┌────────────────────────────────────────────────┐
│ 🔍 Search documents...    [All Status ▼]      │
└────────────────────────────────────────────────┘
```

- **Search**: Real-time filtering by title
- **Status Filter**: All, Trained, Training, Not Trained, Failed

### 4. Bulk Actions Bar (Conditional)

```
┌──────────────────────────────────────────────────┐
│ 3 documents selected                              │
│   [🔄 Retrain] [📚 Assign] [🗑️ Delete] [✕ Clear]│
└──────────────────────────────────────────────────┘
```

- Only shows when documents selected
- Sticky positioning
- Blue gradient background

### 5. Documents Table

```
┌────────────────────────────────────────────────────────┐
│ [✓] │ Title           │ Type │ Status    │ Actions    │
├─────┼─────────────────┼──────┼───────────┼────────────┤
│ [ ] │ 📄 Sales Guide  │ PDF  │ ✅Trained │ 🔄 🗑️     │
│ [✓] │ 📝 Onboarding   │ DOCX │ 🔄Training│ 🔄 🗑️     │
│ [ ] │ 📋 FAQ Sheet    │ TXT  │ ⏳Not Yet │ 🔄 🗑️     │
└────────────────────────────────────────────────────────┘
```

- **Checkbox**: Select for bulk actions
- **Title**: Icon + document name
- **Type Badge**: PDF, DOCX, TXT, URL
- **Status Badge**: Colored with icon
- **Program Badge**: Linked program (or "—")
- **Actions**: Retrain, Delete buttons

---

## 🎭 Document Status Badges

### ✅ Trained (Green)

```
┌────────────┐
│ ✅ Trained │  #10b981 (green)
└────────────┘
```

- Document ready for use
- Successfully indexed in Azure AI Search

### 🔄 Training (Blue, Animated)

```
┌─────────────┐
│ 🔄 Training │  #3b82f6 (blue) + spinning icon
└─────────────┘
```

- Currently being processed
- Icon spins continuously
- Polls for updates every 5 seconds

### ⏳ Not Trained (Gray)

```
┌──────────────┐
│ ⏳ Not Trained│  #6b7280 (gray)
└──────────────┘
```

- Uploaded but not trained yet
- Waiting for training job

### ❌ Failed (Red)

```
┌──────────┐
│ ❌ Failed│  #ef4444 (red)
└──────────┘
```

- Training failed
- User can retry with retrain button

---

## 📤 Upload Document Modal

### Tab 1: File Upload

```
┌─────────────────────────────────────────┐
│  Upload Document                    [✕] │
├─────────────────────────────────────────┤
│  [📤 File Upload] | [🔗 URL]            │
├─────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐ │
│  │         📁                          │ │
│  │  Drag and drop files here,         │ │
│  │  or click to browse                │ │
│  │                                     │ │
│  │  Supports: PDF, DOCX, TXT (10MB)   │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Selected Files:                         │
│  ├─ 📄 sales-guide.pdf (2.5 MB)    [✕] │
│  └─ 📝 onboarding.docx (1.2 MB)    [✕] │
│                                          │
│  Title *: [Sales Training Materials]    │
│  Description: [Optional description...]  │
│  Program: [Select program ▼]            │
│  ☑ Auto-train after upload              │
│                                          │
│  [Cancel]              [Upload]         │
└─────────────────────────────────────────┘
```

### Tab 2: URL Upload

```
┌─────────────────────────────────────────┐
│  Upload Document                    [✕] │
├─────────────────────────────────────────┤
│  [📤 File Upload] | [🔗 URL]            │
├─────────────────────────────────────────┤
│                                          │
│  URL *: [https://example.com/doc]       │
│                                          │
│  Title *: [Example Document]            │
│  Description: [Optional...]             │
│  Program: [Select program ▼]            │
│  ☑ Auto-train after upload              │
│                                          │
│  [Cancel]              [Upload]         │
└─────────────────────────────────────────┘
```

**Features**:

- Drag-and-drop file area
- Multiple file selection
- File validation (type, size)
- Auto-fill title from filename/URL
- Program assignment
- Auto-train checkbox
- Upload progress bar

---

## 🎬 User Flows

### Flow 1: First-Time User (Empty State)

```
1. Navigate to /admin/knowledge-base
   ↓
2. See empty state with book icon
   ↓
3. Click "Upload Your First Document"
   ↓
4. Upload modal opens
   ↓
5. Select file or enter URL
   ↓
6. Fill details and submit
   ↓
7. Document appears in table with status
```

### Flow 2: Upload Multiple Documents

```
1. Click "📤 Upload Document" button
   ↓
2. File Upload tab selected
   ↓
3. Drag multiple PDF files into drop zone
   ↓
4. Files appear in list below
   ↓
5. Auto-filled title from first file
   ↓
6. Select program (optional)
   ↓
7. Click Upload
   ↓
8. Progress bar shows 0% → 100%
   ↓
9. Modal closes, documents appear in table
   ↓
10. Success message displayed
```

### Flow 3: Bulk Retrain Documents

```
1. Select checkboxes for multiple documents
   ↓
2. Bulk actions bar appears at top
   ↓
3. Click "🔄 Retrain All"
   ↓
4. Documents status changes to "🔄 Training"
   ↓
5. Page polls every 5 seconds for updates
   ↓
6. Status updates to "✅ Trained" when complete
```

### Flow 4: Search and Filter

```
1. Type "sales" in search box
   ↓
2. Table filters to matching documents
   ↓
3. Select "Training" from status dropdown
   ↓
4. Only documents in training state shown
   ↓
5. Click "Clear Filters" to reset
```

### Flow 5: Delete with Confirmation

```
1. Select 3 documents with checkboxes
   ↓
2. Click "🗑️ Delete All" in bulk bar
   ↓
3. Confirmation modal appears:
   "Delete 3 Documents?
    This action cannot be undone..."
   ↓
4. Click "Delete 3 Documents" to confirm
   ↓
5. Documents removed from table
   ↓
6. Success message: "3 documents deleted"
```

---

## 🎨 Design System

### Colors

```
Primary Blue:    #3b82f6 → #2563eb (gradient)
Success Green:   #10b981
Warning Blue:    #3b82f6
Info Gray:       #6b7280
Danger Red:      #ef4444

Backgrounds:
  White:         #ffffff
  Light Gray:    #f9fafb
  Border:        #e5e7eb
  Selected:      #eff6ff (light blue)
```

### Typography

```
Title:           2rem, 700 weight
Subtitle:        1rem, 400 weight
Card Value:      2rem, 700 weight
Table Header:    0.875rem, 600 weight, uppercase
Table Cell:      0.875rem, 400 weight
Badge:           0.75rem, 600 weight
```

### Spacing

```
Container:       2rem padding
Section Gap:     1.5rem
Card Gap:        1rem
Button Padding:  0.75rem 1.5rem
Table Cell:      1rem padding
```

### Shadows

```
Card:            0 1px 3px rgba(0,0,0,0.1)
Card Hover:      0 4px 12px rgba(0,0,0,0.1)
Button:          0 4px 12px rgba(59,130,246,0.3)
Modal:           0 20px 40px rgba(0,0,0,0.2)
```

### Animations

```
Spin (Training): 1.5s linear infinite rotation
Slide Down:      0.3s ease (bulk bar)
Fade In:         0.2s ease (modals)
Scale In:        0.2s ease (dialogs)
Hover Lift:      translateY(-2px)
```

---

## 📱 Responsive Breakpoints

### Desktop (> 1024px)

- 4-column stats grid
- Full table visible
- All labels shown on badges
- Hover effects enabled

### Tablet (768px - 1024px)

- 2-column stats grid
- Table starts horizontal scrolling
- All features visible

### Mobile (< 768px)

- 1-column stats grid
- Table requires horizontal scroll
- Badge labels hidden (icons only)
- Bulk actions wrap to multiple rows
- Upload modal full screen

---

## 🔄 Real-Time Updates

### Polling Logic

```javascript
// Poll every 5 seconds if any document is training
useEffect(() => {
  const interval = setInterval(() => {
    if (documents.some((doc) => doc.training_status === 'training')) {
      loadDocuments(); // Refresh data
    }
  }, 5000);

  return () => clearInterval(interval);
}, [documents]);
```

### Status Transitions

```
not_trained → training → trained
                      ↓
                    failed
```

### Visual Feedback

- **Spinner**: Animated 🔄 icon during training
- **Color Change**: Gray → Blue → Green
- **Toast Messages**: Success/error notifications
- **Progress Bar**: During upload

---

## ✅ Accessibility

- **Keyboard Navigation**: Tab through all controls
- **ARIA Labels**: Buttons have descriptive labels
- **Screen Readers**: Table headers properly marked
- **Focus States**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant
- **Alt Text**: Icons have tooltips

---

## 🎯 Key Features Summary

1. ✅ **Stats Dashboard** - Real-time document counts
2. ✅ **Search & Filter** - Find documents quickly
3. ✅ **Upload Modal** - File + URL support
4. ✅ **Status Badges** - Color-coded training status
5. ✅ **Bulk Actions** - Select multiple, act once
6. ✅ **Real-Time Updates** - Automatic polling
7. ✅ **Empty State** - Encouraging first upload
8. ✅ **Responsive Design** - Works on all devices
9. ✅ **Error Handling** - User-friendly messages
10. ✅ **Professional UI** - Matches MetaPrompts page

---

## 🚀 Ready for Launch!

The Knowledge Base page is **production-ready** with:

- Comprehensive functionality
- Professional design
- Responsive layout
- Error handling
- Real-time updates
- Accessibility features
- Mobile support

**Deploy and enjoy!** 🎊
