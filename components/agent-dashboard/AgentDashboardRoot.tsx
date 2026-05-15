"use client";

import AgentDashboardGate from "./AgentDashboardGate";
import AgentDashboardOAuthBridge from "./AgentDashboardOAuthBridge";
import AgentDashboardShell from "./AgentDashboardShell";

export default function AgentDashboardRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AgentDashboardOAuthBridge />
      <AgentDashboardGate>
        <AgentDashboardShell>{children}</AgentDashboardShell>
      </AgentDashboardGate>
    </>
  );
}
