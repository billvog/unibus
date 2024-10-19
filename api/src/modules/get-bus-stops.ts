import { publicProcedure } from "@api/trpc";

export const getBusStops = publicProcedure.query(() => {
  return [
    { id: "1", name: "Bus Stop 1" },
    { id: "2", name: "Bus Stop 2" },
    { id: "3", name: "Bus Stop 3" },
  ];
});
