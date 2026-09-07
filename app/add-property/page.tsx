import React, { Suspense } from "react";
import { Center, Loader } from "@mantine/core";
import AddPropertyPageContent from "@/components/add-property/AddPropertyPageContent";

// Next.js App Router requires useSearchParams() to be used inside a
// <Suspense> boundary, hence this thin wrapper page.
export default function AddPropertyPage() {
  return (
    <Suspense
      fallback={
        <Center h={400}>
          <Loader />
        </Center>
      }
    >
      <AddPropertyPageContent />
    </Suspense>
  );
}
