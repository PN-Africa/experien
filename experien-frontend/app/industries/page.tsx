"use client";

import { useEffect, useState } from "react";
import { pathways as staticPathways, type Pathway } from "@/components/industries/pathways";
import { loadPathways } from "@/lib/api/catalogue";
import IndustriesHero from "@/components/industries/IndustriesHero";
import IndustryPicker from "@/components/industries/IndustryPicker";
import SelectionSummary from "@/components/industries/SelectionSummary";
import MaterialsSection from "@/components/industries/MaterialsSection";
import CourseBanner from "@/components/industries/CourseBanner";

export default function IndustriesPage() {
  const [pathways, setPathways] = useState<Pathway[]>(staticPathways);
  const [selectedId, setSelectedId] = useState("technology");

  // Show the static copy immediately, then swap in live data from the backend.
  useEffect(() => {
    loadPathways().then((live) => {
      if (live && live.length > 0) setPathways(live);
    });
  }, []);

  const selected = pathways.find((p) => p.id === selectedId) ?? pathways[0];

  return (
    <>
      <IndustriesHero />
      <IndustryPicker pathways={pathways} selectedId={selectedId} onSelect={setSelectedId} />
      <SelectionSummary selected={selected} />
      <MaterialsSection selected={selected} />
      <CourseBanner selected={selected} />
    </>
  );
}