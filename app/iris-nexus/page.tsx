"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IrisNexusPage() {
  const router = useRouter();

  // Backwards-compatible redirect: Iris/Nexus was renamed to FEV AI Space for ARC.
  useEffect(() => {
    router.replace("/fev-ai-space");
  }, [router]);

  return null;
}
