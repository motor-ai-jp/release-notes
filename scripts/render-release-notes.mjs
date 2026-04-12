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
  // Deduplicate by version (keep the first = newest by published_at)
  const seen = new Map();
  for (const r of releases) {
    const version = r.tag_name.replace(/^.+-(?=v)/, "");
    if (!seen.has(version)) {
      seen.set(version, r);
    }
  }
  const uniqueReleases = [...seen.values()];

  releasesHtml = uniqueReleases
    .map((r) => {
      const version = r.tag_name.replace(/^.+-(?=v)/, "");
      const tag = escapeHtml(version);
      const date = new Date(r.published_at).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      // Strip Build Info section and leading "# Release Notes vX.X.X" heading from body
      const cleanBody = (r.body || "")
        .replace(/---\s*\n##\s*Build Info[\s\S]*$/, "")
        .replace(/^#\s*Release Notes\s+v[\d.]+\s*\n*/i, "")
        .replace(/^チャネル:\s*\S+\s*\n*/m, "")
        .trim();
      const body = cleanBody ? marked.parse(cleanBody) : "";

      return `<article class="release">
      <div class="release-header">
        <h2 class="release-tag">${tag}</h2>
        <span class="release-meta">${date}</span>
      </div>
      <div class="release-body">${body}</div>
    </article>`;
    })
    .join("\n");
}

const html = template.replace("<!-- RELEASES -->", releasesHtml);

writeFileSync("_site/index.html", html, "utf8");
console.log(
  `Rendered ${uniqueReleases.length} unique release(s) from ${releases.length} total to _site/index.html`
);
