import { useMemo, useState } from "react";
import { getTeamPerformanceModel } from "./teamPerformanceData.js";

const barStyle = (C, color, width) => ({
  height: "100%",
  width: `${width}%`,
  background: color,
  borderRadius: 6,
});

function AnalyticsPanel({ C, MN, title, badge, children }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: "var(--card-radius)", boxShadow: `${C.shadowMd}, inset 0 1px 0 ${C.innerHighlight}`, padding: "var(--card-padding)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{title}</div>
        {badge && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 6, background: C.accentSoft, color: C.accent, fontWeight: 700, fontFamily: MN }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function SummaryGrid({ C, items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 8 }}>
      {items.map((item) => (
        <div key={item.title} style={{ background: C.surfaceAlt, border: `1px solid ${C.borderLight}`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.text, marginBottom: 4 }}>{item.title}</div>
          <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.5 }}>{item.description}</div>
        </div>
      ))}
    </div>
  );
}

export function ExecutiveTeamPerformanceSection({ C, MN, SH, Kpi }) {
  const model = useMemo(() => getTeamPerformanceModel(), []);
  const totals = model.totals;

  return (
    <>
      <SH color={C.orange} badge="ITAM Dashboard history">Historical Workload Summary</SH>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 8, marginBottom: 10 }}>
        <Kpi label="ITAM Refreshes" value={totals.refreshes.toLocaleString()} sub={`${totals.refreshShareOfAll}% of ${totals.totalHistoricalTasks.toLocaleString()} historical tasks`} color={C.accent} />
        <Kpi label="Incidents" value={totals.incidents.toLocaleString()} sub="Historical INC load" color={C.red} />
        <Kpi label="Onboarding" value={totals.onboarding.toLocaleString()} sub="Specialized ownership" color={C.green} />
        <Kpi label="Offboarding" value={totals.offboarding.toLocaleString()} sub="Historical offboarding load" color={C.amber} />
        <Kpi label="Grand Total Tasks" value={totals.grandTotal.toLocaleString()} sub="Refresh + incidents + onboarding + offboarding" color={C.orange} />
        <Kpi label="Refresh YoY Change" value={`${totals.yoyRefreshDeltaPct}%`} sub="2024 to 2025 refresh volume" color={totals.yoyRefreshDeltaPct < 0 ? C.red : C.green} />
        <Kpi label="Active Refresh Core" value={`${totals.activeRefreshCore} techs`} sub="Riley, Devon, Jordan" color={C.cyan} />
        <Kpi label="Specialized Roles" value={totals.specializedRoleCount} sub="Onboarding + offboarding concentration" color={C.purple} />
      </div>
      <AnalyticsPanel C={C} MN={MN} title="Executive Summary" badge={`${model.totalsByTech.length} technicians`}>
        <SummaryGrid C={C} items={model.executiveSummary} />
      </AnalyticsPanel>
    </>
  );
}

