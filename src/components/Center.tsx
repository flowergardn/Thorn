import type { ReactElement, ReactFragment, ReactPortal } from "react";

export default function Center(props: {
  classes?: string | undefined;
  children?:
    | string
    | number
    | boolean
    | ReactElement
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) {
  return (
    <>
      <div className={`flex justify-center ${props.classes ?? ""}`}>
        {props.children}
      </div>
    </>
  );
}