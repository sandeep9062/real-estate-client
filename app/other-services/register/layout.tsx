import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register as a Service Provider | PropertyBulbul",
  description:
    "Register as a contractor, architect, interior designer, loan agent, legal consultant or other property professional on PropertyBulbul and connect with verified customers.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://www.propertybulbul.com/other-services/register",
  },
};

export default function ServiceProviderRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}