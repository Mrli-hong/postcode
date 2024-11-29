/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import "./styles.css";
import { RequestBar } from "../../components/RequestBar";
import { RequestOptionsTab } from "../../components/RequestOptionsBar";
import { RequestOptionsWindow } from "../../components/RequestOptionsWindow";
import { Response } from "../../components/Response";
import { requestOptions } from "../../constants/request-options";
import { SaveMenuModal } from "../../features/saveRequest/RequestMenu";
import * as propTypes from "prop-types";

export const Postcode = ({ isModalVisible, setIsModalVisible }) => {
  const [selectedOption, setSelectedOption] = React.useState(
    requestOptions[0].value
  );

  return (
    <div className="request-wrapper">
      <SaveMenuModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
      <RequestBar />
      <div className="request-options-wrapper">
        <RequestOptionsTab
          selected={selectedOption}
          setSelected={setSelectedOption}
        />
        <RequestOptionsWindow selected={selectedOption} />
      </div>
      <div className="response-wrapper">
        <Response />
      </div>
    </div>
  );
};

Postcode.propTypes = {
  isModalVisible: propTypes.bool.isRequired,
  setIsModalVisible: propTypes.func.isRequired,
};
