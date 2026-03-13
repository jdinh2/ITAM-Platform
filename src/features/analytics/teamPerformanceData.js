const DATA = {
  months: ["2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10","2024-11","2024-12","2025-01","2025-02","2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03"],
  monthly: {
    "Anthony Cousin": {"2024-01":0,"2024-02":15,"2024-03":50,"2024-04":70,"2024-05":50,"2024-06":6,"2024-07":24,"2024-08":45,"2024-09":42,"2024-10":0,"2024-11":0,"2024-12":0,"2025-01":0,"2025-02":0,"2025-03":0,"2025-04":0,"2025-05":0,"2025-06":0,"2025-07":4,"2025-08":13,"2025-09":0,"2025-10":5,"2025-11":0,"2025-12":0,"2026-01":0,"2026-02":7,"2026-03":0},
    "Isaiah Gourdine": {"2024-01":0,"2024-02":12,"2024-03":38,"2024-04":50,"2024-05":56,"2024-06":11,"2024-07":39,"2024-08":40,"2024-09":44,"2024-10":47,"2024-11":41,"2024-12":15,"2025-01":26,"2025-02":45,"2025-03":27,"2025-04":24,"2025-05":11,"2025-06":15,"2025-07":2,"2025-08":4,"2025-09":4,"2025-10":14,"2025-11":1,"2025-12":2,"2026-01":15,"2026-02":14,"2026-03":2},
    "Michael Girardi": {"2024-01":5,"2024-02":2,"2024-03":0,"2024-04":7,"2024-05":0,"2024-06":0,"2024-07":1,"2024-08":0,"2024-09":0,"2024-10":10,"2024-11":1,"2024-12":2,"2025-01":3,"2025-02":20,"2025-03":2,"2025-04":8,"2025-05":0,"2025-06":0,"2025-07":0,"2025-08":3,"2025-09":0,"2025-10":3,"2025-11":0,"2025-12":0,"2026-01":0,"2026-02":7,"2026-03":0},
    "Jon Dinh": {"2024-01":0,"2024-02":0,"2024-03":30,"2024-04":56,"2024-05":40,"2024-06":6,"2024-07":30,"2024-08":28,"2024-09":32,"2024-10":48,"2024-11":34,"2024-12":20,"2025-01":23,"2025-02":31,"2025-03":48,"2025-04":8,"2025-05":3,"2025-06":4,"2025-07":4,"2025-08":16,"2025-09":9,"2025-10":15,"2025-11":1,"2025-12":0,"2026-01":2,"2026-02":20,"2026-03":1},
    "Jonathan Gamble": {"2024-01":5,"2024-02":2,"2024-03":0,"2024-04":14,"2024-05":6,"2024-06":1,"2024-07":27,"2024-08":45,"2024-09":37,"2024-10":66,"2024-11":47,"2024-12":15,"2025-01":58,"2025-02":44,"2025-03":71,"2025-04":43,"2025-05":18,"2025-06":6,"2025-07":8,"2025-08":13,"2025-09":7,"2025-10":10,"2025-11":5,"2025-12":0,"2026-01":22,"2026-02":20,"2026-03":0},
  },
  totals: {"Anthony Cousin":331,"Isaiah Gourdine":599,"Michael Girardi":74,"Jon Dinh":509,"Jonathan Gamble":590},
  teamMonthly: {"2024-01":10,"2024-02":31,"2024-03":118,"2024-04":197,"2024-05":152,"2024-06":24,"2024-07":121,"2024-08":158,"2024-09":155,"2024-10":171,"2024-11":123,"2024-12":52,"2025-01":110,"2025-02":140,"2025-03":148,"2025-04":83,"2025-05":32,"2025-06":25,"2025-07":18,"2025-08":49,"2025-09":20,"2025-10":47,"2025-11":7,"2025-12":2,"2026-01":39,"2026-02":68,"2026-03":3},
  allMonthly: {"2024-01":209,"2024-02":163,"2024-03":215,"2024-04":258,"2024-05":201,"2024-06":27,"2024-07":213,"2024-08":217,"2024-09":254,"2024-10":260,"2024-11":224,"2024-12":70,"2025-01":204,"2025-02":214,"2025-03":241,"2025-04":152,"2025-05":57,"2025-06":112,"2025-07":38,"2025-08":83,"2025-09":48,"2025-10":94,"2025-11":16,"2025-12":9,"2026-01":106,"2026-02":149,"2026-03":3},
  yoy: {
    "Anthony Cousin": {"2024":302,"2025":22,"2026":7},
    "Isaiah Gourdine": {"2024":393,"2025":175,"2026":31},
    "Michael Girardi": {"2024":28,"2025":39,"2026":7},
    "Jon Dinh": {"2024":324,"2025":162,"2026":23},
    "Jonathan Gamble": {"2024":265,"2025":283,"2026":42},
  },
  team: ["Anthony Cousin","Isaiah Gourdine","Michael Girardi","Jon Dinh","Jonathan Gamble"],
  totalAll: 3837,
  totalItam: 2103,
};

