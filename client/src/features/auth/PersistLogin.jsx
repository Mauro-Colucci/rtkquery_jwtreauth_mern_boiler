import { Outlet, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import PulseLoader from "react-spinners/PulseLoader";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (
      effectRan.current === true ||
      import.meta.env.NODE_ENV !== "development"
    ) {
      //react strict mode
      const verifyRefreshToken = async () => {
        console.log("Verifying refresh token");
        try {
          //const response =
          await refresh();
          //const {accessToken} = response.data
          setTrueSuccess(true); //remove this and use  isSuccess for testing
        } catch (err) {
          console.error(err);
        }
      };
      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);
  }, []);

  let content;
  //rewrite this monstrosity
  if (!persist) {
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    console.log("loading");
    content = <PulseLoader color={"#FFF"} />;
  } else if (isError) {
    console.log("error");
    content = (
      <p className="errmsg">
        {`${error.data?.message} - `}
        <Link to="/login">Please, login again</Link>
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};
export default PersistLogin;
