function RiskBadge({ riskLevel }) {
  const icons = { low: "▼", medium: "◆", high: "▲" };

  return (
    <span className={`risk-badge risk-badge-${riskLevel}`}>
      {icons[riskLevel]} {riskLevel}
    </span>
  );
}

export default RiskBadge;