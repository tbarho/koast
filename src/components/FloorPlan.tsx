import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  useMemo,
} from "react";

const PALETTE = ["#17072b", "#172d67", "#22ddd2", "#2e73ea", "#8c15e9"];

const SPACE = {
  name: "space",
  width: 1290,
  height: 262,
  x: 0,
  y: 0,
};

// Dims in inches
const ELEMENTS = [
  SPACE,
  {
    name: "stair-back",
    width: 233,
    height: 49,
    x: 100,
    y: 0,
  },
  {
    name: "stair-front",
    width: 174,
    height: 49,
    x: 998,
    y: 0,
  },
  {
    name: "mechanical",
    width: 171,
    height: 58,
    x: 381,
    y: 204,
  },
  {
    name: "phone-1",
    width: 44,
    height: 42,
    x: 555,
    y: 220,
  },
  {
    name: "phone-2",
    width: 44,
    height: 42,
    x: 599,
    y: 220,
  },
  {
    name: "phone-3",
    width: 44,
    height: 42,
    x: 643,
    y: 220,
  },
];

const DESKS = [
  // NORTH WALL
  [0, 0, true],
  [420, 0, false],
  [420 + 62 * 1, 0],
  [420 + 62 * 2, 0],
  [420 + 62 * 3, 0],
  [420 + 62 * 4, 0],
  [420 + 62 * 5, 0],
  [420 + 62 * 6, 0],
  [420 + 62 * 7, 0],
  [420 + 62 * 8, 0],
  [420 + 62 * 9, 0],
  [420 + 62 * 10, 0],
  [862 + 62 * 9, 0],
  [862 + 62 * 10, 0],
  // SOUTH WALL
  [0, 277],
  [0 + 62 * 1, 277],
  [0 + 62 * 2, 277],
  [0 + 62 * 3, 277],

  // [750, 277],
  // [816, 277],
  [862, 277],
  [862 + 62 * 1, 277],
  [862 + 62 * 2, 277],
  [862 + 62 * 3, 277],
  [862 + 62 * 4, 277],
  [862 + 62 * 5, 277],
  [862 + 62 * 6, 277],
  [862 + 62 * 7, 277],
  [862 + 62 * 8, 277],
  [862 + 62 * 9, 277],
  [862 + 62 * 10, 277],

  // CENTER BLOCKS
  // [116, 114],
  // [116, 150],
  // [174, 114],
  // [174, 150],

  // [416, 114],
  // [416, 150],
  // [474, 114],
  // [474, 150],

  // [716, 114],
  // [716, 150],
  // [774, 114],
  // [774, 150],

  // [1016, 114],
  // [1016, 150],
  // [1074, 114],
  // [1074, 150],

  // [1316, 114],
  // [1316, 150],
  // [1374, 114],
  // [1374, 150],
];

const SpaceContext = createContext({});

