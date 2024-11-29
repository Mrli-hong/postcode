import * as React from "react";
import "./App.css";
import { responseUpdated } from "./features/response/responseSlice";
import { Postcode } from "./pages/Postcode";
import { useAppDispatch } from "./redux/hooks";
import { callbacks, VscodeData, VscodeDataWithCbId } from "./utils/vscode";

const App = () => {
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const messageHandler = {
    response(event) {
      dispatch(responseUpdated(event.data));
    },
    saveRequest() {
      // TODO: save the response
      setIsModalVisible(true);
    },
  };

  React.useEffect(() => {
    const listener = (event: MessageEvent<VscodeData>) => {
      const message = event.data;
      switch (message.cmd) {
        case "vscodeCallback":
          callbacks[(message as VscodeDataWithCbId).cbid] &&
            callbacks[(message as VscodeDataWithCbId).cbid](message.data);
          delete callbacks[(message as VscodeDataWithCbId).cbid];
          break;
        default:
          messageHandler[message.cmd] && messageHandler[message.cmd](message);
          break;
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  return (
    <div className="App">
      <Postcode
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </div>
  );
};

export default App;
