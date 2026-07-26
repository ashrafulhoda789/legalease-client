import FeaturedLawyers from "@/components/home/FeaturedLawyers";
import HeroBanner from "@/components/home/HeroBanner";
import LegalCategories from "@/components/home/LegalCategories";
import TopLegalExperts from "@/components/home/TopLegalExperts";


export default function Home() {
  return (
    <div>
      <HeroBanner/>
      <FeaturedLawyers/>
      <TopLegalExperts/>
      <LegalCategories/>
    </div>
  );
}
