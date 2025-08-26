"use client";

import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import { Tooltip } from "@heroui/tooltip";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo, useCallback } from "react";

import { sidebarOpenAtom } from "@/store/atoms";

export default function SidebarToggle() {
  const isOpen = useAtomValue(sidebarOpenAtom);
  const setIsOpen = useSetAtom(sidebarOpenAtom);

  const handleToggle = useCallback(() => {
    setIsOpen((prev: boolean) => !prev);
  }, [setIsOpen]);

  const tooltipContent = useMemo(
    () => (isOpen ? "Close sidebar" : "Open sidebar"),
    [isOpen]
  );

  return (
    <Tooltip closeDelay={0} content={tooltipContent} placement="bottom">
      <Button
        isIconOnly
        aria-label="Toggle sidebar"
        className="text-default-600 hover:text-default-700"
        variant="light"
        size="sm"
        startContent={<Icon icon="lucide:sidebar" width={20} />}
        onPress={handleToggle}
      ></Button>
    </Tooltip>
  );
}
