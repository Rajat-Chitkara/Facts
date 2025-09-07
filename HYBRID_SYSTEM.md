# Hybrid Data System Documentation

## Overview

Your facts website now uses a **hybrid data system** that combines the benefits of static JSON files (for shared data) with localStorage (for user preferences and admin changes).

## How It Works

### 🗂️ Data Sources

1. **JSON Files** (`/data/` directory)
   - `facts.json` - All approved facts that everyone sees
   - `categories.json` - Category definitions with colors and descriptions
   - `submissions.json` - Pending fact submissions
   - `blog-posts.json` - All published blog posts that everyone sees

2. **Local Storage**
   - User preferences (bookmarks, likes, dislikes)
   - Admin temporary changes (before deployment)
   - Backward compatibility with existing data

### 🔄 Data Flow

```
JSON Files (Shared)    → App → Local Storage (Personal)
├─ facts.json          ↓      ├─ User preferences
├─ blog-posts.json     ↓      └─ Admin changes (temp)
└─ categories.json     ↓
                 User Experience
```

## For Admins

### Making Changes Live for Everyone

1. **Add/Edit Facts or Blog Posts** through the admin interface
2. **Go to JSON Manager** tab in admin dashboard
3. **Download/Copy** the generated JSON files
4. **Replace** `data/facts.json` and `data/blog-posts.json` with the new content
5. **Deploy** your changes

### Admin Workflow

```
Admin Changes → Temporary localStorage → JSON Export → Repository Update → Live for All
```

## File Structure

```
data/
├── facts.json          # Main facts database
├── categories.json     # Category definitions  
├── submissions.json    # Pending submissions
└── blog-posts.json     # Blog posts database

lib/
├── json-data.ts       # JSON file management
├── data.ts           # Hybrid data functions
└── types.ts          # Enhanced type definitions

components/admin/
└── json-manager.tsx   # Admin interface for JSON export
```

## Benefits

✅ **Shared Data**: Everyone sees the same facts after deployment  
✅ **No Database Costs**: Static JSON files, no external dependencies  
✅ **Version Control**: All data changes tracked in Git  
✅ **Fast Performance**: Static files load quickly  
✅ **User Preferences**: Bookmarks and likes remain personal  
✅ **Admin Preview**: Test changes before making them live  
✅ **Backup Ready**: Data is in your repository  

## Key Features

### Enhanced Structures
```typescript
interface Fact {
  id: string
  text: string
  category: string
  verified?: boolean      // NEW: Verification status
  source?: string         // NEW: Fact source
  tags?: string[]        // NEW: Searchable tags
  submittedBy?: string
  createdAt?: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string
  published: boolean
  createdAt: string
  updatedAt?: string
  tags?: string[]        // NEW: Blog post tags
  author?: string        // NEW: Author information
}
```

### Hybrid Functions

**Facts:**
- `getStoredFacts()` - Async function that tries JSON first, falls back to localStorage
- `getStoredFactsSync()` - Sync version for immediate data needs
- `exportFactsJSON()` - Generate deployable JSON from current data
- `clearFactsCache()` - Reset to fresh JSON data

**Blog Posts:**
- `getStoredBlogPosts()` - Async function that tries JSON first, falls back to localStorage
- `getStoredBlogPostsSync()` - Sync version for immediate data needs
- `getPublishedBlogPosts()` - Get only published posts (async)
- `getBlogPostBySlug()` - Find post by URL slug (async)
- `exportBlogPostsJSON()` - Generate deployable JSON from current data
- `clearBlogCache()` - Reset to fresh JSON data

## Migration Notes

The system is backward compatible:
- Existing localStorage data still works
- Components gracefully fall back to sync versions
- All user preferences are preserved
- Admin can preview changes before deployment

## Security

- Admin authentication remains the same
- JSON files are read-only for users
- Admin changes are isolated until deployment
- No sensitive data in JSON files

---

**Ready to go!** Your facts are now managed through a robust hybrid system that gives you the best of both worlds.
