import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Favourites | PropertyBulbul",
  description:
    "View and manage your favourite properties on PropertyBulbul. Save and compare properties in Chandigarh, Panchkula, Mohali, and Zirakpur.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavouritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
