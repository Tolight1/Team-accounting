import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function MemberManager() {
  const members = useStore((s) => s.members);
  const addMember = useStore((s) => s.addMember);
  const removeMember = useStore((s) => s.removeMember);
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (members.some((m) => m.name === trimmed)) return;
    addMember(trimmed);
    setName('');
  };

  return (
    <section className="card">
      <h3>成员管理</h3>
      <div className="inline-form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="成员姓名"
        />
        <button onClick={handleAdd} disabled={!name.trim()}>
          添加
        </button>
      </div>
      {members.length === 0 ? (
        <p className="empty-text">暂无成员，请添加</p>
      ) : (
        <ul className="tag-list">
          {members.map((m) => (
            <li key={m.id} className="tag-item">
              <span>{m.name}</span>
              <button
                className="btn-icon"
                onClick={() => removeMember(m.id)}
                title="移除"
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
