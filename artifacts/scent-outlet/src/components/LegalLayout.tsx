import { useEffect } from 'react';

export interface LegalSection {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
}

export interface LegalContent {
  title: string;
  updated?: string;
  sections: LegalSection[];
}

export function LegalLayout({ content }: { content: LegalContent }) {
  // Footer links land mid-page otherwise — wouter keeps scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [content.title]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-3xl">
      <h1 className="font-serif text-3xl md:text-5xl font-medium text-foreground mb-3">
        {content.title}
      </h1>
      {content.updated && (
        <p className="text-sm text-muted-foreground mb-10">{content.updated}</p>
      )}
      <div className="space-y-10">
        {content.sections.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="font-serif text-2xl font-medium text-foreground mb-3">
                {section.heading}
              </h2>
            )}
            {section.paragraphs?.map((paragraph, j) => (
              <p key={j} className="text-muted-foreground leading-relaxed mb-3">
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
                {section.list.map((item, k) => (
                  <li key={k}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
