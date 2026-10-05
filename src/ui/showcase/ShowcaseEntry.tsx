import type { ReactNode } from "react";

/**
 * ShowcaseEntry (M4-T5).
 *
 * A thin, dumb card that standardizes a showcase entry: it renders the
 * component name, an optional description, the component's props signature (as
 * a monospace list) and the representative demo markup passed as children. It
 * contains no business logic — it only renders its props and children.
 */
export interface ShowcaseEntryProps {
  /** The component name shown as the entry heading. */
  name: string;
  /** The component's props signature, shown as a monospace list. */
  props: string;
  /** Optional short description of the showcased component. */
  description?: string;
  /** The representative-state demo markup for the showcased component. */
  children: ReactNode;
}

export function ShowcaseEntry({
  name,
  props,
  description,
  children,
}: ShowcaseEntryProps) {
  return (
    <section
      data-showcase={name}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      )}

      <dl className="mt-3 text-sm">
        <dt className="text-slate-500">Props</dt>
        <dd className="mt-0.5 font-mono text-xs text-slate-500">{props}</dd>
      </dl>

      <div className="mt-4">{children}</div>
    </section>
  );
}
