import { Component, OnInit } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-admin-editor',
  templateUrl: './admin-editor.component.html',
  styleUrls: ['./admin-editor.component.css']
})
export class AdminEditorComponent implements OnInit {
  markdownContent: string = '';
  htmlPreview: SafeHtml = '';
  
  // Form fields for blog post metadata
  postTitle: string = '';
  postText: string = '';
  postTags: string = '';
  postStory: string = 'general';
  
  // Submit state
  isSubmitting: boolean = false;
  submitMessage: string = '';
  submitSuccess: boolean = false;

  constructor(private sanitizer: DomSanitizer, private httpService: HttpService) { 
    // Configure marked for safe HTML rendering (older API)
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
        this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(rawHtml as string);
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

  /**
   * Submit the blog post to the backend
   */
  onSubmitPost(): void {
    // Prevent double submission
    if (this.isSubmitting) return;
    
    // Validate required fields
    if (!this.postTitle.trim() || !this.markdownContent.trim()) {
      this.submitMessage = 'Title and content are required!';
      this.submitSuccess = false;
      return;
    }
    
    this.isSubmitting = true;
    this.submitMessage = '';
    
    // Prepare blog data for submission
    const blogData = {
      title: this.postTitle.trim(),
      text: this.postText.trim() || '', // Description (optional)
      story: this.markdownContent.trim(), // Markdown content
      tags: this.postTags.trim(), // Comma-separated tags
      // Let the backend auto-generate the date
    };
    
    console.log('[AdminEditor] Submitting blog post:', {
      title: blogData.title,
      textLength: blogData.text.length,
      storyLength: blogData.story.length,
      tags: blogData.tags
    });
    
    // Call the HTTP service
    this.httpService.createBlogPost(blogData).subscribe({
      next: (response) => {
        console.log('[AdminEditor] Blog post created successfully!', response);
        this.submitMessage = `🎉 Blog post "${blogData.title}" published successfully! ID: ${response.id}`;
        this.submitSuccess = true;
        this.isSubmitting = false;
        
        // Clear form after successful submission
        setTimeout(() => {
          this.clearForm();
        }, 2000);
      },
      error: (error) => {
        console.error('[AdminEditor] Failed to create blog post:', error);
        this.submitMessage = `❌ Failed to publish blog post. ${error.error?.error || 'Please try again.'}`;
        this.submitSuccess = false;
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Clear the form after successful submission
   */
  private clearForm(): void {
    this.postTitle = '';
    this.postText = '';
    this.postTags = '';
    this.postStory = 'general';
    this.markdownContent = '';
    this.htmlPreview = '';
    this.submitMessage = '';
  }
}
