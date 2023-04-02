import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AiOutlineSend } from "react-icons/ai";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import { RiUserVoiceFill } from "react-icons/ri";

function App() {
  const [show, setShow] = useState(false);
  const [ans, setAns] = useState(null);
  const [txt, setTxt] = useState(null);
  const [dlg, setDlg] = useState([]);
  const [dlglen, setDlgLen] = useState(0);
  const [code, setCode] = useState(null);
  const [ip, setIP] = useState(null);
  const [voice, setVoice] = useState(3);
  const [aniin, setAniin] = useState(false);
  const [hamtog, setHamTog] = useState(true);
  const refinput = useRef();
  // ur backend url here
  const url = "";

  const [promocode, setPromoCode] = useState(null);

  async function getIP() {
    const res = await axios.get(`${url}/ip`);
    setIP(res?.data);
  }
  async function getPC() {
    const res = await axios.post(`${url}/pcode`);
    setPromoCode(res.data);
  }

  useEffect(() => {
    getIP();
    getPC();
  }, []);

  async function getAns() {
    setAns(null);
    setDlg([...dlg, { txt: txt, ans: null }]);
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    await axios
      .post(`${url}/post`, {
        code: "iloveai",
        text: txt,
      })
      .then(
        (res) => {
          setAns(res.data.choices[0]["text"]);
        },

        (err) => {
          setAns(err.response.statusText);
          console.log(err.response.statusText);
        }
      );
  }

  useEffect(() => {
    if (ans) {
      dlg[dlg.length - 1]["ans"] = ans;
      // console.log(dlg[dlg.length - 1]["ans"]);
      setDlg([...dlg]);
      setDlgLen(dlg?.length);
    }
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [ans, dlglen]);

  const handlesubmite = (e) => {
    e.preventDefault();
    refinput.current.reset();
    getAns();
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const msg = new SpeechSynthesisUtterance();
  const speechHandler = (msg, speechtxt) => {
    // console.log(speeck);
    msg.text = speechtxt;
    msg.voice = speechSynthesis.getVoices()[voice];
    // console.log(speechSynthesis.getVoices());
    window.speechSynthesis.speak(msg);
  };

  const handdleshow = () => {
    if (show) {
      setAniin(true);
      setTimeout(() => {
        setShow(false);
      }, 600);
    }
    if (!show) {
      setAniin(false);
      setShow(true);
    }
  };

  return (
    <div className="mb-[4em] text-gray-300">
      <div className="bg-gray-900 h-[3.5em] z-20 flex justify-between items-center p-[.5em] w-screen fixed top-0 border-b-2 border-gray-900">
        <div className="flex gap-1">
          <div
            className="bg-gray-600 z-10 w-9 h-8 flex justify-center items-center rounded-sm hover:cursor-pointer"
            onClick={() => {
              handdleshow(), setHamTog(!hamtog);
            }}
          >
            {hamtog ? (
              <GiHamburgerMenu size="2em" />
            ) : (
              <GiCancel size="1.5em" />
            )}
          </div>{" "}
        </div>
        <div className="absolute font-bold  w-screen flex justify-center">
          Ethio-GPT
        </div>
      </div>
      <div className="flex w-full fixed bottom-2 h-[3em] justify-center">
        <form
          ref={refinput}
          className="rounded-l-md border-gray-900 border-2 overflow-hidden sm:max-w-[40em] flex w-[85%]"
          onSubmit={handlesubmite}
        >
          <input
            className="w-full placeholder:text-gray-300 break-all bg-gray-600 p-2 outline-none"
            type="text"
            placeholder="type your question here..."
            onChange={(e) => setTxt(e.target.value)}
          />
        </form>
        <button
          className="bg-gray-900 rounded-r-md w-[3em] border-gray-900 border-2 flex justify-center items-center"
          onClick={() => {
            getAns();
            refinput.current.reset();
          }}
        >
          <AiOutlineSend size="1.5em" />
        </button>
      </div>
      <div className="container max-w-[40em] w-full mx-auto mt-[3.5em] mb-[3em]">
        {dlg?.map((data, index) => {
          return (
            <div key={index} className="p-2 flow-root">
              <div className="float-left w-full">
                <div className="bg-gray-900 mb-3 float-left min-w-[40%] max-w-[85%] sm:w-[30em] p-1 rounded-md break-all">
                  <div className="pl-1">User IP: {ip}</div>
                  <div className="bg-gray-700 p-1">{data.txt || "..."} </div>
                </div>
              </div>

              <div className="bg-gray-900 float-right break-all min-w-[40%] max-w-[85%] p-1 rounded-md show_delay">
                {!data.ans && (
                  <div className="absolute bg-sky-700 rounded-full w-[.7em] h-[.7em] flex justify-center items-center">
                    <div className="h-[.7em] w-[.7em] animate-ping rounded-full bg-sky-400 opacity-75"></div>
                  </div>
                )}
                {data.ans && (
                  <div
                    className="absolute h-[1.3em] w-[1.4em] flex justify-center rounded-md items-center text-gray-100 hover:cursor-pointer"
                    onClick={() => speechHandler(msg, data.ans)}
                  >
                    <RiUserVoiceFill />{" "}
                  </div>
                )}

                <div className="flex pr-1 justify-end">Ethio-GPT</div>
                <div className={`bg-gray-700 p-1`}>
                  {data.ans || "writing ..."}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {show && (
        <div
          className={`border-t-2 pb-1  fixed border-gray-900 sm:left-0 sm:h-screen sm:top-0 bottom-0 sm:w-[25em] w-screen h-[55vh] bg-gray-700 sm:rounded-none rounded-t-2xl overflow-hidden text-gray-300 ${
            !aniin
              ? " sm:cusome_pc_ani_in custome_ani_in"
              : " sm:cusome_pc_ani_out custome_ani_out"
          }`}
        >
          <div className="flex justify-between p-2 items-center w-full h-[1.7em]">
            <div></div>
            <div className="bg-gray-900 rounded-md w-[5em] h-[.3em]"></div>
            <div
              className="pt-2 hover:cursor-pointer"
              // onClick={() => setShow(false)}
            >
              {/* <GiCancel color="#000" size="1.5em" /> */}
            </div>
          </div>
          <ul className="sm:h-[60vh] sm:mt-[2em] h-full p-2 flex justify-evenly flex-col">
            <li className="h-[4em] flex justify-between gap-2 items-center rounded-md">
              <div
                className={`${
                  voice == 3 && "border-gray-400 border-2"
                } flex items-center justify-center hover:cursor-pointer bg-gray-900 rounded-md w-[30%] h-[80%]`}
                onClick={() => {
                  setVoice(3);
                }}
              >
                male UK
              </div>
              <div
                className={`${
                  voice == 2 && "border-gray-400 border-2"
                } flex items-center justify-center hover:cursor-pointer bg-gray-900 rounded-md w-[30%] h-[80%]`}
                onClick={() => {
                  setVoice(2);
                }}
              >
                female US
              </div>
              <div
                className={`${
                  voice == 1 && "border-gray-400 border-2"
                } flex items-center justify-center bg-gray-900 hover:cursor-pointer rounded-md w-[30%] h-[80%]`}
                onClick={() => {
                  setVoice(1);
                }}
              >
                female UK
              </div>
            </li>
            <li className="h-[4em] flex items-center bg-gray-900 p-2 rounded-md">
              Your currunt total question: {dlglen}
            </li>
            <li className="h-[4em] flex items-center bg-gray-900 p-2 rounded-md">
              Currunt plan: free
            </li>
            <li
              className="h-[4em] flex items-center bg-green-900 p-2 rounded-md"
              // onClick={() => alert("soon")}
            >
              Subscribe for plus (coming soon...)
            </li>
            <li className="h-[4em] flex items-center bg-gray-900 p-2 rounded-md">
              <div className="flex w-full items-center">
                <div className="h-[2.25em] w-[8em] bg-gray-900 p-1 text-gray-300">
                  Promo code
                </div>
                <input
                  className={`bg-gray-600 text-gray-900 h-[3em] w-full border-gray-900 border-2 outline-none rounded-md p-1 ${
                    promocode == code
                      ? "border-green-500"
                      : !code
                      ? "border-gray-900"
                      : "border-red-500"
                  }`}
                  type="text"
                  placeholder="enter your promo code here"
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </li>
            <li className="h-[4em] flex items-center bg-gray-900 p-2 rounded-md">
              Your IP address: {ip}
            </li>
            <li className="h-[4em] mb-4 flex justify-center items-center text-gray-900 bg-gray-300 font-bold p-2 rounded-md">
              @2023 Ethio-GPT. All rights reserved.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
