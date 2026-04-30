import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function CategoryManager() {
  const categories = useStore((s) => s.categories);
  const addCategory = useStore((s) => s.addCategory);
  const removeCategory = useStore((s) => s.removeCategory);
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.name === trimmed)) return;
    addCategory(trimmed);
    setName('');
  };

  return (
    <section className="card">
      <h3>分类管理</h3>
      <div className="inline-form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="分类名称（如：机票）"
        />
        <button onClick={handleAdd} disabled={!name.trim()}>
          添加
        </button>
      </div>
      <ul className="tag-list">
        {categories.map((c) => (
          <li key={c.id} className="tag-item">
            <span>{c.name}</span>
            <button
              className="btn-icon"
              onClick={() => removeCategory(c.id)}
              title="删除分类"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
