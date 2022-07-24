import { SVGProps } from "react";

export default function FeUser(props: SVGProps<SVGSVGElement>) {
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
        d="M12 12a4 4 0 1 1 0-8a4 4 0 0 1 0 8Zm0 3c3.186 0 6.045.571 8 3.063V20H4v-1.937C5.955 15.57 8.814 15 12 15Z"
      ></path>
    </svg>
  );
}
