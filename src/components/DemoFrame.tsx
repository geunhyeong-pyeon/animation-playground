import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export const DemoFrame = ({ title, description, children }: Props) => (
  <section className="demo">
    <header className="demo-header">
      <span className="demo-badge">Live</span>
      <h3>{title}</h3>
    </header>
    {description && <p className="demo-description">{description}</p>}
    <div className="demo-body">{children}</div>
  </section>
);
