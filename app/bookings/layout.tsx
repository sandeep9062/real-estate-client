import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Bookings | PropertyBulbul",
  description:
    "View and manage your scheduled property visits on PropertyBulbul. Track your booking history for properties in Chandigarh, Panchkula, and Mohali.",
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
