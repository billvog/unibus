-- CreateTable
CREATE TABLE "BusStop" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "lineCodes" TEXT[],
    "routeCodes" TEXT[],
    "distance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BusStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusRoute" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "direction" INTEGER NOT NULL,
    "lineId" INTEGER NOT NULL,

    CONSTRAINT "BusRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusLine" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "borderColor" TEXT NOT NULL,

    CONSTRAINT "BusLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusLinePoint" (
    "id" SERIAL NOT NULL,
    "sequence" INTEGER NOT NULL,
    "longitude" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "lineId" INTEGER,

    CONSTRAINT "BusLinePoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusStopTrip" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "timeHour" INTEGER NOT NULL,
    "timeMinute" INTEGER NOT NULL,
    "lineCode" TEXT NOT NULL,
    "lineColor" TEXT NOT NULL,
    "lineName" TEXT NOT NULL,
    "lineTextColor" TEXT NOT NULL,
    "routeCode" TEXT NOT NULL,
    "routeName" TEXT NOT NULL,
    "stopId" INTEGER NOT NULL,

    CONSTRAINT "BusStopTrip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BusRoute" ADD CONSTRAINT "BusRoute_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "BusLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusLinePoint" ADD CONSTRAINT "BusLinePoint_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "BusLine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusStopTrip" ADD CONSTRAINT "BusStopTrip_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "BusStop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
