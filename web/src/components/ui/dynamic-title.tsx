import { useEffect, useRef } from "react";

import { cn } from "@web/lib/utils/tailwind";

type DynamicTitleProps = {
  title: string;
} & React.HTMLAttributes<HTMLHeadingElement>;

const DynamicTitle = ({ title, className, ...props }: DynamicTitleProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const adjustFontSize = () => {
      const titleElement = titleRef.current;
      if (!titleElement) return;

      let fontSize = 1.2; // in rem
      titleElement.style.fontSize = `${fontSize}rem`;

      while (
        titleElement.scrollWidth > titleElement.clientWidth &&
        fontSize > 0.5
      ) {
        fontSize -= 0.1;
        titleElement.style.fontSize = `${fontSize}rem`;
      }
    };

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);

    return () => {
      window.removeEventListener("resize", adjustFontSize);
    };
  }, [title]);

  return (
    <h1
      ref={titleRef}
      className={cn("dynamic-title font-extrabold", className)}
      {...props}
    >
      {title}
    </h1>
  );
};

export default DynamicTitle;
