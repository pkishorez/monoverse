import { ReactNode, forwardRef, useImperativeHandle, useRef } from "react";

type Props = { children: ReactNode };
export type ConnectorRef = {
  top: React.RefObject<HTMLDivElement>;
  bottom: React.RefObject<HTMLDivElement>;
};

export const Connector = forwardRef<ConnectorRef, Props>(
  ({ children }, ref) => {
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => {
      return {
        top: topRef,
        bottom: bottomRef,
      };
    });

    return (
      <div>
        <div className="flex justify-center">
          <div ref={topRef} />
        </div>
        {children}
        <div className="flex justify-center">
          <div ref={bottomRef} />
        </div>
      </div>
    );
  },
);
