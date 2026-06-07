let tasks = JSON.parse(localStorage.getItem('gh-tasks') || '[]');
  let filter = 'all';

  function save() {
    localStorage.setItem('gh-tasks', JSON.stringify(tasks));
  }

  function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (!text) return;

    tasks.unshift({ id: Date.now(), text, done: false });
    save();
    render();
    input.value = '';
    input.focus();
  }

  function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    save();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
  }

  function clearDone() {
    tasks = tasks.filter(t => !t.done);
    save();
    render();
  }

  function getFiltered() {
    if (filter === 'active') return tasks.filter(t => !t.done);
    if (filter === 'done')   return tasks.filter(t => t.done);
    return tasks;
  }

  function render() {
    const list = document.getElementById('task-list');
    const filtered = getFiltered();
    const total = tasks.length;
    const done  = tasks.filter(t => t.done).length;

    document.getElementById('stats').innerHTML =
      total === 0
        ? '0 tarefas'
        : `<span>${done}</span> de <span>${total}</span> concluída${total !== 1 ? 's' : ''}`;

    if (filtered.length === 0) {
      const msgs = {
        all:    ['📋', 'nenhuma tarefa ainda', 'adicione algo acima!'],
        active: ['✅', 'tudo concluído!', 'ótimo trabalho!'],
        done:   ['🔲', 'nenhuma tarefa concluída', 'hora de trabalhar!']
      };
      const [icon, line1, line2] = msgs[filter];
      list.innerHTML = `<div class="empty"><div class="empty-icon">${icon}</div>${line1}<br/>${line2}</div>`;
      return;
    }

    list.innerHTML = filtered.map(task => `
      <div class="task-item ${task.done ? 'done' : ''}">
        <div class="task-check ${task.done ? 'checked' : ''}" onclick="toggleTask(${task.id})">
          ${task.done ? '✓' : ''}
        </div>
        <div class="task-text">${escapeHtml(task.text)}</div>
        <button class="task-delete" onclick="deleteTask(${task.id})" title="Remover">✕</button>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  document.getElementById('add-btn').addEventListener('click', addTask);

  document.getElementById('task-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  document.getElementById('clear-btn').addEventListener('click', clearDone);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  });

  render();
