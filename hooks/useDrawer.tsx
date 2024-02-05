"use client";
import classNames from "classnames";
import React from "react";

function makeId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

interface DrawerProps {
  actionKey: string;
}

// const Drawer = ({
//   actionKey,
//   children,
// }: React.PropsWithChildren<DrawerProps>) => {
//   return (
//     <div className="drawer drawer-end">
//       <input id={actionKey} type="checkbox" className="drawer-toggle" />
//       <div className="drawer-side">
//         <label
//           htmlFor={actionKey}
//           aria-label="close sidebar"
//           className="drawer-overlay"
//         ></label>
//         <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

const useDrawer = () => {
  // const [drawerKey] = React.useState(makeId(6));
  const [isOpen, setIsOpen] = React.useState(true);
  // const controlRef = React.useRef<HTMLLabelElement>(null);

  const _drawer = ({ children }: React.PropsWithChildren) => {
    if (!isOpen) return null;

    return (
      <div className="flex z-50">
        <div
          className="fixed top-0 left-0 bg-slate-500 w-full h-screen"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          <div
            className="w280 p-4 bg-white h-screen text-slate-500"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-2xl font-semibold">Sidebar</h1>
            <ul className="mt-4">
              <li className="mb-2">
                <a href="#" className="block hover:text-indigo-400">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="block hover:text-indigo-400">
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="block hover:text-indigo-400">
                  Services
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="block hover:text-indigo-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );

    // return (
    //   <div
    //     className={`fixed inset-0 bg-slate-500 z-50`}
    //     onClick={(e) => {
    //       e.stopPropagation();
    //       setIsOpen(false);
    //     }}
    //   >
    //     <div className="fixed inset-3 h-screen w-96 bg-white p-4" onClick={e => e.stopPropagation()}>
    //       {/* Your drawer content goes here */}
    //       <div className="">123</div>
    //       {/* <div className="text-xl font-bold mb-4">Drawer Content</div> */}
    //     </div>
    //   </div>
    // );

    // const drawerStateCn = classNames({
    //   "fixed top-0 left-0 h-full w-64 bg-slate-500 text-white p-4 transform transition-transform ease-in-out":
    //     true,
    //   "translate-x-0": isOpen,
    //   "-translate-x-full": !isOpen,
    // });

    // return (
    //   <div onClick={() => setIsOpen((prev) => !prev)}>
    //     <div className={drawerStateCn}>
    //       <div>
    //         <p>This is the drawer content.</p>
    //         {children}
    //       </div>
    //     </div>
    //   </div>
    // );
  };

  const open = () => {
    setIsOpen(true);
    // if (controlRef.current) controlRef.current.click();
  };

  return {
    Drawer: _drawer,
    open,
  };
};

export default useDrawer;
