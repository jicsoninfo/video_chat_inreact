
import {io} from "socket.io-client";
import React, {createContext, useContext, useMemo} from "react";

const SocketContext = createContext(null);

export const SocketProvider = (props) => {
    const socket = useMemo(()=>io("localhost:8096"), []);
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}