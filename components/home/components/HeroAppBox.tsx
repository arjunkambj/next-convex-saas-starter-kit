import { Card, CardBody, Image } from "@heroui/react";

export default function HeroAppBox() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <Card className="bg-content1 rounded-2xl bg-transparent ">
        <CardBody className="p-3 sm:p-5 md:p-8">
          <div className="rounded-2xl border border-divider/80 bg-content2 p-1.5 sm:p-2 shadow-xs">
            <div className="overflow-hidden rounded-xl ring-1 ring-divider">
              <Image
                removeWrapper
                src="https://placehold.co/1400x800/png?text=SaaS+Starter+Kit+Dashboard"
                alt="SaaS starter kit dashboard preview with Convex backend"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </CardBody>
      </Card>
      {/* Bottom glow / fade */}
    </div>
  );
}
