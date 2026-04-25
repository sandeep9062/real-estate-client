import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Properties | Propertybulbul",
  description:
    "Manage your property listings on Propertybulbul. Add, edit, and track your properties for sale or rent in Tricity.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OwnedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
