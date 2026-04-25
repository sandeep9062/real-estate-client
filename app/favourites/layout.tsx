import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Favourites | Propertybulbul",
  description:
    "View and manage your favourite properties on Propertybulbul. Save and compare properties in Chandigarh, Panchkula, Mohali, and Zirakpur.",
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
