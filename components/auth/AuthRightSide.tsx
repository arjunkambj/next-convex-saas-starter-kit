"use client";
import { User } from "@heroui/react";

export default function AuthRightSide({ className }: { className?: string }) {
  return (
    <div
      className={`relative hidden h-full min-h-[97dvh] flex-col-reverse rounded-md p-10 rounded-l-2xl lg:flex ${className}`}
      style={{
        backgroundImage:
          "url(https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/white-building.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-end gap-4">
        <User
          avatarProps={{
            src: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
          }}
          classNames={{
            base: "flex flex-row-reverse",
            name: "w-full text-right text-black",
            description: "text-black/80",
          }}
          description="Founder & CEO at ACME"
          name="Bruno Reichert"
        />
        <p className="w-full text-right text-2xl text-black/60">
          <span className="font-medium">“</span>
          <span className="font-normal italic">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget
            augue nec massa volutpat aliquet.
          </span>
          <span className="font-medium">”</span>
        </p>
      </div>
    </div>
  );
}
