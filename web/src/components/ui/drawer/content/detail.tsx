type DetailProps = {
  label: string;
  text: string;
};

export const Detail = ({ label, text }: DetailProps) => {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-1 rounded-xl bg-gray-50 p-4">
      <span className="text-xs sm:text-sm">{label}</span>
      <span className="text-base font-extrabold sm:text-lg md:text-xl">
        {text}
      </span>
    </div>
  );
};
