"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Drawer, DrawerContent, DrawerBody } from "@heroui/drawer";
import { useAtom } from "jotai";

import { sidebarOpenAtom } from "@/store/atoms";
import { useDebounce } from "@/hooks/useDebounce";

import SidebarContent from "./components/SidebarContent";

const Sidebar = React.memo(({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleResizeLogic = useCallback(() => {
    const mobile = window.innerWidth < 768;

    setIsMobile(mobile);

    if (mobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [setIsOpen]);

  const handleResize = useDebounce(handleResizeLogic, 150);

  const handleDrawerOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
    },
    [setIsOpen]
  );

  useEffect(() => {
    setIsClient(true);

    handleResizeLogic();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, handleResizeLogic]);

  const sidebarContent = useMemo(
    () => <SidebarContent onClose={handleClose} />,
    [handleClose]
  );

  const drawerClasses = useMemo(
    () =>
      // Match Settings drawer styling: solid surface, subtle border, no shadow padding
      "max-w-[280px] w-[280px] bg-content1 border-r border-default-100 shadow-none p-0",
    []
  );
  const sectionClasses = useMemo(
    () => `h-full ${className || ""}`,
    [className]
  );

  const drawerContent = useMemo(
    () => (
      <Drawer
        hideCloseButton
        backdrop="transparent"
        className={drawerClasses}
        isOpen={isOpen}
        placement="left"
        radius="none"
        shadow="none"
        onOpenChange={handleDrawerOpenChange}
      >
        <DrawerContent className="p-0">
          {(onClose) => (
            <>
              <DrawerBody className="p-0 rounded-none">
                <SidebarContent onClose={onClose} />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    ),
    [drawerClasses, isOpen, handleDrawerOpenChange]
  );

  if (!isClient) {
    return <section className={sectionClasses}>{sidebarContent}</section>;
  }

  return (
    <>
      <section className={sectionClasses}>
        {!isMobile && sidebarContent}
        {isMobile && drawerContent}
      </section>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
