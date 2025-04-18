import React, { useState } from "react";

type OptionType = {
  qr_code: Boolean;
  phone: Boolean;
};
interface LoginController {
  option: OptionType;
  setOption: (option: OptionType) => void;
}

const useLoginController = (): LoginController => {
  const [option, setOption] = useState<OptionType>({
    qr_code: false,
    phone: true,
  });

  return {
    option,
    setOption,
  };
};

export default useLoginController;
