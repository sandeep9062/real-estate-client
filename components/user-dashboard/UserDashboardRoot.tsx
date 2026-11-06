"use client";

import UserDashboardGate from "./UserDashboardGate";
import UserDashboardShell from "./UserDashboardShell";

export default function UserDashboardRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserDashboardGate>
        <UserDashboardShell>{children}</UserDashboardShell>
      </UserDashboardGate>
    </>
  );
}
