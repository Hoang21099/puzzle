// // src/hooks/useFireworks.js
// import { useRef, useEffect } from "react";
// import { Fireworks } from "@fireworks-js/react";

// const useFireworks = () => {
//   const ref = useRef(null);

//   useEffect(() => {
//     return () => {
//       ref?.current?.clear();
//     };
//   }, []);

//   const toggleFireworks = () => {
//     if (!ref.current) return;
//     if (ref.current.isRunning) {
//       ref.current.stop();
//     } else {
//       ref.current.start();
//     }
//   };

//   const FireworksComponent = (
//     <Fireworks
//       ref={ref}
//       options={{ opacity: 0.5 }}
//       style={{
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         position: "fixed",
//         background: "transparent",
//       }}
//     />
//   );

//   return { FireworksComponent, toggleFireworks };
// };

// export default useFireworks;
