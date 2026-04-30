import { notFound } from "next/navigation";
import { getOrBuildProspect, getAllProspectPaths } from "@/lib/prospects";
import ProspectHero from "@/components/prospect/ProspectHero";
import ProspectPainPoints from "@/components/prospect/ProspectPainPoints";
import ServicesGrid from "@/components/prospect/ServicesGrid";
import BusinessCase from "@/components/prospect/BusinessCase";
import NachtragsAgentDemo from "@/components/prospect/NachtragsAgentDemo";
import BauleiterIntro from "@/components/prospect/BauleiterIntro";
import HowItWorks from "@/components/prospect/HowItWorks";
import Testimonials from "@/components/prospect/Testimonials";
import PricingCard from "@/components/prospect/PricingCard";
import ProspectFooter from "@/components/prospect/ProspectFooter";
import AuditBot from "@/components/prospect/AuditBot";

// Pre-render the 26 known prospects, generate any other URL on demand.
export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  return getAllProspectPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trade: string; name: string }>;
}) {
  const { trade, name } = await params;
  const prospect = getOrBuildProspect(trade, name);
  if (!prospect) return { title: "Nicht gefunden" };
  return {
    title: `KI-Demo für ${prospect.companyName} · Rebelz AI`,
    description: `Personalisierte Demo: NachtragsAgent für ${prospect.companyName}.`,
    robots: { index: false, follow: false },
  };
}

export default async function ProspectPage({
  params,
}: {
  params: Promise<{ trade: string; name: string }>;
}) {
  const { trade, name } = await params;
  const prospect = getOrBuildProspect(trade, name);
  if (!prospect) notFound();

  return (
    <>
      <ProspectHero prospect={prospect} />
      <ProspectPainPoints prospect={prospect} />
      <ServicesGrid prospect={prospect} />
      <BusinessCase prospect={prospect} />
      <NachtragsAgentDemo prospect={prospect} />
      <BauleiterIntro prospect={prospect} />
      <HowItWorks prospect={prospect} />
      <Testimonials prospect={prospect} />
      <PricingCard prospect={prospect} />
      <ProspectFooter prospect={prospect} />
      <AuditBot prospect={prospect} />
    </>
  );
}
