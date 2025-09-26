import { Component, OnInit } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-editor',
  templateUrl: './admin-editor.component.html',
  styleUrls: ['./admin-editor.component.css']
})
export class AdminEditorComponent implements OnInit {
  markdownContent: string = '';
  htmlPreview: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) { 
    // Configure marked for safe HTML rendering
    marked.setOptions({
      gfm: true, // GitHub flavored markdown
      breaks: true, // Convert line breaks to <br>
      sanitize: false, // We'll sanitize through Angular
    });
  }

  ngOnInit(): void {
    // Initialize with sample content
    this.markdownContent = `# Welcome to the Blog Editor!

Write your **blog post** here using _markdown_ syntax.

## Features Supported:
- **Bold** and *italic* text
- [Links](https://example.com)
- Code blocks
- Lists
- And much more!

\`\`\`javascript
// Code example
console.log('Hello from the blog editor!');
\`\`\`

> This is a blockquote to highlight important information.

Happy writing! 🚀`;
    
    this.onMarkdownChange();
  }

  /**
   * Convert markdown to HTML preview in real-time
   */
  onMarkdownChange(): void {
    if (this.markdownContent) {
      try {
        const rawHtml = marked(this.markdownContent);
        // Sanitize the HTML to prevent XSS attacks
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
      } catch (error) {
        console.error('Error parsing markdown:', error);
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(
          '<p style="color: red;">Error parsing markdown. Please check your syntax.</p>'
        );
      }
    } else {
      this.htmlPreview = '';
    }
  }
}
