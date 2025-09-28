# Local Admin Testing Setup

## 🧪 Complete Local Testing Environment

### Prerequisites:
- Docker Desktop (for MongoDB)
- Node.js (for blog-server and Angular)

### Step 1: Start MongoDB
```bash
# Start Docker Desktop first, then:
docker run -d --name local-mongo -p 27017:27017 mongo:latest

# Verify it's running:
docker ps
```

### Step 2: Add Test Blog Posts
```bash
# Connect to MongoDB and add test data:
docker exec -it local-mongo mongosh

# In MongoDB shell:
use ienza-tech

# Add test blog posts:
db.blogs.insertMany([
  {
    "_id": "test1",
    "title": "Test Blog Post 1",
    "text": "This is a test description for the first blog post",
    "story": "# Test Blog 1\n\nThis is **markdown content** for testing the admin interface.\n\n- Feature 1\n- Feature 2\n- Feature 3",
    "date": "2025-09-28",
    "tags": ["test", "admin", "markdown"],
    "files": []
  },
  {
    "_id": "test2", 
    "title": "Test Blog Post 2",
    "text": "This is a test description for the second blog post",
    "story": "# Test Blog 2\n\n## Testing Admin Features\n\nThis post tests the admin management interface:\n\n```javascript\nconsole.log('Admin system works!');\n```\n\n> This is a blockquote for testing.",
    "date": "2025-09-27",
    "tags": ["admin", "testing", "features"],
    "files": []
  },
  {
    "_id": "test3",
    "title": "Test Blog Post 3", 
    "text": "This is a test description for the third blog post",
    "story": "# Test Blog 3\n\n### Password Protection Test\n\nThis post will test:\n- Login functionality\n- Edit capabilities\n- Delete confirmation\n\n**Admin system integration test!** 🚀",
    "date": "2025-09-26",
    "tags": ["security", "auth", "admin"],
    "files": []
  }
])

# Verify data was added:
db.blogs.find({}).pretty()

# Exit MongoDB:
exit
```

### Step 3: Start Blog-Server Locally
```bash
cd Dev/blog-server

# Set environment for local MongoDB:
$env:MONGO_URI="mongodb://localhost:27017/ienza-tech"
$env:ADMIN_PASSWORD="admin123"

# Install dependencies (if needed):
npm install

# Start the server:
npm start
```

Server should start on: http://localhost:34001

### Step 4: Start Angular Dev Server
```bash
cd Dev/blog-website

# Install dependencies (if needed):
npm install

# Start dev server:
ng serve

# Or if Angular CLI not in PATH:
npx ng serve
```

Angular should start on: http://localhost:4200

### Step 5: Test Admin Workflow

#### 🔐 Login Test:
1. Visit: http://localhost:4200/admin/login
2. Enter password: `admin123`
3. Should redirect to admin dashboard

#### 📋 Management Test:
1. Visit: http://localhost:4200/admin/manage
2. Should see 3 test blog posts
3. Try editing one (should open editor with content)
4. Try deleting one (should show confirmation modal)

#### ✨ Create Test:
1. Visit: http://localhost:4200/admin/editor
2. Create a new blog post
3. Verify it appears in /admin/manage

#### 🔒 Auth Test:
1. Try visiting /admin/editor without login (should redirect)
2. Login, then try all admin pages (should work)
3. Clear localStorage and try admin pages (should redirect)

### Cleanup:
```bash
# Stop and remove MongoDB container:
docker stop local-mongo
docker rm local-mongo
```

### Expected Test Results:
✅ Login protection works on all admin routes
✅ Blog management interface loads test posts  
✅ Edit functionality opens editor with existing content
✅ Delete functionality shows confirmation and removes posts
✅ Create functionality adds new posts to database
✅ Logout clears authentication and redirects