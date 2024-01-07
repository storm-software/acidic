import { isSet, isString } from "@storm-stack/utilities";
import { cva, type VariantProps } from "class-variance-authority";
import React, {
  BaseHTMLAttributes,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState
} from "react";
import "reactflow/dist/style.css";
import { twMerge } from "tailwind-merge";
import { Button } from "../button";
import { useEvent } from "../hooks";

const variants = cva(
  "font-mona-sans right-0 border-e fixed flex flex-col gap-2 top-0 z-[60] h-full transform bg-white border-l border-[1px] border-gray-200/50 transition-all duration-300 dark:border-gray-700 dark:bg-gray-800",
  {
    variants: {
      size: {
        xs: ["w-80"],
        sm: ["w-96"],
        md: ["w-[30rem]"],
        lg: ["w-[55rem]"],
        xl: ["w-11/12"]
      },
      status: {
        opened: ["translate-x-0"],
        closed: ["translate-x-full"]
      }
    },
    compoundVariants: [],
    defaultVariants: {
      size: "md",
      status: "closed"
    }
  }
);

export interface DrawerRef {
  open: () => void;
  close: () => void;
}

export interface DrawerProps
  extends BaseHTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof variants>, "status"> {
  /**
   * The content of the button for screen readers.
   *
   * @remarks
   * This value is hidden visually but read aloud by screen readers.
   **/
  screenReader?: string;

  /**
   * The content of the drawer header.
   */
  header?: ReactNode | string;

  /**
   * The content of the drawer footer.
   */
  footer?: ReactNode;

  /**
   * Whether the drawer can be closed.
   *
   * @default `true`
   */
  closable?: boolean;

  /**
   * An indicator specifying if the drawer is initially currently opened or not (opened = true/closed = false).
   *
   * @default `false`
   */
  opened?: boolean;

  /**
   * Callback fired when the drawer is closed.
   */
  onClose?: () => void;

  /**
   * Callback fired when the drawer is opened.
   */
  onOpen?: () => void;
}

export const Drawer = forwardRef<DrawerRef | null, DrawerProps>(
  (
    {
      className,
      size = "md",
      children,
      screenReader,
      header,
      footer,
      closable = true,
      opened = false,
      onClose,
      onOpen,
      ...props
    }: DrawerProps,
    ref
  ) => {
    const [isOpened, setIsOpened] = useState(opened);

    const handleClose = useEvent(() => {
      setIsOpened(false);
      setTimeout(() => onClose?.(), 500);
    });
    const handleOpen = useEvent(() => {
      setIsOpened(true);
      setTimeout(() => onOpen?.(), 500);
    });

    useImperativeHandle(
      ref,
      () => ({
        open: handleOpen,
        close: handleClose
      }),
      []
    );

    return (
      <div
        className={twMerge(
          variants({ status: isOpened ? "opened" : "closed", size, className })
        )}
        tabIndex={-1}>
        <div className="min-h-[2rem] w-full">
          {isSet(header) && (
            <>
              {isString(header) ? (
                <div className="flex items-center justify-between bg-slate-200/10 py-3 px-4">
                  <h3 className="font-mona-sans text-lg font-bold text-slate-200">
                    {header}
                  </h3>
                </div>
              ) : (
                header
              )}
            </>
          )}

          {closable && (
            <Button
              className="group absolute top-1 right-2"
              onClick={handleClose}
              kind="ghost"
              size="sm"
              rounded="full"
              screenReader="Close Drawer">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5 stroke-slate-200 stroke-2 transition-colors duration-200 group-hover:stroke-slate-200/60">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </Button>
          )}
        </div>
        <div className="flex grow px-4 font-mona-sans-light text-slate-400">
          {children}
        </div>

        {isSet(footer) && (
          <div className="flex min-h-[3rem] w-full">{footer}</div>
        )}
      </div>
    );
  }
);
