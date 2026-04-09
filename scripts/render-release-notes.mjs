import { readFileSync, writeFileSync } from "node:fs";
import { marked } from "marked";

marked.setOptions({ gfm: true });

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const repoName = process.env.REPO_NAME || "unknown/repo";
const releases = JSON.parse(readFileSync("_site/releases.json", "utf8"));
const template = readFileSync("templates/index.html", "utf8");

// Sort by published_at descending
releases.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

let releasesHtml;

if (releases.length === 0) {
  releasesHtml = '<div class="empty-message">まだリリースはありません。</div>';
} else {
  releasesHtml = releases
    .map((r) => {
      const tag = escapeHtml(r.tag_name);
      const name = escapeHtml(r.name || r.tag_name);
      const date = new Date(r.published_at).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const body = r.body ? marked.parse(r.body) : "";
      const url = escapeHtml(r.html_url);

      return `<article class="release">
      <div class="release-header">
        <h2 class="release-tag">${tag}</h2>
        <span class="release-name">${name}</span>
      </div>
      <div class="release-meta">
        <time>${date}</time>
        &middot;
        <a href="${url}" target="_blank" rel="noopener noreferrer">GitHub で見る</a>
      </div>
      <div class="release-body">${body}</div>
    </article>`;
    })
    .join("\n");
}

const html = template
  .replaceAll("<!-- REPO_NAME -->", escapeHtml(repoName))
  .replace("<!-- RELEASES -->", releasesHtml);

writeFileSync("_site/index.html", html, "utf8");
console.log(`Rendered ${releases.length} release(s) to _site/index.html`);
