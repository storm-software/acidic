import { RESET } from "jotai/utils";
import React, { useLayoutEffect, useRef } from "react";
import "packages/service-graph/node_modules/reactflow/dist/style.css";
import { ActiveNodeDrawerHeader } from "../active-node-drawer-header";
import { Drawer, DrawerProps, DrawerRef } from "../drawer";
import { useEvent } from "../hooks";
import { useGraphStore } from "../state";

export interface ActiveNodeDrawerProps extends DrawerProps {}

export const ActiveNodeDrawer = ({
  children,
  ...props
}: ActiveNodeDrawerProps) => {
  const ref = useRef<DrawerRef | null>(null);
  const [active, setActive] = useGraphStore().use.active();

  useLayoutEffect(() => {
    if (active) {
      ref.current?.open();
    } else {
      ref.current?.close();
    }
  }, [active]);
  const handleClose = useEvent(() => {
    if (props.closable) {
      props.onClose?.();
      setActive(RESET);
    }
  });

  return (
    <Drawer
      {...props}
      ref={ref}
      onClose={handleClose}
      header={
        active ? (
          <ActiveNodeDrawerHeader
            service={active.service}
            node={active.node}
            field={active.field}
          />
        ) : null
      }>
      {children}
    </Drawer>
  );
};
