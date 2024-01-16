const Processor = () => (
  <div className="flex flex-col justify-center items-center bg-gradient-to-br from-neutral-800 to-neutral-600 px-4 py-2 rounded-md ring-[2px] ring-neutral-600">
    <div className="flex flex-col justify-center items-center font-bold tracking-widest transition-colors duration-300 metallic-text">
      <span>Powered By </span>
      <span>Your Own Device</span>
    </div>
  </div>
);

const Pin = ({
  position,
  rotate,
}: {
  position: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  rotate?: string;
}) => (
  <div
    style={position}
    className={`absolute ${rotate} bg-white w-1.5 h-4 rounded-sm bg-gradient-to-t from-neutral-200 to-neutral-800 hover:brightness-150 hover:scale-110 ring-[0.5px] ring-neutral-900`}
  />
);

const PowerGrid = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center">
      <div className="absolute w-[220px] h-[100px] -top-[18px] bg-emerald-200 blur-lg animate-pulse delayed-component" />
      <div className="z-10 relative flex">
        <Processor />
        {[...Array(8)].map((_, index) => (
          <Pin
            key={`top-${index}`}
            position={{ top: -17, left: (index + 1) * 20 }}
          />
        ))}
        {[...Array(8)].map((_, index) => (
          <Pin
            key={`bottom-${index}`}
            position={{ bottom: -17, left: (index + 1) * 20 }}
            rotate="rotate-180"
          />
        ))}
        {[...Array(3)].map((_, index) => (
          <Pin
            key={`left-${index}`}
            position={{ top: index === 0 ? 5 : index * 20 + 5, left: -12 }}
            rotate={"-rotate-90"}
          />
        ))}
        {[...Array(3)].map((_, index) => (
          <Pin
            key={`right-${index}`}
            position={{ top: index === 0 ? 5 : index * 20 + 5, right: -12 }}
            rotate={"rotate-90"}
          />
        ))}
      </div>
    </div>
  );
};

export default PowerGrid;
