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
                    <div className="
                                    w-[140px] h-[80px]
                                    sm:w-[160px] sm:h-[90px]
                                    md:w-[200px] md:h-[110px]
                                    bg-[#879EFF] rounded-[50%] pb-2 sm:pb-3 md:pb-5 flex justify-center
                                    ">
                        <div className="
                                        w-[140px] h-[80px]
                                        sm:w-[160px] sm:h-[90px]
                                        md:w-[200px] md:h-[110px]
                                        border-l-[30px] sm:border-l-[40px] md:border-l-[50px] border-l-transparent
                                        border-r-[30px] sm:border-r-[40px] md:border-r-[50px] border-r-transparent
                                        border-b-[55px] sm:border-b-[70px] md:border-b-[90px] border-b-[#A0B2FF]
                                        rounded-[100%] absolute flex justify-center
                                        ">
                            <div className="
                                            w-[110px] h-[60px]
                                            sm:w-[130px] sm:h-[70px]
                                            md:w-[160px] md:h-[85px]
                                            bg-[#94AEFF] rounded-[50%] pb-2 sm:pb-2 md:pb-3 pt-1 sm:pt-2 flex justify-center absolute
                                        ">
                                <div className="
                                                w-[90px] h-[45px]
                                                sm:w-[110px] sm:h-[50px]
                                                md:w-[130px] md:h-[60px]
                                                bg-[#DDE4FF] rounded-[50%] flex justify-center
                                                ">
                                    <div className="
                                                    w-[9px] h-[45px]
                                                    sm:w-[11px] sm:h-[55px]
                                                    md:w-[13px] md:h-[60px]
                                                    bg-[#94AEFF] flex justify-center relative py-1 sm:py-2
                                                ">
                                        <div className="
                                                        w-[75px] h-[30px]
                                                        sm:w-[95px] sm:h-[37px]
                                                        md:w-[110px] md:h-[43px]
                                                        bg-[#94AEFF] rounded-[50%] flex justify-center absolute
                                                        ">
                                            <div className="flex justify-center items-center h-full">
                                                <FaCheck className="
                                                                    text-[#DDE4FF]
                                                                    w-3 h-3
                                                                    sm:w-4 sm:h-4
                                                                    md:w-6 md:h-6
                                                                "/>
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
                    <div className="
                                    w-[160px] h-[95px]
                                    sm:w-[200px] sm:h-[120px]
                                    md:w-[240px] md:h-[145px]
                                    bg-[#A0B2FF] rounded-[50%]
                                    flex justify-center
                                    pt-1 sm:pt-2 md:pt-2
                                    pb-2 sm:pb-3 md:pb-4
                                    ">
                        <div className="
                                        w-[150px] h-[85px]
                                        sm:w-[180px] sm:h-[105px]
                                        md:w-[220px] md:h-[125px]
                                        bg-[#FFF] rounded-[50%] flex justify-center
                                        pt-1
                                    ">
                            <div className="
                                            w-[135px] h-[75px]
                                            sm:w-[165px] sm:h-[95px]
                                            md:w-[200px] md:h-[110px]
                                            bg-[#879EFF] rounded-[50%]
                                            pb-3 sm:pb-4 md:pb-5 flex justify-center
                                            ">
                                <div className="
                                                w-[135px] h-[75px]
                                                sm:w-[165px] sm:h-[95px]
                                                md:w-[200px] md:h-[110px]
                                                border-l-[25px] sm:border-l-[40px] md:border-l-[50px] border-l-transparent
                                                border-r-[25px] sm:border-r-[40px] md:border-r-[50px] border-r-transparent
                                                border-b-[45px] sm:border-b-[70px] md:border-b-[90px]
                                                border-b-[#A0B2FF]
                                                rounded-[100%] absolute flex justify-center
                                            ">
                                    <div className="
                                                    w-[110px] h-[55px]
                                                    sm:w-[135px] sm:h-[70px]
                                                    md:w-[160px] md:h-[85px]
                                                    bg-[#94AEFF] rounded-[50%]
                                                    pb-2 sm:pb-2 md:pb-3
                                                    pt-1 sm:pt-2
                                                    flex justify-center
                                                    absolute
                                                    ">
                                        <div className="
                                                        w-[90px] h-[40px]
                                                        sm:w-[110px] sm:h-[50px]
                                                        md:w-[130px] md:h-[60px]
                                                        bg-[#FFF] rounded-[50%]
                                                        flex justify-center
                                                        relative
                                                    ">
                                            <div className="
                                                            w-[120px] h-[120px]
                                                            sm:w-[150px] sm:h-[150px]
                                                            md:w-[170px] md:h-[170px]
                                                            absolute
                                                            -top-[80px] sm:-top-[100px] md:-top-[115px]
                                                            animate-bounce
                                                            ">
                                                <div className="
                                                                absolute top-1/2 -translate-y-1/2
                                                                h-[45px] sm:h-[55px] md:h-[60px]
                                                                w-full
                                                                bg-[#FFD28A] rounded-[45%]
                                                                shadow-[inset_4px_0_8px_rgba(255,165,128,0.6),inset_-4px_0_8px_rgba(255,165,128,0.6)]
                                                            "/>
                                                <div className="
                                                                absolute left-1/2 -translate-x-1/2
                                                                w-[45px] sm:w-[55px] md:w-[60px]
                                                                h-full bg-[#FFD28A]
                                                                rounded-[45%]
                                                                shadow-[inset_0_4px_8px_rgba(255,165,128,0.6),inset_0_-4px_8px_rgba(255,165,128,0.6)]
                                                            ">
                                                    <div className="
                                                                    absolute left-1/2 top-1/2
                                                                    -translate-x-1/2 -translate-y-1/2
                                                                    w-[60px] sm:w-[70px] md:w-[80px]
                                                                    h-[60px] sm:h-[70px] md:h-[80px]
                                                                    bg-[#FFE7B0] rounded-full
                                                                    shadow-[0_0_25px_14px_rgba(255,240,194,0.9)]
                                                                    "/>
                                                    <div className="
                                                                    absolute top-[33%]
                                                                    left-1/2 -translate-x-1/2 -translate-y-1/2
                                                                    flex items-center
                                                                    ">
                                                        <div className="w-1 h-1 bg-black"></div>
                                                        <div className="
                                                                        w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] md:w-[30px] md:h-[30px]
                                                                        bg-none rounded-full flex justify-center items-center border-2 border-black
                                                                    ">
                                                            <div className="
                                                                            w-[13px] h-[13px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]
                                                                            bg-black rounded-full
                                                                            mt-[2px] sm:mt-[2px] md:mt-[4px] ml-[2px] sm:ml-[3px] md:ml-[4px]
                                                                            border-[2px] sm:border-[3px] md:border-[3px] border-white
                                                                            "/>
                                                        </div>

                                                        <div className="w-[6px] h-[3px] bg-black"></div>

                                                        <div className="
                                                                        w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] md:w-[30px] md:h-[30px]
                                                                        rounded-full flex justify-center items-center border-2 border-black
                                                                    ">
                                                            <div className="
                                                                            w-[13px] h-[13px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px]
                                                                            bg-black rounded-full
                                                                            mt-[2px] sm:mt-[2px] md:mt-[4px] mr-[2px] sm:mr-[3px] md:mr-[4px]
                                                                            border-[2px] sm:border-[3px] md:border-[3px] border-white
                                                                            "/>
                                                        </div>
                                                        <div className="w-1 h-1 bg-black"></div>
                                                    </div>

                                                    <div className="
                                                                    absolute top-[45%]
                                                                    left-1/2 -translate-x-1/2
                                                                    ">
                                                        <div className="
                                                                        w-[35px] h-[15px] sm:w-[45px] sm:h-[18px] md:w-[50px] md:h-[20px]
                                                                        bg-black rounded-full mx-auto
                                                                        shadow-[0_0_20px_10px_rgba(255,240,194,0.7)]
                                                                    ">
                                                            <div className="w-[26px] h-[7px] sm:w-[32px] sm:h-[8px] md:w-[40px] md:h-[10px] bg-white rounded-full mx-auto"></div>
                                                            <div className="w-[32px] h-[4px] sm:w-[38px] sm:h-[5px] md:w-[45px] md:h-[6px] bg-red-400 rounded-b-full mt-[4px] mx-auto"></div>
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
                    <div className="
                                    w-[140px] h-[80px]
                                    sm:w-[160px] sm:h-[90px]
                                    md:w-[200px] md:h-[110px]
                                    bg-[#999999] rounded-[50%]
                                    pb-2 sm:pb-3 md:pb-5
                                    flex justify-center
                                    relative
                                    ">
                        <div className="
                                        w-[140px] h-[80px]
                                        sm:w-[160px] sm:h-[90px]
                                        md:w-[200px] md:h-[110px]
                                        border-l-[30px] sm:border-l-[40px] md:border-l-[50px] border-l-transparent
                                        border-r-[30px] sm:border-r-[40px] md:border-r-[50px] border-r-transparent
                                        border-b-[55px] sm:border-b-[70px] md:border-b-[90px]
                                        border-b-[#ADADAD]
                                        rounded-[100%]
                                        absolute flex justify-center
                                    ">
                            <div className="
                                            w-[110px] h-[60px]
                                            sm:w-[130px] sm:h-[70px]
                                            md:w-[160px] md:h-[85px]
                                            bg-[#E5E5E5]
                                            rounded-[50%]
                                            pb-2 sm:pb-2 md:pb-3
                                            pt-1 sm:pt-2
                                            flex justify-center
                                            absolute
                                            ">
                                <div className="
                                                w-[90px] h-[45px]
                                                sm:w-[110px] sm:h-[50px]
                                                md:w-[130px] md:h-[60px]
                                                bg-[#CCCCCC]
                                                rounded-[50%]
                                                flex justify-center
                                            ">
                                    <div className="
                                                    w-[9px] h-[45px]
                                                    sm:w-[11px] sm:h-[55px]
                                                    md:w-[13px] md:h-[60px]
                                                    bg-[#E5E5E5]
                                                    flex justify-center
                                                    relative
                                                    py-1 sm:py-2
                                                    ">
                                        <div className="
                                                        w-[75px] h-[30px]
                                                        sm:w-[95px] sm:h-[37px]
                                                        md:w-[110px] md:h-[43px]
                                                        bg-[#E5E5E5]
                                                        rounded-[50%]
                                                        flex justify-center
                                                        absolute
                                                    "/>
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
