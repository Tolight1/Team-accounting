import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function ProjectManager() {
  const projects = useStore((s) => s.projects);
  const addProject = useStore((s) => s.addProject);
  const removeProject = useStore((s) => s.removeProject);
  const setCurrentProject = useStore((s) => s.setCurrentProject);
  const currentProjectId = useStore((s) => s.currentProjectId);
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addProject(trimmed);
    setName('');
  };

  return (
    <section className="card">
      <h3>项目管理</h3>
      <div className="inline-form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="项目名称（如：青岛团建）"
        />
        <button onClick={handleAdd} disabled={!name.trim()}>
          新建
        </button>
      </div>
      {projects.length === 0 ? (
        <p className="empty-text">暂无项目，请新建</p>
      ) : (
        <ul className="project-list">
          {projects.map((p) => (
            <li
              key={p.id}
              className={`project-item${p.id === currentProjectId ? ' active' : ''}`}
            >
              <button
                className="project-name"
                onClick={() => setCurrentProject(p.id)}
              >
                {p.name}
                {p.id === currentProjectId && <span className="badge">当前</span>}
              </button>
              <button
                className="btn-icon"
                onClick={() => removeProject(p.id)}
                title="删除项目"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
