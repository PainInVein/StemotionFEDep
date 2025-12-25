/** =========================
 *  components/common/Lesson.jsx
 *  props:
 *    - status = "done" | "doing" | "not_started"
 * ========================= */
import React from "react";
import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Lesson({ status, to }) {
    const isDone = status === "done";
    const isDoing = status === "doing";
    const isNot = status === "not_started";

    return (
        <Link to={to} className="flex-1 p-10 cursor-pointer select-none">
            <div className="flex-1">

                {/* ĐÃ HOÀN THÀNH */}
                {isDone && (
                    <div className="w-[200px] h-[110px] bg-[#879EFF] rounded-[50%] pb-5 flex justify-center">
                        <div className="w-[200px] h-[110px]
                  border-l-[50px] border-l-transparent
                  border-r-[50px] border-r-transparent
                  border-b-[90px] border-b-[#A0B2FF]
                  rounded-[100%] absolute flex justify-center">
                            <div className="w-[160px] h-[85px] bg-[#94AEFF] rounded-[50%] pb-3 pt-2 flex justify-center absolute">
                                <div className="w-[130px] h-[60px] bg-[#DDE4FF] rounded-[50%] flex justify-center">
                                    <div className="w-[13px] h-[60px] bg-[#94AEFF] flex justify-center relative py-2">
                                        <div className="w-[110px] h-[43px] bg-[#94AEFF] rounded-[50%] flex justify-center absolute">
                                            <div className="flex justify-center items-center h-full">
                                                <FaCheck className="text-[#DDE4FF] size-6" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ĐANG LÀM */}
                {isDoing && (
                    <div className="w-[240px] h-[145px] bg-[#A0B2FF] rounded-[50%] flex justify-center pt-2 pb-4">
                        <div className="w-[220px] h-[125px] bg-[#FFF] rounded-[50%] flex justify-center pt-1">
                            <div className="w-[200px] h-[110px] bg-[#879EFF] rounded-[50%] pb-5 flex justify-center">
                                <div className="w-[200px] h-[110px]
                      border-l-[50px] border-l-transparent
                      border-r-[50px] border-r-transparent
                      border-b-[90px] border-b-[#A0B2FF]
                      rounded-[100%] absolute flex justify-center">
                                    <div className="w-[160px] h-[85px] bg-[#94AEFF] rounded-[50%] pb-3 pt-2 flex justify-center absolute">
                                        <div className="w-[130px] h-[60px] bg-[#FFF] rounded-[50%] flex justify-center relative">
                                            <div className="w-[170px] h-[170px] absolute -top-[115px] animate-bounce">


                                                <div className="absolute top-1/2 -translate-y-1/2 h-[60px] w-full bg-[#FFD28A] rounded-[45%] shadow-[inset_4px_0_8px_rgba(255,165,128,0.6),inset_-4px_0_8px_rgba(255,165,128,0.6)]" />

                                                <div className="absolute left-1/2 -translate-x-1/2 w-[60px] h-full bg-[#FFD28A] rounded-[45%] shadow-[inset_0_4px_8px_rgba(255,165,128,0.6),inset_0_-4px_8px_rgba(255,165,128,0.6)]">

                                                    <div className="absolute left-1/2 top-1/2 
                                             -translate-x-1/2 -translate-y-1/2
                                               w-[80px] h-[80px] 
                                            bg-[#FFE7B0] rounded-full shadow-[0_0_35px_18px_rgba(255,240,194,0.9)]" />

                                                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                              flex items-center">
                                                        <div className="w-1 h-1 bg-black"></div>
                                                        <div className="w-[30px] h-[30px] bg-none rounded-full flex justify-center items-center border-2 border-black">
                                                            <div className="w-[25px] h-[25px] bg-none rounded-full">
                                                                <div className="w-[20px] h-[20px] bg-black rounded-full mt-1 ml-1 border-2 border-white">

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-2 h-1 bg-black"></div>

                                                        <div className="w-[30px] h-[30px] bg-none rounded-full flex justify-center items-center border-2 border-black">
                                                            <div className="w-[25px] h-[25px] bg-none rounded-full">
                                                                <div className="w-[20px] h-[20px] bg-black rounded-full mt-1 mr-1 border-2 border-white">

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="w-1 h-1 bg-black"></div>
                                                    </div>

                                                    <div className="absolute top-[45%] left-1/2 -translate-x-1/2">
                                                        <div className="w-[50px] h-[20px] bg-black rounded-full mx-auto  shadow-[0_0_30px_12px_rgba(255,240,194,0.7)]">
                                                            <div className="w-[40px] h-[10px] bg-white rounded-full mx-auto"></div>
                                                            <div className="w-[45px] h-[6px] bg-red-400 rounded-b-full mt-[3.5px] mx-auto"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CHƯA HOÀN THÀNH */}
                {isNot && (
                    <div className="w-[200px] h-[110px] bg-[#999999] rounded-[50%] pb-5 flex justify-center mt-10 relative">
                        <div className="w-[200px] h-[110px]
                  border-l-[50px] border-l-transparent
                  border-r-[50px] border-r-transparent
                  border-b-[90px] border-b-[#ADADAD]
                  rounded-[100%] absolute flex justify-center">
                            <div className="w-[160px] h-[85px] bg-[#E5E5E5] rounded-[50%] pb-3 pt-2 flex justify-center absolute">
                                <div className="w-[130px] h-[60px] bg-[#CCCCCC] rounded-[50%] flex justify-center">
                                    <div className="w-[13px] h-[60px] bg-[#E5E5E5] flex justify-center relative py-2">
                                        <div className="w-[110px] h-[43px] bg-[#E5E5E5] rounded-[50%] flex justify-center absolute" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Link>
    );
}
