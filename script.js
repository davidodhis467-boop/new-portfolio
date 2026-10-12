const githubUser = 'davidodhis467-boop';
const projectsEl = document.querySelector('#projects');
const repoCountEl = document.querySelector('#repo-count');
let repositories = [];
let activeFilter = 'all';

const fallbackRepos = [
  {name:'Gruv-Motors-Ltd', description:'A Python-powered product experience for a modern mobility business.', language:'Python', html_url:`https://github.com/${githubUser}/Gruv-Motors-Ltd`, stargazers_count:1, pushed_at:'2026-08-06T20:18:48Z'},
  {name:'Sadurp-Transport-System', description:'Transport operations, routes and systems thinking in one working project.', language:'Python', html_url:`https://github.com/${githubUser}/Sadurp-Transport-System`, stargazers_count:1, pushed_at:'2026-08-06T20:01:53Z'},
  {name:'Quack', description:'A playful web build exploring interaction, layout and browser-first thinking.', language:'HTML', html_url:`https://github.com/${githubUser}/Quack`, stargazers_count:1, pushed_at:'2026-07-25T21:17:23Z'},
  {name:'tic-tac-toe', description:'A compact JavaScript game focused on clean state and immediate feedback.', language:'JavaScript', html_url:`https://github.com/${githubUser}/tic-tac-toe`, stargazers_count:1, pushed_at:'2026-07-25T20:42:03Z'}
];

function languageName(repo){ return repo.language || 'Code'; }
function formatDate(date){ try{return new Intl.DateTimeFormat('en',{month:'short',year:'numeric'}).format(new Date(date));}catch{return 'Live';} }
function repoCard(repo){
  const language = languageName(repo);
  const description = repo.description || 'A hands-on build from David’s public engineering notebook.';
  return `<article class="project-card reveal visible" data-language="${language}">
    <div class="project-top"><span class="project-lang">${language}</span><a class="project-arrow" href="${repo.html_url}" target="_blank" rel="noreferrer" aria-label="Open ${repo.name} on GitHub">↗</a></div>
    <h3>${repo.name.replaceAll('-', ' ')}</h3><p>${description}</p>
    <div class="project-bottom"><span>Updated ${formatDate(repo.pushed_at)}</span><span>★ ${repo.stargazers_count || 0}</span></div>
  </article>`;
}
function renderProjects(){
  const filtered = activeFilter === 'all' ? repositories : repositories.filter(repo => languageName(repo).toLowerCase() === activeFilter.toLowerCase());
  projectsEl.innerHTML = filtered.length ? filtered.map(repoCard).join('') : '<div class="loading-card">No projects in this filter yet — explore the full GitHub profile ↗</div>';
  observeReveals();
}
async function loadRepos(){
  try{
    const response = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=100`, {headers:{Accept:'application/vnd.github+json'}});
    if(!response.ok) throw new Error('GitHub unavailable');
    repositories = (await response.json()).filter(repo => !repo.fork);
  }catch(error){ repositories = fallbackRepos; }
  repoCountEl.textContent = repositories.length;
  renderProjects();
}

document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter-button').forEach(item => item.classList.remove('active'));
  button.classList.add('active'); activeFilter = button.dataset.filter; renderProjects();
}));

document.querySelector('#year').textContent = new Date().getFullYear();
const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', event => { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; }, {passive:true});
function observeReveals(){
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); }), {threshold:.12});
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}
observeReveals();
loadRepos();
