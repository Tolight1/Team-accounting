import { useMemo } from 'react';
import { useStore } from '../store/useStore';

export default function Statistics() {
  const currentProjectId = useStore((s) => s.currentProjectId);
  const expenses = useStore((s) => s.expenses);
  const categories = useStore((s) => s.categories);
  const members = useStore((s) => s.members);

  const stats = useMemo(() => {
    if (!currentProjectId) return null;

    const projectExpenses = expenses.filter(
      (e) => e.projectId === currentProjectId,
    );
    if (projectExpenses.length === 0) return { total: 0, byCategory: [], byPerson: [] };

    const catMap = new Map(categories.map((c) => [c.id, c.name]));
    const memberMap = new Map(members.map((m) => [m.id, m.name]));

    const total = projectExpenses.reduce((sum, e) => sum + e.amount, 0);

    // By category
    const catTotals = new Map<string, { name: string; total: number; count: number }>();
    for (const e of projectExpenses) {
      const cid = e.categoryId;
      const cur = catTotals.get(cid) ?? {
        name: catMap.get(cid) ?? '未知',
        total: 0,
        count: 0,
      };
      cur.total += e.amount;
      cur.count += 1;
      catTotals.set(cid, cur);
    }
    const byCategory = [...catTotals.entries()]
      .map(([, v]) => v)
      .sort((a, b) => b.total - a.total);

    // Per person (split equally among participants)
    const personTotals = new Map<
      string,
      { name: string; total: number; count: number }
    >();
    for (const e of projectExpenses) {
      if (e.participantIds.length === 0) continue;
      const share = e.amount / e.participantIds.length;
      for (const pid of e.participantIds) {
        const cur = personTotals.get(pid) ?? {
          name: memberMap.get(pid) ?? '未知',
          total: 0,
          count: 0,
        };
        cur.total += share;
        cur.count += 1;
        personTotals.set(pid, cur);
      }
    }
    const byPerson = [...personTotals.entries()]
      .map(([, v]) => v)
      .sort((a, b) => b.total - a.total);

    return { total, byCategory, byPerson };
  }, [currentProjectId, expenses, categories, members]);

  if (!currentProjectId) {
    return (
      <div className="card">
        <p className="empty-text">请先选择或创建一个项目</p>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="card">
        <p className="empty-text">当前项目暂无支出记录</p>
      </div>
    );
  }

  return (
    <div className="stats">
      {/* Total */}
      <div className="card stats-card total-card">
        <div className="stats-label">总消费</div>
        <div className="stats-value">{stats.total.toFixed(2)}</div>
      </div>

      {/* Per person ranking */}
      <div className="card">
        <h3>个人消费排行</h3>
        <div className="person-ranking">
          {stats.byPerson.map((p, idx) => (
            <div
              key={p.name}
              className={`rank-item ${idx === 0 ? 'rank-first' : ''}`}
            >
              <span className="rank-num">#{idx + 1}</span>
              <span className="rank-name">{p.name}</span>
              <span className="rank-bar-wrap">
                <span
                  className="rank-bar"
                  style={{
                    width: `${(p.total / stats.byPerson[0].total) * 100}%`,
                  }}
                />
              </span>
              <span className="rank-amount">{p.total.toFixed(2)}</span>
              <span className="rank-count">{p.count}笔</span>
            </div>
          ))}
        </div>
        <div className="person-avg">
          人均：{(stats.total / stats.byPerson.length).toFixed(2)}
        </div>
      </div>

      {/* By category */}
      <div className="card">
        <h3>分类统计</h3>
        <div className="category-stats">
          {stats.byCategory.map((c) => (
            <div key={c.name} className="cat-row">
              <span className="cat-name">{c.name}</span>
              <span className="cat-bar-wrap">
                <span
                  className="cat-bar"
                  style={{
                    width: `${(c.total / stats.total) * 100}%`,
                  }}
                />
              </span>
              <span className="cat-amount">{c.total.toFixed(2)}</span>
              <span className="cat-pct">
                {((c.total / stats.total) * 100).toFixed(1)}%
              </span>
              <span className="cat-count">{c.count}笔</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
