import { useState, useEffect, useRef } from 'react';
import { blogService } from '@/services/blog.service';
import type { Blog } from '@/types';

interface BlogDetail extends Blog {
  content?: string;
  metadata?: any;
}

interface BlogDetailProps {
  blogId: number;
}

interface TocItem {
  id: string;
  text: string;
}

export default function BlogDetail({ blogId }: BlogDetailProps) {
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId || blogId <= 0) {
        setError('Invalid blog ID');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const blogData = await blogService.getBlogById(blogId);
        setBlog(blogData);
      } catch (err: any) {
        console.error('Error fetching blog:', err);
        setError('Failed to load article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  // Format date helper
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Generate slug from text
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Extract H2 headings from HTML string and add IDs
  const processContent = (htmlContent: string): { processedHtml: string; toc: TocItem[] } => {
    if (!htmlContent) return { processedHtml: '', toc: [] };

    // Use regex to find H2 tags and extract their content
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    const toc: TocItem[] = [];
    let match;
    let processedHtml = htmlContent;
    let index = 0;

    // First pass: collect all H2 headings
    const h2Matches: Array<{ fullMatch: string; content: string; index: number }> = [];
    while ((match = h2Regex.exec(htmlContent)) !== null) {
      const content = match[1].replace(/<[^>]*>/g, ''); // Strip HTML tags from content
      h2Matches.push({ fullMatch: match[0], content, index: index++ });
    }

    // Second pass: replace H2 tags with IDs
    h2Matches.forEach(({ fullMatch, content, index: idx }) => {
      const text = content.trim();
      const slug = generateSlug(text) || `heading-${idx + 1}`;
      const id = slug;
      
      // Replace the H2 tag with one that has an ID
      const newH2 = fullMatch.replace(/<h2([^>]*)>/, `<h2$1 id="${id}">`);
      processedHtml = processedHtml.replace(fullMatch, newH2);
      
      toc.push({ id, text });
    });

    return { processedHtml, toc };
  };

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for fixed header if any
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Process content when blog is loaded
  useEffect(() => {
    if (blog?.content) {
      const { processedHtml, toc } = processContent(blog.content);
      setTocItems(toc);
      
      // Set processed HTML after a small delay to ensure DOM is ready
      if (contentRef.current) {
        contentRef.current.innerHTML = processedHtml;
      }
    }
  }, [blog?.content]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
            <svg
              className="animate-spin h-8 w-8 text-primary-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "The article you're looking for doesn't exist or has been removed."}
            </p>
            <a
              href="/article"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Back to Articles
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Article Header - Title First */}
      <section className="py-8 md:py-12 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Articles Link */}
          <a
            href="/article"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 text-sm font-medium mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </a>

          {/* Article Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Article Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            {blog.published_at && (
              <time dateTime={blog.published_at} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(blog.published_at)}
              </time>
            )}
            {blog.created_at && !blog.published_at && (
              <time dateTime={blog.created_at} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(blog.created_at)}
              </time>
            )}
          </div>

          {/* Article Excerpt */}
          {blog.excerpt && (
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {blog.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Featured Image */}
      {blog.featured_image && (
        <section className="bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content with Table of Contents */}
      <article className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents - Sidebar */}
            {tocItems.length > 0 && (
              <aside className="lg:w-64 flex-shrink-0">
                <div className="sticky top-8">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                      Table of Contents
                    </h2>
                    <nav className="space-y-2">
                      {tocItems.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(item.id);
                          }}
                          className="block text-sm text-gray-700 hover:text-primary-600 hover:font-medium transition-colors py-1 border-l-2 border-transparent hover:border-primary-600 pl-3"
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>
            )}

            {/* Article Content */}
            <div className="flex-1 min-w-0">
              <div className="prose prose-lg prose-slate max-w-none">
                {blog.content ? (
                  <div ref={contentRef} />
                ) : (
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    <p>{blog.excerpt}</p>
                    <p className="text-gray-500 italic">Full content coming soon...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Footer Section */}
      <section className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="/article"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Articles
          </a>
        </div>
      </section>
    </>
  );
}

