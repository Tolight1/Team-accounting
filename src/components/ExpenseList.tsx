import { useStore } from '../store/useStore';

export default function ExpenseList() {
  const currentProjectId = useStore((s) => s.currentProjectId);
  const expenses = useStore((s) => s.expenses);
  const categories = useStore((s) => s.categories);
  const members = useStore((s) => s.members);
  const removeExpense = useStore((s) => s.removeExpense);

  const projectExpenses = expenses
    .filter((e) => e.projectId === currentProjectId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  const catMap = new Map(categories.map((c) => [c.id, c.name]));
  const memberMap = new Map(members.map((m) => [m.id, m.name]));

  if (!currentProjectId) return null;

  return (
    <section className="card">
      <h3>支出记录 ({projectExpenses.length})</h3>
      {projectExpenses.length === 0 ? (
        <p className="empty-text">当前项目还没有支出记录</p>
      ) : (
        <div className="expense-table-wrap">
          <table className="expense-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>金额</th>
                <th>分类</th>
                <th>参与人</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {projectExpenses.map((e) => (
                <tr key={e.id}>
                  <td>{e.date}</td>
                  <td className="amount-col">{e.amount.toFixed(2)}</td>
                  <td>{catMap.get(e.categoryId) ?? '未知'}</td>
                  <td>
                    {e.participantIds
                      .map((pid) => memberMap.get(pid))
                      .filter(Boolean)
                      .join('、') || '—'}
                  </td>
                  <td>{e.description || '—'}</td>
                  <td>
                    <button
                      className="btn-danger-sm"
                      onClick={() => removeExpense(e.id)}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
