import { SVGProps } from "react";

export default function FeMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M4 10v8h16v-8l-8 3l-8-3Zm0-4v2l8 3l8-3V6H4Zm0-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"></path>
    </svg>
  );
}
