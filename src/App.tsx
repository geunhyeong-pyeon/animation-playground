import { useSyncExternalStore } from "react";
import { CHAPTERS } from "./chapters";
import { Markdown } from "./components/Markdown";

const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

const useHashChapterId = () =>
  useSyncExternalStore(subscribeHash, () => window.location.hash.replace("#/", ""), () => "");

export const App = () => {
  const hashChapterId = useHashChapterId();
  const chapterIndex = Math.max(0, CHAPTERS.findIndex(chapter => chapter.id === hashChapterId));
  const chapter = CHAPTERS[chapterIndex];
  const previous = CHAPTERS[chapterIndex - 1];
  const next = CHAPTERS[chapterIndex + 1];

  return (
    <div className="layout">
      <nav className="sidebar">
        <a className="brand" href="#/transition">
          Animation Playground
        </a>
        <p className="brand-sub">기초부터 FLIP까지, 직접 만져 보며 익히는 웹 애니메이션</p>
        <ul>
          {CHAPTERS.map(item => (
            <li key={item.id}>
              <a href={`#/${item.id}`} className={item.id === chapter.id ? "is-active" : ""}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
        <a className="repo-link" href="https://github.com/geunhyeong-pyeon/animation-playground">
          GitHub ↗
        </a>
      </nav>
      <main className="content" key={chapter.id}>
        <Markdown source={chapter.doc} />
        <chapter.Demo />
        <footer className="pager">
          {previous && <a href={`#/${previous.id}`}>← {previous.title}</a>}
          {next && <a className="pager-next" href={`#/${next.id}`}>{next.title} →</a>}
        </footer>
      </main>
    </div>
  );
};
