import { marked } from "marked";

interface Props {
  source: string;
}

export const Markdown = ({ source }: Props) => (
  <article className="markdown" dangerouslySetInnerHTML={{ __html: marked.parse(source, { async: false }) }} />
);
