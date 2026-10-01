const $ = selector => document.querySelector(selector);
const statusNode = $('#admin-status');
const say = message => { statusNode.textContent = message; };
async function api(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}
function node(tag, text) { const el = document.createElement(tag); el.textContent = text; return el; }
function action(label, handler) { const button = document.createElement('button'); button.type = 'button'; button.className = 'btn-secondary'; button.textContent = label; button.addEventListener('click', handler); return button; }
async function refresh() {
  const [projects, messages] = await Promise.all([api('/api/projects'), api('/api/admin/messages')]);
  const projectList = $('#project-list'); projectList.replaceChildren();
  projects.forEach(project => { const item = document.createElement('article'); item.append(node('strong', project.title), node('p', project.description)); item.append(action('Delete project', async () => { if (!confirm('Remove this project?')) return; try { await api('/api/admin/projects/' + encodeURIComponent(project.id), { method: 'DELETE' }); await refresh(); say('Project deleted.'); } catch (e) { say(e.message); } })); projectList.append(item); });
  const messageList = $('#message-list'); messageList.replaceChildren();
  messages.forEach(message => { const item = document.createElement('article'); item.append(node('strong', message.subject + ' — ' + message.name), node('p', message.email + ' · ' + new Date(message.createdAt).toLocaleString()), node('p', message.message)); item.append(action('Delete message', async () => { try { await api('/api/admin/messages/' + encodeURIComponent(message.id), { method: 'DELETE' }); await refresh(); } catch (e) { say(e.message); } })); messageList.append(item); });
}
async function showDashboard() { try { await api('/api/admin/me'); $('#login-panel').hidden = true; $('#dashboard').hidden = false; await refresh(); } catch { $('#login-panel').hidden = false; $('#dashboard').hidden = true; } }
$('#login-form').addEventListener('submit', async event => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); try { await api('/api/admin/login', { method: 'POST', body: JSON.stringify(data) }); event.currentTarget.reset(); say('Signed in.'); await showDashboard(); } catch (e) { say(e.message); } });
$('#logout').addEventListener('click', async () => { try { await api('/api/admin/logout', { method: 'POST' }); say('Signed out.'); } finally { await showDashboard(); } });
$('#project-form').addEventListener('submit', async event => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget)); data.technologies = data.technologies.split(',').map(x => x.trim()).filter(Boolean); try { await api('/api/admin/projects', { method: 'POST', body: JSON.stringify(data) }); event.currentTarget.reset(); say('Project published.'); await refresh(); } catch (e) { say(e.message); } });
showDashboard();