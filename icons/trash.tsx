import { SVGProps } from "react";

export default function FeTrash(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M4 5h3V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1h3a1 1 0 0 1 0 2h-1v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7H4a1 1 0 1 1 0-2Zm3 2v13h10V7H7Zm2-2h6V4H9v1Zm0 4h2v9H9V9Zm4 0h2v9h-2V9Z"
      ></path>
    </svg>
  );
}
