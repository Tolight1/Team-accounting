import { useStore } from './store/useStore';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Statistics from './components/Statistics';
import MemberManager from './components/MemberManager';
import CategoryManager from './components/CategoryManager';
import ProjectManager from './components/ProjectManager';
import './App.css';

function ProjectSelector() {
  const projects = useStore((s) => s.projects);
  const currentProjectId = useStore((s) => s.currentProjectId);
  const setCurrentProject = useStore((s) => s.setCurrentProject);

  return (
    <div className="project-selector">
      <label>当前项目：</label>
      {projects.length === 0 ? (
        <span className="hint">暂无项目，请在「管理」中创建</span>
      ) : (
        <select
          value={currentProjectId ?? ''}
          onChange={(e) => setCurrentProject(e.target.value || null)}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

function TabBar() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const currentProjectId = useStore((s) => s.currentProjectId);

  const tabs = [
    { key: 'expenses' as const, label: '记账', disabled: false },
    { key: 'statistics' as const, label: '统计', disabled: !currentProjectId },
    { key: 'manage' as const, label: '管理', disabled: false },
  ];

  return (
    <nav className="tab-bar">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`tab-btn${activeTab === t.key ? ' active' : ''}`}
          onClick={() => setActiveTab(t.key)}
          disabled={t.disabled}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}

function NoProject() {
  return (
    <div className="card">
      <p className="empty-text">
        请先创建一个项目，然后添加成员并开始记账
      </p>
    </div>
  );
}

export default function App() {
  const activeTab = useStore((s) => s.activeTab);
  const currentProjectId = useStore((s) => s.currentProjectId);

  return (
    <div className="app">
      <header className="header">
        <h1>团队记账</h1>
        <ProjectSelector />
      </header>

      <TabBar />

      <main className="main">
        {activeTab === 'expenses' &&
          (currentProjectId ? (
            <>
              <ExpenseForm />
              <ExpenseList />
            </>
          ) : (
            <NoProject />
          ))}

        {activeTab === 'statistics' && <Statistics />}

        {activeTab === 'manage' && (
          <div className="manage-grid">
            <ProjectManager />
            <MemberManager />
            <CategoryManager />
          </div>
        )}
      </main>
    </div>
  );
}