export function WorkloadPlannerAnalyticsSection({ C, MN, SH }) {
  const model = useMemo(() => getTeamPerformanceModel(), []);
  const recentTrend = model.teamMonthlySeries.slice(-12);
  const maxTrend = Math.max(1, ...recentTrend.map((item) => Math.max(item.itamTotal, item.allTotal)));
  const maxRefresh = Math.max(1, ...model.totalsByTech.map((item) => item.refreshes));

  return (
    <>
      <SH color={C.cyan} badge="From legacy demo dashboard">Historical Trends and Distribution</SH>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 10 }}>
        <AnalyticsPanel C={C} MN={MN} title="Monthly Team Refresh Volume" badge="Last 12 months">
          {recentTrend.map((item) => (
            <div key={item.month} style={{ marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 10.5, color: C.sub }}>{item.month}</span>
                <span style={{ fontSize: 10, color: C.muted, fontFamily: MN }}>ITAM {item.itamTotal} / All {item.allTotal}{item.rolling3m != null ? ` / 3M ${item.rolling3m}` : ""}</span>
              </div>
              <div style={{ height: 8, background: C.chartGrid, borderRadius: 6, overflow: "hidden", marginBottom: 3 }}>
                <div style={barStyle(C, C.gray, (item.allTotal / maxTrend) * 100)} />
              </div>
              <div style={{ height: 8, background: C.chartGrid, borderRadius: 6, overflow: "hidden" }}>
                <div style={barStyle(C, C.accent, (item.itamTotal / maxTrend) * 100)} />
              </div>
            </div>
          ))}
        </AnalyticsPanel>

        <AnalyticsPanel C={C} MN={MN} title="Refresh Distribution">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 8 }}>
            <div style={{ padding: "8px 10px", border: `1px solid ${C.borderLight}`, borderRadius: 6 }}><div style={{ fontSize: 9, color: C.muted, fontFamily: MN }}>MEAN</div><div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{model.distribution.meanRefreshes}</div></div>
            <div style={{ padding: "8px 10px", border: `1px solid ${C.borderLight}`, borderRadius: 6 }}><div style={{ fontSize: 9, color: C.muted, fontFamily: MN }}>STD DEV</div><div style={{ fontSize: 18, fontWeight: 700, color: C.orange }}>{model.distribution.stdDeviation}</div></div>
            <div style={{ padding: "8px 10px", border: `1px solid ${C.borderLight}`, borderRadius: 6 }}><div style={{ fontSize: 9, color: C.muted, fontFamily: MN }}>CV</div><div style={{ fontSize: 18, fontWeight: 700, color: C.red }}>{model.distribution.coeffVar}%</div></div>
            <div style={{ padding: "8px 10px", border: `1px solid ${C.borderLight}`, borderRadius: 6 }}><div style={{ fontSize: 9, color: C.muted, fontFamily: MN }}>TOP 3 SHARE</div><div style={{ fontSize: 18, fontWeight: 700, color: C.accent }}>{model.distribution.top3Share}%</div></div>
          </div>
          {model.totalsByTech.slice().sort((left, right) => right.refreshes - left.refreshes).map((item) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ width: 110, fontSize: 10.5, color: C.sub }}>{item.shortName}</span>
              <div style={{ flex: 1, height: 8, background: C.chartGrid, borderRadius: 6 }}>
                <div style={barStyle(C, C.accent, (item.refreshes / maxRefresh) * 100)} />
              </div>
              <span style={{ width: 52, textAlign: "right", fontSize: 10, fontFamily: MN }}>{item.sharePct}%</span>
            </div>
          ))}
        </AnalyticsPanel>

        <AnalyticsPanel C={C} MN={MN} title="Year-over-Year Refreshes">
          {model.totalsByTech.map((item) => (
            <div key={item.name} style={{ padding: "5px 0", borderBottom: `1px solid ${C.borderLight}` }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                {[
                  ["2024", item.yoy2024, C.accent],
                  ["2025", item.yoy2025, C.orange],
                  ["2026 YTD", item.yoy2026, C.green],
                ].map(([label, value, color]) => (
                  <div key={label} style={{ padding: "6px 8px", borderRadius: 6, background: C.surfaceAlt, border: `1px solid ${C.borderLight}` }}>
                    <div style={{ fontSize: 9, color: C.muted, fontFamily: MN }}>{label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </AnalyticsPanel>
      </div>
      <div style={{ marginTop: 10 }}>
        <AnalyticsPanel C={C} MN={MN} title="Role Specialization">
          <SummaryGrid C={C} items={model.specialization.map((item) => ({ title: `${item.role} - ${item.techs}`, description: item.description }))} />
        </AnalyticsPanel>
      </div>
    </>
  );
}

export function TeamWorkloadInsightsSection({ C, MN, SH, Kpi }) {
  const model = useMemo(() => getTeamPerformanceModel(), []);
  const [selectedTech, setSelectedTech] = useState(model.totalsByTech[0]?.name || null);
  const selected = model.totalsByTech.find((item) => item.name === selectedTech) || null;
  const maxMonthly = selected ? Math.max(1, ...selected.monthly.map((item) => item.value)) : 1;

  return (
    <>
      <SH color={C.purple} badge="Integrated workload history">Historical Workload Breakdown</SH>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: C.shadow, overflow: "auto", marginBottom: 10 }}>
        <table style={{ width: "100%", minWidth: 900 }}>
          <thead>
            <tr>
              {["Technician","Refreshes","Incidents","Incident Since","Onboarding","Onboard Since","Offboarding","Offboard Since","Grand Total"].map((heading) => (
                <th key={heading} style={{ padding: "7px 8px", textAlign: "left", fontSize: 9, color: C.muted, fontFamily: MN, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.totalsByTech.map((item, index) => (
              <tr key={item.name}>
                <td style={{ padding: "7px 8px", borderBottom: `1px solid ${C.borderLight}`, background: index % 2 ? C.surfaceAlt : C.surface, fontSize: 12, fontWeight: 600 }}>{item.name}</td>
                <td style={{ padding: "7px 8px", borderBottom: `1px solid ${C.borderLight}`, background: index % 2 ? C.surfaceAlt : C.surface, fontFamily: MN }}>{item.refreshes}</td>
                <td style={{ padding: "7px 8px", borderBottom: `1px solid ${C.borderLight}`, background: index % 2 ? C.surfaceAlt : C.surface, fontFamily: MN }}>{item.incidents}</td>
                <td style={{ padding: "7px 8px", borderBottom: `1px solid ${C.borderLight}`, background: index % 2 ? C.surfaceAlt : C.surface, color: C.muted }}>{item.incidentSince}</td>
                <td style={{ padding: "7px 8px", borderBottom: `1px solid ${C.borderLight}`, background: index % 2 ? C.surfaceAlt : C.surface, fontFamily: MN }}>{item.onboarding || "-"}</td>
                <td style={{ padding: "7px 8px", borderBottom: `1px solid ${C.borderLight}`, background: index % 2 ? C.surfaceAlt : C.surface, color: C.muted }}>{item.onboardingSince || "-"}</td>
                <td style={{ padding: "7px 8px", borderBottom: `1px solid ${C.borderLight}`, background: index % 2 ? C.surfaceAlt : C.surface, fontFamily: MN }}>{item.offboarding || "-"}</td>
                <td style={{ padding: "7px 8px", borderBottom: `1px solid ${C.borderLight}`, background: index % 2 ? C.surfaceAlt : C.surface, color: C.muted }}>{item.offboardingSince || "-"}</td>
                <td style={{ padding: "7px 8px", borderBottom: `1px solid ${C.borderLight}`, background: index % 2 ? C.surfaceAlt : C.surface, fontFamily: MN, color: C.accent, fontWeight: 700 }}>{item.grandTotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {model.totalsByTech.map((item) => (
          <button
            key={item.name}
            onClick={() => setSelectedTech(item.name)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: `1px solid ${selectedTech === item.name ? C.accentBorder : C.border}`,
              background: selectedTech === item.name ? C.accentSoft : C.surface,
              color: selectedTech === item.name ? C.accent : C.sub,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {item.name}
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 8, marginBottom: 10 }}>
            <Kpi label="Grand Total Tasks" value={selected.grandTotal.toLocaleString()} color={C.accent} />
            <Kpi label="Refreshes" value={selected.refreshes} color={C.accent} />
            <Kpi label="Incidents" value={selected.incidents} sub={`Since ${selected.incidentSince}`} color={C.red} />
            {selected.onboarding > 0 && <Kpi label="Onboarding" value={selected.onboarding.toLocaleString()} sub={`Since ${selected.onboardingSince}`} color={C.green} />}
            {selected.offboarding > 0 && <Kpi label="Offboarding" value={selected.offboarding.toLocaleString()} sub={`Since ${selected.offboardingSince}`} color={C.amber} />}
            <Kpi label="Active Refresh Months" value={selected.activeMonths} sub="Historical active months" color={C.purple} />
            <Kpi label="Avg / Month" value={selected.avgPerMonth} sub="When active" color={C.cyan} />
            <Kpi label="Avg / Week" value={selected.avgPerWeek} sub="Historical average" color={C.gray} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 10 }}>
            <AnalyticsPanel C={C} MN={MN} title={`${selected.name} Monthly Refresh Trend`}>
              {selected.monthly.map((item) => (
                <div key={item.monthKey} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <span style={{ width: 60, fontSize: 10, color: C.muted, fontFamily: MN }}>{item.label}</span>
                  <div style={{ flex: 1, height: 8, background: C.chartGrid, borderRadius: 6 }}>
                    <div style={barStyle(C, C.accent, (item.value / maxMonthly) * 100)} />
                  </div>
                  <span style={{ width: 24, textAlign: "right", fontSize: 10, fontFamily: MN }}>{item.value}</span>
                </div>
              ))}
            </AnalyticsPanel>
            <AnalyticsPanel C={C} MN={MN} title={`${selected.name} Technician Detail`}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 8 }}>
                <div style={{ padding: "8px 10px", border: `1px solid ${C.borderLight}`, borderRadius: 6 }}><div style={{ fontSize: 9, color: C.muted, fontFamily: MN }}>PEAK MONTH</div><div style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{selected.peakMonth}</div></div>
                <div style={{ padding: "8px 10px", border: `1px solid ${C.borderLight}`, borderRadius: 6 }}><div style={{ fontSize: 9, color: C.muted, fontFamily: MN }}>LOWEST MONTH</div><div style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{selected.lowestMonth}</div></div>
                <div style={{ padding: "8px 10px", border: `1px solid ${C.borderLight}`, borderRadius: 6 }}><div style={{ fontSize: 9, color: C.muted, fontFamily: MN }}>2024</div><div style={{ fontSize: 18, fontWeight: 700, color: C.accent }}>{selected.yoy2024}</div></div>
                <div style={{ padding: "8px 10px", border: `1px solid ${C.borderLight}`, borderRadius: 6 }}><div style={{ fontSize: 9, color: C.muted, fontFamily: MN }}>2025</div><div style={{ fontSize: 18, fontWeight: 700, color: C.orange }}>{selected.yoy2025}</div></div>
                <div style={{ padding: "8px 10px", border: `1px solid ${C.borderLight}`, borderRadius: 6 }}><div style={{ fontSize: 9, color: C.muted, fontFamily: MN }}>2026 YTD</div><div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{selected.yoy2026}</div></div>
                <div style={{ padding: "8px 10px", border: `1px solid ${C.borderLight}`, borderRadius: 6 }}><div style={{ fontSize: 9, color: C.muted, fontFamily: MN }}>REFRESH SHARE</div><div style={{ fontSize: 18, fontWeight: 700, color: C.purple }}>{selected.sharePct}%</div></div>
              </div>
              <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.55 }}>
                Historical workload from `legacy demo dashboard` is now embedded here alongside the live assignment workload cards above, so planners can compare current assignments against long-run technician specialization and throughput.
              </div>
            </AnalyticsPanel>
          </div>
        </>
      )}
    </>
  );
}

