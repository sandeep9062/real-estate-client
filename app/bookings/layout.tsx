import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Bookings | Propertybulbul",
  description:
    "View and manage your scheduled property visits on Propertybulbul. Track your booking history for properties in Chandigarh, Panchkula, and Mohali.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