const EXTRA = {
  "Anthony Cousin": { inc: 216, incSince: "Jan 2024", offboard: 371, offSince: "Jul 2025", onboard: 0, onSince: "" },
  "Isaiah Gourdine": { inc: 623, incSince: "Jan 2024", offboard: 0, offSince: "", onboard: 0, onSince: "" },
  "Michael Girardi": { inc: 133, incSince: "Feb 2024", offboard: 0, offSince: "", onboard: 2612, onSince: "Feb 2024" },
  "Jon Dinh": { inc: 429, incSince: "Feb 2024", offboard: 1332, offSince: "Feb 2024", onboard: 0, onSince: "" },
  "Jonathan Gamble": { inc: 435, incSince: "Feb 2024", offboard: 0, offSince: "", onboard: 0, onSince: "" },
};

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const formatMonth = (monthKey) => {
  const [year, month] = monthKey.split("-");
  return `${MONTH_NAMES[Number(month) - 1]} '${year.slice(2)}`;
};

const grandTotalForTech = (tech) => DATA.totals[tech] + EXTRA[tech].inc + EXTRA[tech].onboard + EXTRA[tech].offboard;

const round = (value, precision = 1) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

export function getTeamPerformanceModel() {
  const monthlyChartData = DATA.months.map((monthKey) => {
    const row = { month: formatMonth(monthKey), fullMonth: monthKey };
    DATA.team.forEach((tech) => {
      row[tech] = DATA.monthly[tech][monthKey];
    });
    row.itamTotal = DATA.teamMonthly[monthKey];
    row.allTotal = DATA.allMonthly[monthKey];
    return row;
  });

  const rollingData = monthlyChartData.map((row, index) => {
    let rolling3m = null;
    if (index >= 2) {
      rolling3m = Math.round(
        (monthlyChartData[index - 2].itamTotal + monthlyChartData[index - 1].itamTotal + row.itamTotal) / 3
      );
    }
    return { ...row, rolling3m };
  });

  const totalIncidents = Object.values(EXTRA).reduce((sum, item) => sum + item.inc, 0);
  const totalOnboarding = Object.values(EXTRA).reduce((sum, item) => sum + item.onboard, 0);
  const totalOffboarding = Object.values(EXTRA).reduce((sum, item) => sum + item.offboard, 0);
  const grandTotalAll = DATA.totalItam + totalIncidents + totalOnboarding + totalOffboarding;
  const yoyRefreshDeltaPct = round(((DATA.yoy["Anthony Cousin"]["2025"] + DATA.yoy["Isaiah Gourdine"]["2025"] + DATA.yoy["Michael Girardi"]["2025"] + DATA.yoy["Jon Dinh"]["2025"] + DATA.yoy["Jonathan Gamble"]["2025"]) - (DATA.yoy["Anthony Cousin"]["2024"] + DATA.yoy["Isaiah Gourdine"]["2024"] + DATA.yoy["Michael Girardi"]["2024"] + DATA.yoy["Jon Dinh"]["2024"] + DATA.yoy["Jonathan Gamble"]["2024"])) / (DATA.yoy["Anthony Cousin"]["2024"] + DATA.yoy["Isaiah Gourdine"]["2024"] + DATA.yoy["Michael Girardi"]["2024"] + DATA.yoy["Jon Dinh"]["2024"] + DATA.yoy["Jonathan Gamble"]["2024"]) * 100, 1);

  const totalsByTech = DATA.team.map((tech) => {
    const refreshes = DATA.totals[tech];
    const extra = EXTRA[tech];
    const activeMonths = DATA.months.filter((monthKey) => DATA.monthly[tech][monthKey] > 0);
    const peakMonth = DATA.months.reduce((best, current) => (
      DATA.monthly[tech][best] > DATA.monthly[tech][current] ? best : current
    ));
    const lowestMonth = activeMonths.length > 0 ? activeMonths.reduce((best, current) => (
      DATA.monthly[tech][best] < DATA.monthly[tech][current] ? best : current
    )) : null;
    return {
      name: tech,
      shortName: tech.split(" ")[0],
      sharePct: round((refreshes / DATA.totalItam) * 100, 1),
      refreshes,
      incidents: extra.inc,
      incidentSince: extra.incSince,
      onboarding: extra.onboard,
      onboardingSince: extra.onSince,
      offboarding: extra.offboard,
      offboardingSince: extra.offSince,
      grandTotal: grandTotalForTech(tech),
      activeMonths: activeMonths.length,
      avgPerMonth: activeMonths.length > 0 ? round(refreshes / activeMonths.length, 1) : 0,
      avgPerWeek: activeMonths.length > 0 ? round(refreshes / activeMonths.length / 4.33, 1) : 0,
      peakMonth: `${formatMonth(peakMonth)} (${DATA.monthly[tech][peakMonth]})`,
      lowestMonth: lowestMonth ? `${formatMonth(lowestMonth)} (${DATA.monthly[tech][lowestMonth]})` : "N/A",
      yoy2024: DATA.yoy[tech]["2024"],
      yoy2025: DATA.yoy[tech]["2025"],
      yoy2026: DATA.yoy[tech]["2026"],
      monthly: DATA.months.map((monthKey) => ({ monthKey, label: formatMonth(monthKey), value: DATA.monthly[tech][monthKey] })),
    };
  }).sort((left, right) => right.grandTotal - left.grandTotal);

  const top3Share = round(
    totalsByTech
      .slice()
      .sort((left, right) => right.refreshes - left.refreshes)
      .slice(0, 3)
      .reduce((sum, item) => sum + item.refreshes, 0) / DATA.totalItam * 100,
    1
  );

  const meanRefreshes = round(DATA.totalItam / DATA.team.length, 0);
  const variance = totalsByTech.reduce((sum, item) => sum + ((item.refreshes - meanRefreshes) ** 2), 0) / totalsByTech.length;
  const stdDeviation = round(Math.sqrt(variance), 0);
  const coeffVar = round((stdDeviation / meanRefreshes) * 100, 1);

  return {
    totals: {
      refreshes: DATA.totalItam,
      totalHistoricalTasks: DATA.totalAll,
      incidents: totalIncidents,
      onboarding: totalOnboarding,
      offboarding: totalOffboarding,
      grandTotal: grandTotalAll,
      refreshShareOfAll: round((DATA.totalItam / DATA.totalAll) * 100, 1),
      yoyRefreshDeltaPct,
      activeRefreshCore: 3,
      specializedRoleCount: 2,
    },
    totalsByTech,
    monthlyChartData,
    rollingData,
    teamMonthlySeries: rollingData.map((row) => ({
      month: row.month,
      itamTotal: row.itamTotal,
      allTotal: row.allTotal,
      rolling3m: row.rolling3m,
    })),
    distribution: {
      meanRefreshes,
      stdDeviation,
      coeffVar,
      top3Share,
    },
    executiveSummary: [
      { title: "Jon Dinh - Heaviest Combined Load", description: "509 refreshes + 429 incidents + 1,332 offboarding = 2,270 total tasks. Primary offboarding owner." },
      { title: "Michael Girardi - Onboarding Specialist", description: "74 refreshes + 2,612 onboarding + 133 incidents = 2,819 total tasks. Highest individual task count." },
      { title: "Isaiah and Jonathan - Refresh Backbone", description: "Combined 1,189 refreshes and 1,058 incidents. They anchor refresh throughput." },
      { title: "Anthony Cousin - Role Shift", description: "302 refreshes in 2024, then picked up 371 offboarding tasks starting Jul 2025." },
      { title: "Declining Refresh Demand", description: "Historical refresh volume fell sharply year over year, but incidents, onboarding, and offboarding still create meaningful hidden load." },
      { title: "Single-Point-of-Failure Risk", description: "Girardi remains the only onboarding owner and Dinh remains the primary offboarding owner." },
    ],
    specialization: [
      { role: "Refresh Core", techs: "Isaiah, Jonathan, Jon", description: "Handle 80.7% of all laptop refreshes." },
      { role: "Onboarding Owner", techs: "Michael Girardi", description: "Sole owner of 2,612 onboarding tasks." },
      { role: "Offboarding Primary", techs: "Jon Dinh", description: "Primary owner of 1,332 offboarding tasks." },
      { role: "Offboarding Secondary", techs: "Anthony Cousin", description: "Secondary offboarding coverage with 371 tasks." },
    ],
  };
}
