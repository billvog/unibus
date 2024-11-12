import { cn } from "@web/lib/utils/tailwind";

function Content() {
  return null;
}

type ContentProps = {
  isFullyOpen: boolean;
  children: React.ReactNode;
};

Content.Header = function ({ isFullyOpen, children }: ContentProps) {
  return (
    <div
      className={cn(
        "flex border-b-2 border-gray-100 px-10 pb-4 pt-8",
        isFullyOpen ? "flex-col items-start gap-2" : "items-center gap-4",
      )}
    >
      {children}
    </div>
  );
};

type ContentBodyProps = {
  isFullyOpen: boolean;
  children: React.ReactNode;
};

Content.Body = function ({ isFullyOpen, children }: ContentBodyProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 px-10 pb-8 pt-5",
        isFullyOpen && "no-scrollbar overflow-y-auto",
      )}
    >
      {children}
    </div>
  );
};

export default Content;
