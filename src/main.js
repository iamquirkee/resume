import '@fontsource/outfit/300.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import './styles/tokens.css';
import './styles/screen.css';
import './styles/print.css';

import base from './data/resume.json';

// Optional, gitignored override (e.g. private phone/email): src/data/contact.local.json
const local = Object.values(import.meta.glob('./data/*.local.json', { eager: true, import: 'default' }));
const data = Object.assign({}, base, ...local);

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ENTITIES[c]);

const dates = (r) => `${esc(r.start)} – ${esc(r.end)}`;
const list = (items, fn, cls) => `<ul class="${cls}">${items.map(fn).join('')}</ul>`;

const sidebar = (d) => `
  <aside class="sidebar">
    <header class="intro">
      <h1 class="name">${esc(d.name)}</h1>
      <p class="headline">${esc(d.headline)} · ${esc(d.location)}</p>
      ${d.summary.map((p) => `<p class="summary">${esc(p)}</p>`).join('')}
    </header>

    <section class="block">
      <h2 class="block-title">Contact</h2>
      ${list(
        d.contact,
        (c) => `<li><span class="muted">${esc(c.label)}</span> <a href="${esc(c.href)}">${esc(c.value)}</a></li>`,
        'contact'
      )}
    </section>

    ${d.skills
      .map(
        (s) => `
      <section class="block skill-group"${s.tone ? ` style="--tone: var(--c-${esc(s.tone)})"` : ''}>
        <h2 class="block-title">${esc(s.group)}</h2>
        ${list(s.items, (i) => `<li>${esc(i)}</li>`, 'tags')}
      </section>`
      )
      .join('')}

    <section class="block">
      <h2 class="block-title">Languages</h2>
      ${list(d.languages, (l) => `<li>${esc(l.name)} <span class="muted">${esc(l.level)}</span></li>`, 'plain')}
    </section>

    <section class="block">
      <h2 class="block-title">Education</h2>
      ${d.education
        .map(
          (e) =>
            `<p class="plain"><strong>${esc(e.school)}</strong><br />${esc(e.qualification)}<br /><span class="muted">${esc(e.dates)}</span></p>`
        )
        .join('')}
    </section>

    <section class="block">
      <h2 class="block-title">Awards</h2>
      ${list(
        d.awards,
        (a) => `
          <li class="award">
            <strong>${esc(a.title)}</strong><br />
            ${esc(a.project)}<br />
            <span class="muted">${esc(a.issuer)} · ${esc(a.date)}</span>
          </li>`,
        'plain'
      )}
    </section>
  </aside>`;

const role = (r) => `
  <article class="role">
    <p class="role-meta">${dates(r)}${r.location ? ` · ${esc(r.location)}` : ''}</p>
    <h3 class="company">${esc(r.company)}</h3>
    <p class="role-title">${esc(r.role)}</p>
    ${list(r.bullets, (b) => `<li>${esc(b)}</li>`, 'bullets')}
  </article>`;

const earlier = (items) => `
  <section class="earlier">
    <h2 class="section-title">Earlier experience</h2>
    ${list(
      items,
      (r) => `
        <li>
          <p class="earlier-head"><strong>${esc(r.company)}</strong> · ${esc(r.role)} <span class="muted">${dates(r)}</span></p>
          <p>${esc(r.summary)}</p>
        </li>`,
      'earlier-list'
    )}
  </section>`;

document.getElementById('resume').innerHTML = `
  ${sidebar(data)}
  <div class="content">
    <h2 class="section-title">Experience</h2>
    ${data.experience.map(role).join('')}
    ${earlier(data.earlier)}
  </div>`;

// Signals the PDF script that rendering (and fonts) are done.
document.fonts.ready.then(() => {
  document.documentElement.dataset.ready = 'true';
});
