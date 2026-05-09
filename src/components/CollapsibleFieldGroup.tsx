import { useId, useState, type ReactNode } from 'react';

interface CollapsibleFieldGroupProps {
  title: string;
  children: ReactNode;
}

export function CollapsibleFieldGroup({
  title,
  children,
}: CollapsibleFieldGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="collapsible-field-group span-two">
      <button
        className="collapsible-field-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="collapsible-field-icon" aria-hidden="true">
          {isOpen ? '⌃' : '⌄'}
        </span>
        <span>{title}</span>
      </button>
      {isOpen ? (
        <div id={contentId} className="collapsible-field-content">
          {children}
        </div>
      ) : null}
    </div>
  );
}
