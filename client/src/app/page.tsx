import { Highlight } from "./components/Highlight/Highlight";
import { ProductInfo } from "./components/ProductInfo/ProductInfo";
import { SpotlightNewDemo } from "./components/Spotlight/Spotlight";
import { PricingSection } from "./components/Pricing/Pricing";

export default function Home() {
  return (
    <>
      <Highlight />
      <SpotlightNewDemo />
      <ProductInfo />
      <PricingSection />
    </>
  );
}