function SpaceProvider({ children }: any) {
  const [rented, setRented] = useState([]);
  const deskData = DESKS.map(([x, y, isDesk], idx) => ({
    id: idx,
    x,
    y,
    isDesk,
  }));

  const metrics = useMemo(
    () =>
      rented.reduce(
        (memo: any, item: any) => {
          const { id } = item;

          memo.count += 1;
          memo.ids.push(id);
          memo.perDay = memo.count * 7 * 15;
          memo.perMonth = (memo.perDay * 365) / 12;
          memo.perYear = memo.perDay * 365;

          memo.clients = memo.count * 5;
          memo.utilization = memo.count / deskData.length;

          return memo;
        },
        { ids: [], count: 0, clients: 0 }
      ),
    [rented]
  );

  const underutilized = useMemo(
    () =>
      rented.reduce(
        (memo: any, item: any) => {
          const { id } = item;

          memo.count += 1;
          memo.ids.push(id);
          memo.perDay = memo.count * 7 * 9;
          memo.perMonth = (memo.perDay * 365) / 12;
          memo.perYear = memo.perDay * 365;

          memo.clients = memo.count * 3;
          memo.utilization = memo.count / deskData.length;

          return memo;
        },
        { ids: [], count: 0, clients: 0 }
      ),
    [rented]
  );

  // function that sets rented to even indexes of deskData
  function setRentedToEven() {
    const even: any = deskData.filter((_, idx) => idx % 2 === 0);
    setRented(even);
  }

  // function that sets rented to desk data
  function setRentedToAll() {
    setRented(deskData as any);
  }

  function clear() {
    setRented([]);
  }

  return (
    <SpaceContext.Provider
      value={{
        deskData,
        metrics,
        underutilized,
        rented,
        setRented,
        setRentedToEven,
        setRentedToAll,
        clear,
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
}

function Desk({ id, x = 0, y = 0, scale = 1 }: any) {
  const { rented, setRented } = useContext(SpaceContext) as any;

  const isRented = (rented || []).some((item: any) => item.id === id);

  return (
    <rect
      width={48 * scale}
      height={30 * scale}
      x={x}
      y={y}
      fill={isRented ? PALETTE[1] : PALETTE[0]}
      stroke={PALETTE[2]}
      strokeWidth={1}
      onClick={() => {
        console.log(id, isRented);
        if (isRented) {
          setRented(rented.filter((item: any) => item.id !== id));
        } else {
          setRented([...rented, { id }]);
        }
      }}
    />
  );
}

function Desks({ scale }: any) {
  const { deskData } = useContext(SpaceContext) as any;

  return deskData.map(({ id, x, y }: any) => (
    <Desk key={id} id={id} x={x} y={y} scale={scale} />
  ));
}

function Metrics() {
  const { deskData, metrics, setRentedToEven, setRentedToAll, clear } = useContext(
    SpaceContext
  ) as any;

  const buttonStyles = {
    backgroundColor: PALETTE[0],
    color: PALETTE[2],
    border: `solid 1px ${PALETTE[2]}`,
    marginTop: 20
  };

  return (
    <div
      style={{
        color: PALETTE[2],
        fontFamily: "monospace",
        marginTop: 20,
        width: "50%",
      }}
    >
      | 15 HOUR / DAY <br />
      |----------------------------- <br />
      |- DESKS: {deskData.length} <br />
      |- RENTED: {metrics.count} <br />
      {/* |- IDS: {metrics.ids.join(",")} <br /> */}
      |- DAY: {metrics.perDay} <br />
      |- MONTH: {metrics.perMonth} <br />
      |- YEAR: {metrics.perYear} <br />
      |- CLIENTS: {metrics.clients} <br />
      |- UTILIZATION: {(metrics.utilization * 100).toFixed(0)}% <br />
      | <br />
      | <br />
      |- AVERAGE CUSTOMER <br />
      |- 3 HOURS / DAY <br />
      |- 3 DAYS / WEEK <br />
      |- ${3 * 3 * 7} / WEEK <br />
      |- ${(3 * 3 * 7 * 52) / 12} / MO <br />
      <br />
      <br />
      <br />
      <button style={buttonStyles} onClick={() => setRentedToEven()}>
        RENT EVEN
      </button>
      <br />
      <button style={buttonStyles} onClick={() => setRentedToAll()}>
        RENT ALL
      </button>
      <br />
      <button style={buttonStyles} onClick={() => clear()}>
        CLEAR
      </button>
    </div>
  );
}

function Underutilized() {
  const { deskData, underutilized } = useContext(SpaceContext) as any;

  return (
    <div
      style={{
        color: PALETTE[2],
        fontFamily: "monospace",
        marginTop: 20,
        width: "50%",
      }}
    >
      | 9 HOUR / DAY (COMMON) <br />
      |----------------------------- <br />
      |- DESKS: {deskData.length} <br />
      |- RENTED: {underutilized.count} <br />
      {/* |- IDS: {underutilized.ids.join(",")} <br /> */}
      |- DAY: {underutilized.perDay} <br />
      |- MONTH: {underutilized.perMonth} <br />
      |- YEAR: {underutilized.perYear} <br />
      |- CLIENTS: {underutilized.clients} <br />
      |- UTILIZATION: {(underutilized.utilization * 100).toFixed(0)}% <br />
    </div>
  );
}

function FloorPlan() {
  const stageRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(0);
  const [scale, setScale] = useState(null) as any;

  useEffect(() => {
    if (!stageRef.current) {
      return;
    }

    async function load() {
      const parentEl = stageRef.current;
      const { top, right, bottom, left, width, height } = (
        parentEl as any
      )?.getBoundingClientRect();
      setCurrentWidth(width);
      setScale(width / SPACE.width);

      setLoaded(true);
    }

    load();
  }, [stageRef.current]);

  return (
    <div ref={stageRef}>
      <SpaceProvider>
        <>
          {loaded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`0 0 ${currentWidth} ${SPACE.height * scale}`}
            >
              {ELEMENTS.map(({ name, width, height, x, y }, idx) => (
                <rect
                  key={idx}
                  width={width * scale}
                  height={height * scale}
                  x={x * scale}
                  y={y * scale}
                  fill={PALETTE[0]}
                  stroke={PALETTE[3]}
                  strokeWidth={1}
                />
              ))}
              <Desks scale={scale} />
            </svg>
          ) : null}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <Metrics />
            <Underutilized />
          </div>
        </>
      </SpaceProvider>
    </div>
  );
}

export default FloorPlan;
