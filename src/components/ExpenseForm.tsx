import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function ExpenseForm() {
  const members = useStore((s) => s.members);
  const categories = useStore((s) => s.categories);
  const currentProjectId = useStore((s) => s.currentProjectId);
  const addExpense = useStore((s) => s.addExpense);

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  if (!currentProjectId) return null;

  const handleSubmit = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    if (!categoryId) return;
    if (participantIds.length === 0) return;

    addExpense({
      projectId: currentProjectId,
      amount: val,
      categoryId,
      participantIds,
      description: description.trim() || undefined,
    });

    setAmount('');
    setParticipantIds([]);
    setDescription('');
  };

  const toggleParticipant = (id: string) => {
    setParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const canSubmit =
    parseFloat(amount) > 0 && categoryId && participantIds.length > 0;

  return (
    <section className="card">
      <h3>记一笔</h3>
      <div className="expense-form">
        <div className="form-row">
          <label>金额</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="form-row">
          <label>分类</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>参与人</label>
          <div className="checkbox-group">
            {members.length === 0 ? (
              <span className="hint">请先在"管理"中添加成员</span>
            ) : (
              members.map((m) => (
                <label key={m.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={participantIds.includes(m.id)}
                    onChange={() => toggleParticipant(m.id)}
                  />
                  {m.name}
                </label>
              ))
            )}
          </div>
        </div>

        <div className="form-row">
          <label>备注</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="可选（如：午餐）"
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit} disabled={!canSubmit}>
          添加支出
        </button>
      </div>
    </section>
  );
}
