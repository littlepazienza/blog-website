# Local Admin Testing Setup Script
Write-Host "🧪 Setting up local admin testing environment..." -ForegroundColor Green

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Desktop is not running. Please start Docker Desktop first." -ForegroundColor Red
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

# Start MongoDB container
Write-Host "Starting MongoDB container..." -ForegroundColor Yellow
$mongoExists = docker ps -a --filter "name=local-mongo" --format "{{.Names}}"
if ($mongoExists -eq "local-mongo") {
    Write-Host "MongoDB container exists, starting it..." -ForegroundColor Yellow
    docker start local-mongo
} else {
    Write-Host "Creating new MongoDB container..." -ForegroundColor Yellow
    docker run -d --name local-mongo -p 27017:27017 mongo:latest
}

# Wait for MongoDB to be ready
Write-Host "Waiting for MongoDB to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Add test data
Write-Host "Adding test blog posts..." -ForegroundColor Yellow
$testData = @"
use ienza-tech
db.blogs.deleteMany({_id: {`$regex: '^test'}})
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
    "story": "# Test Blog 2\n\n## Testing Admin Features\n\nThis post tests the admin management interface:\n\n\`\`\`javascript\nconsole.log('Admin system works!');\n\`\`\`\n\n> This is a blockquote for testing.",
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
print("✅ Test data added successfully!")
"@

$testData | docker exec -i local-mongo mongosh --quiet

Write-Host "✅ MongoDB setup complete!" -ForegroundColor Green

# Instructions for next steps
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start blog-server:" -ForegroundColor White
Write-Host "   cd Dev/blog-server" -ForegroundColor Gray
Write-Host "   `$env:MONGO_URI='mongodb://localhost:27017/ienza-tech'" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start Angular dev server (in new terminal):" -ForegroundColor White
Write-Host "   cd Dev/blog-website" -ForegroundColor Gray
Write-Host "   ng serve" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test admin system:" -ForegroundColor White
Write-Host "   http://localhost:4200/admin/login" -ForegroundColor Gray
Write-Host "   Password: admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "🧹 To cleanup later:" -ForegroundColor Yellow
Write-Host "   docker stop local-mongo && docker rm local-mongo" -ForegroundColor Gray